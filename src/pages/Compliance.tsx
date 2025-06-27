import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Modal from '@/components/ui/modal';
import { useAuth } from '@/context/AuthContext';
import { 
  Plus, Search, Download, CheckCircle, X, HelpCircle, Server, Save, AlertCircle, 
  RotateCcw, OctagonX, Eraser, Check, FileText 
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface Device {
  device_id: string;
  uuid: string;
  type: 'os' | 'service';
  device_subtype: string;
  ip_address: string;
  machine_name: string;
  description?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'decommissioned';
  decommissioned_on?: string;
  decommissioned_by?: string;
  decommission_details?: string;
}

interface ComplianceCheck {
  id: string;
  title: string;
  category: string;
  criticality: 'High' | 'Medium' | 'Low';
  description: string;
  status: 'pass' | 'fail' | 'skip' | null;
}

const Compliance = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCheckDetail, setShowCheckDetail] = useState<ComplianceCheck | null>(null);
  const [showSaveConfig, setShowSaveConfig] = useState(false);
  const [configName, setConfigName] = useState('');
  const [configComments, setConfigComments] = useState('');
  const [newDevice, setNewDevice] = useState({
    uuid: crypto.randomUUID(),
    type: 'os' as 'os' | 'service',
    device_subtype: '',
    ip_address: '',
    machine_name: '',
    description: '',
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    status: 'active' as 'active' | 'decommissioned',
  });
  const [filteredDeviceNames, setFilteredDeviceNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [checksLoading, setChecksLoading] = useState(false);
  const [deviceErrors, setDeviceErrors] = useState<{ [key: string]: string }>({});
  const [benchmarkOptions, setBenchmarkOptions] = useState<string[]>([]);
  const [benchmarkSearch, setBenchmarkSearch] = useState('');

  // Extract unique device names from devices for autocomplete
  const deviceNameOptions = Array.from(new Set(devices.map(d => d.machine_name).filter(Boolean)));

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    if (user && token && user.user_id) {
      console.log('User:', user, 'Token:', token); // Debug
      fetchDevices();
    } else {
      console.warn('Missing user or token, redirecting to auth'); // Debug
      navigate('/auth');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (selectedDevice) {
      fetchComplianceChecks(selectedDevice.device_subtype);
    } else {
      setChecks([]);
    }
  }, [selectedDevice]);

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const response = await axios.get<{ benchmarks: { name: string }[] }>('http://localhost:3000/csv_db/csv_benchmarks/benchmarks', {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: benchmarkSearch || undefined, page: 1, pageSize: 50 },
        });
        if (response.data && Array.isArray(response.data.benchmarks)) {
          setBenchmarkOptions(response.data.benchmarks.map((b) => b.name));
        } else {
          setBenchmarkOptions([]);
        }
      } catch (error: any) {
        setBenchmarkOptions([]);
      }
    };
    if (showAddDevice && token) fetchBenchmarks();
  }, [showAddDevice, token, benchmarkSearch]);

  const validateDevice = () => {
    const errors: { [key: string]: string } = {};
    if (!newDevice.type) errors.type = 'Device type is required';
    if (!newDevice.device_subtype) errors.device_subtype = 'Device subtype is required';
    if (!newDevice.ip_address || !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(newDevice.ip_address)) {
      errors.ip_address = 'Valid IPv4 address is required';
    }
    if (!newDevice.machine_name) errors.machine_name = 'Machine name is required';
    if (!newDevice.owner_name) errors.owner_name = 'Owner name is required';
    if (!newDevice.owner_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newDevice.owner_email)) {
      errors.owner_email = 'Valid email is required';
    }
    if (!newDevice.owner_phone || !/^\+?[1-9]\d{1,14}$/.test(newDevice.owner_phone)) {
      errors.owner_phone = 'Valid phone number is required';
    }
    setDeviceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(response.data as Device[]);
    } catch (error: any) {
      console.error('Fetch devices error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          variant: 'destructive',
        });
        logout();
        navigate('/auth');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to load devices.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper: get benchmark object by name
  const getBenchmarkByName = (name: string) => {
    // Find the benchmark object from the last fetched options (if you want to use id or another field)
    // You may want to store the full benchmark object in benchmarkOptions, not just name
    return null; // Placeholder for future use
  };

  const fetchComplianceChecks = async (subtype: string) => {
    setChecksLoading(true);
    try {
      // Try to find the exact benchmark object (if you have id, use it)
      // Otherwise, fallback to using the name as before
      const encodedSubtype = encodeURIComponent(subtype);
      // Try with /devices/checks/by-title?title=... (if your backend supports it)
      let url = `${API_BASE_URL}/devices/checks/${encodedSubtype}`;
      // If you have a /devices/checks/by-title endpoint, use:
      // let url = `${API_BASE_URL}/devices/checks/by-title?title=${encodedSubtype}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChecks((response.data as ComplianceCheck[]).map(check => ({
        ...check,
        status: null,
      })));
    } catch (error: any) {
      // Try fallback: if 404, try with a fallback endpoint or show a user-friendly message
      setChecks([]);
      toast({
        title: 'No Compliance Checks Found',
        description: `No compliance checks available for this benchmark. Please select another or contact support if this is unexpected.`,
        variant: 'destructive',
      });
    } finally {
      setChecksLoading(false);
    }
  };

  const handleAddDevice = async () => {
    if (!validateDevice()) {
      toast({
        title: 'Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/devices`,
        {
          uuid: newDevice.uuid,
          type: newDevice.type,
          device_subtype: newDevice.device_subtype.trim(),
          ip_address: newDevice.ip_address.trim(),
          machine_name: newDevice.machine_name.trim(),
          description: newDevice.description?.trim() || undefined,
          owner_name: newDevice.owner_name?.trim() || undefined,
          owner_phone: newDevice.owner_phone?.trim() || undefined,
          owner_email: newDevice.owner_email?.trim() || undefined,
          status: newDevice.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newDeviceData = response.data as Device;
      setDevices([...devices, newDeviceData]);
      setSelectedDevice(newDeviceData);
      setNewDevice({
        uuid: crypto.randomUUID(),
        type: 'os',
        device_subtype: '',
        ip_address: '',
        machine_name: '',
        description: '',
        owner_name: '',
        owner_phone: '',
        owner_email: '',
        status: 'active',
      });
      setFilteredDeviceNames([]);
      setDeviceErrors({});
      setShowAddDevice(false);
      toast({
        title: 'Success',
        description: 'Device added successfully.',
      });
    } catch (error: any) {
      console.error('Add device error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add device.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (format: 'pdf' | 'csv' | 'json') => {
    if (!selectedDevice) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/csv_db/csv_benchmarks/benchmarks/download/${format}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
          params: { device_subtype: selectedDevice.device_subtype },
        }
      );

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes(format)) {
        throw new Error(`Invalid ${format.toUpperCase()} content received`);
      }

      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${selectedDevice.machine_name}_${selectedDevice.device_subtype.replace(/\s/g, '_')}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Download Successful',
        description: `Downloaded benchmark for ${selectedDevice.machine_name} as ${format.toUpperCase()}.`,
      });
    } catch (error: any) {
      console.error('Download error:', error.response?.data || error.message);
      toast({
        title: 'Download Failed',
        description: error.response?.data?.message || `Failed to download ${format.toUpperCase()} file.`,
        variant: 'destructive',
      });
    }
  };

  // Add missing handleDeleteDevice function
  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/devices/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(prev => prev.filter(device => device.device_id !== deviceId));
      if (selectedDevice && selectedDevice.device_id === deviceId) {
        setSelectedDevice(null);
        setChecks([]);
      }
      toast({
        title: 'Device Deleted',
        description: 'The device has been deleted successfully.',
      });
    } catch (error: any) {
      console.error('Delete device error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete device.',
        variant: 'destructive',
      });
    }
  };

  const handleCheckChange = (checkId: string, status: 'pass' | 'fail' | 'skip' | null) => {
    setChecks(checks.map(check =>
      check.id === checkId
        ? { ...check, status: check.status === status ? null : status }
        : check
    ));
  };

  const handleResetChecks = () => {
    setChecks(checks.map(check => ({ ...check, status: null })));
    toast({
      title: 'Checks Reset',
      description: 'All compliance check statuses have been cleared.',
    });
  };

  const handleSaveConfig = async () => {
    if (!selectedDevice || !configName.trim()) {
      toast({
        title: 'Error',
        description: 'Configuration name and selected device are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/saved-configurations`,
        {
          device_id: selectedDevice.device_id,
          device_name: selectedDevice.machine_name, // <-- send device name
          name: configName.trim(),
          comments: configComments.trim() || undefined,
          checks: checks.map(check => ({
            check_id: check.id,
            status: check.status === 'pass' ? true : check.status === 'fail' ? false : null,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowSaveConfig(false);
      setConfigName('');
      setConfigComments('');
      handleResetChecks();
      toast({
        title: 'Success',
        description: 'Configuration saved successfully.',
      });
      navigate('/saved-configurations');
    } catch (error: any) {
      console.error('Save config error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save configuration.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedDevice) return;
    toast({
      title: 'Report Generation',
      description: 'Report generation is not yet implemented. Save configuration to generate reports later.',
      variant: 'default',
    });
    // Future: Implement POST /reports
  };

  const canGenerateReport = selectedDevice && checks.every(check => check.status !== null);
  const canSaveConfiguration = selectedDevice && checks.some(check => check.status !== null);

  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <span>Authentication Required</span>
            </CardTitle>
            <CardDescription>Please log in to access the compliance check feature</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredChecks = checks.filter(
    check =>
      check.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Compliance Check</h1>
            <p className="text-muted-foreground">Assess your infrastructure against CIS benchmarks</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowHelp(true)}>
            <HelpCircle className="mr-2 h-4 w-4" />
            How to Use
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-6 w-6" />
              <span>Select Device</span>
            </CardTitle>
            <CardDescription>Choose a device to perform compliance check</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading devices...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No devices found. Add a new device to start.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {devices.map(device => (
                  <Card
                    key={device.device_id}
                    className={`cursor-pointer transition-all ${
                      selectedDevice?.device_id === device.device_id
                        ? 'ring-2 ring-brand-green bg-brand-green/5'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{device.machine_name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                            {device.status}
                          </Badge>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="ml-2"
                            title="Delete Device"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteDevice(device.device_id);
                            }}
                          >
                            <Eraser className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{device.device_subtype}</p>
                      <p className="text-sm text-muted-foreground">{device.ip_address}</p>
                      {device.owner_name && (
                        <p className="text-sm text-muted-foreground">Owner: {device.owner_name}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <Button variant="outline" onClick={() => setShowAddDevice(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Device
            </Button>
          </CardContent>
        </Card>

        {selectedDevice && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Download Benchmark Files</CardTitle>
                <CardDescription>
                  Download benchmark files for {selectedDevice.machine_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => handleDownload('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleDownload('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleDownload('json')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Compliance Checks</CardTitle>
                    <CardDescription>
                      Review and mark compliance status for each control
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleResetChecks}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by reference ID or title..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {checksLoading ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading compliance checks...</p>
                  </div>
                ) : checks.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      No compliance checks available for {selectedDevice.device_subtype}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredChecks.map(check => (
                      <div
                        key={check.id}
                        className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex space-x-2">
                          <Button
                            title="Pass"
                            variant={check.status === 'pass' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleCheckChange(check.id, 'pass')}
                            className={check.status === 'pass' ? 'bg-green-500 hover:bg-green-600' : ''}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            title="Fail"
                            variant={check.status === 'fail' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => handleCheckChange(check.id, 'fail')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            title="Skip"
                            variant={check.status === 'skip' ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => handleCheckChange(check.id, 'skip')}
                            className={check.status === 'skip' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}
                          >
                            <OctagonX className="h-4 w-4" />
                          </Button>
                          <Button
                            title="Reset"
                            variant={check.status === null ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => handleCheckChange(check.id, null)}
                          >
                            <Eraser className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="link"
                          className="font-mono text-brand-green hover:text-brand-green/80 p-0"
                          onClick={() => setShowCheckDetail(check)}
                        >
                          {check.id}
                        </Button>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{check.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {check.category}
                            </Badge>
                            <Badge
                              variant={check.criticality === 'High' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {check.criticality}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {checks.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-semibold">Configuration Actions</h4>
                        <p className="text-sm text-muted-foreground">
                          Save your current selections or generate a report
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowSaveConfig(true)}
                          disabled={!canSaveConfiguration}
                          className="min-w-[150px]"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Configuration
                        </Button>
                        <Button
                          onClick={handleGenerateReport}
                          disabled={!canGenerateReport}
                          className="min-w-[150px]"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                    {!canGenerateReport && (
                      <p className="text-sm text-muted-foreground">
                        {checks.filter(c => c.status === null).length} checks remaining to generate report
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Modal
          isOpen={showAddDevice}
          onClose={() => {
            setShowAddDevice(false);
            setDeviceErrors({});
            setFilteredDeviceNames([]);
          }}
          title="Add New Device"
        >
          <div className="border-2 border-green-500 rounded-lg p-4 max-h-[80vh] overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Device UUID</label>
              <Input value={newDevice.uuid} disabled className="bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Device Name *</label>
              <Input
                value={newDevice.machine_name}
                onChange={e => {
                  setNewDevice({ ...newDevice, machine_name: e.target.value });
                  setFilteredDeviceNames(
                    deviceNameOptions.filter(name =>
                      name.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                  );
                }}
                placeholder="Search or type device name"
              />
              {filteredDeviceNames.length > 0 && (
                <ul className="border border-green-600 mt-1 rounded bg-background max-h-40 overflow-y-auto shadow-lg z-10">
                  {filteredDeviceNames.map(option => (
                    <li
                      key={option}
                      onClick={() => {
                        setNewDevice({ ...newDevice, machine_name: option });
                        setFilteredDeviceNames([]);
                      }}
                      className="px-3 py-2 hover:bg-green-700 cursor-pointer"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
              {deviceErrors.machine_name && (
                <p className="text-sm text-destructive mt-1">{deviceErrors.machine_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Device Subtype *</label>
              <div className="relative">
                <Select
                  value={newDevice.device_subtype}
                  onValueChange={value => setNewDevice({ ...newDevice, device_subtype: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search or select a benchmark" />
                  </SelectTrigger>
                  <SelectContent>
                    <Input
                      autoFocus
                      placeholder="Type to search..."
                      value={benchmarkSearch}
                      onChange={e => setBenchmarkSearch(e.target.value)}
                      className="mb-2"
                    />
                    {Array.from(new Set(benchmarkOptions.filter(option => option && option.trim() !== ''))).map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {deviceErrors.device_subtype && (
                  <p className="text-sm text-destructive mt-1">{deviceErrors.device_subtype}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">IP Address *</label>
              <Input
                value={newDevice.ip_address}
                onChange={e => setNewDevice({ ...newDevice, ip_address: e.target.value })}
                placeholder="e.g., 192.168.1.100"
              />
              {deviceErrors.ip_address && (
                <p className="text-sm text-destructive mt-1">{deviceErrors.ip_address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Owner Name *</label>
              <Input
                value={newDevice.owner_name}
                onChange={e => setNewDevice({ ...newDevice, owner_name: e.target.value })}
                placeholder="e.g., John Doe"
              />
              {deviceErrors.owner_name && (
                <p className="text-sm text-destructive mt-1">{deviceErrors.owner_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Owner Phone *</label>
              <Input
                value={newDevice.owner_phone}
                onChange={e => setNewDevice({ ...newDevice, owner_phone: e.target.value })}
                placeholder="e.g., +1234567890"
              />
              {deviceErrors.owner_phone && (
                <p className="text-sm text-destructive mt-1">{deviceErrors.owner_phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Owner Email *</label>
              <Input
                value={newDevice.owner_email}
                onChange={e => setNewDevice({ ...newDevice, owner_email: e.target.value })}
                placeholder="e.g., john.doe@example.com"
              />
              {deviceErrors.owner_email && (
                <p className="text-sm text-destructive mt-1">{deviceErrors.owner_email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input
                value={newDevice.description}
                onChange={e => setNewDevice({ ...newDevice, description: e.target.value })}
                placeholder="e.g., Production web server"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleAddDevice}
                className="flex-1"
                disabled={
                  !newDevice.type ||
                  !newDevice.device_subtype ||
                  !newDevice.ip_address ||
                  !newDevice.machine_name ||
                  !newDevice.owner_name ||
                  !newDevice.owner_phone ||
                  !newDevice.owner_email
                }
              >
                Add Device
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDevice(false);
                  setDeviceErrors({});
                  setFilteredDeviceNames([]);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="How to Use Compliance Check">
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">1. Add a Device</h4>
                <p className="text-sm text-muted-foreground">
                  Add a new device with details like subtype and IP address. Devices are private to your account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">2. Select a Device</h4>
                <p className="text-sm text-muted-foreground">
                  Choose your device to view its compliance checks.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">3. Download Benchmarks</h4>
                <p className="text-sm text-muted-foreground">
                  Get the latest CIS benchmark files in PDF, CSV, or JSON format.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">4. Review Controls</h4>
                <p className="text-sm text-muted-foreground">
                  Mark each control as compliant (✓), non-compliant (✗), or skip (⚠).
                </p>
              </div>
              <div>
                <h4 className="font-semibold">5. Save Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  Save your compliance check results to generate a report later.
                </p>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={!!showCheckDetail}
          onClose={() => setShowCheckDetail(null)}
          title={showCheckDetail?.id || ''}
          size="lg"
        >
          {showCheckDetail && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{showCheckDetail.title}</h3>
                <div className="flex space-x-2 mb-4">
                  <Badge variant="outline">{showCheckDetail.category}</Badge>
                  <Badge
                    variant={showCheckDetail.criticality === 'High' ? 'destructive' : 'secondary'}
                  >
                    {showCheckDetail.criticality}
                  </Badge>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">{showCheckDetail.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Remediation Guidance</h4>
                <p className="text-sm text-muted-foreground">
                  Detailed implementation steps would be provided from the backend for this control.
                </p>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={showSaveConfig} onClose={() => setShowSaveConfig(false)} title="Save Configuration">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Configuration Name *</label>
              <Input
                value={configName}
                onChange={e => setConfigName(e.target.value)}
                placeholder="e.g., EKS Compliance Check 2025-06-23"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comments</label>
              <Input
                value={configComments}
                onChange={e => setConfigComments(e.target.value)}
                placeholder="e.g., Initial compliance review"
              />
            </div>
            {selectedDevice && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <strong>Device:</strong> {selectedDevice.machine_name}
                </p>
                <p className="text-sm">
                  <strong>Type:</strong> {selectedDevice.device_subtype}
                </p>
                <p className="text-sm">
                  <strong>Checks:</strong> {checks.filter(c => c.status !== null).length} of {checks.length} completed
                </p>
              </div>
            )}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleSaveConfig}
                className="flex-1"
                disabled={!configName.trim() || !canSaveConfiguration}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowSaveConfig(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Compliance;