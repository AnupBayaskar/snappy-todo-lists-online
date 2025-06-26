import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/ui/modal';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Server, 
  FileText, 
  Download, 
  Calendar, 
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  AlertTriangle,
  Trash
} from 'lucide-react';

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

  // Report-specific properties (optional)
  compliance?: number;
  device?: string;
  date?: string;
  criticalIssues?: number;
  mediumIssues?: number;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [showDecommissionConfirm, setShowDecommissionConfirm] = useState(false);
  const [decommissioningDevice, setDecommissioningDevice] = useState(false);
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/devices`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDevices(response.data as Device[]);
      } catch (error: any) {
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDevices();
  }, [user]);

  const handleViewDetails = (device: Device) => {
    console.log('Viewing details for device:', device);
    setSelectedDevice(device);
    setShowDeviceDetails(true);
  };

  const handleDecommissionDevice = async () => {
    if (!selectedDevice) {
      console.log('No device selected for decommission');
      return;
    }
    
    console.log('Starting decommission process for device:', selectedDevice.device_id);
    setDecommissioningDevice(true);
    
    try {
      console.log('Making API call to decommission device');
      const response = await axios.patch(
        `${API_BASE_URL}/devices/${selectedDevice.device_id}/decommission`,
        {
          decommission_details: 'Decommissioned via user interface'
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      console.log('Decommission API response:', response.data);

      // Update the device in the local state
      setDevices(prevDevices => {
        const updatedDevices = prevDevices.map(device => 
          device.device_id === selectedDevice.device_id 
            ? { 
                ...device, 
                status: 'decommissioned',
                decommissioned_on: new Date().toISOString(),
                decommissioned_by: user?.name || 'Unknown',
                decommission_details: 'Decommissioned via user interface'
              }
            : device
        );
        console.log('Updated devices list:', updatedDevices);
        return updatedDevices;
      });

      // Update selected device as well
      setSelectedDevice(prev => {
        const updatedDevice = prev ? {
          ...prev,
          status: 'decommissioned',
          decommissioned_on: new Date().toISOString(),
          decommissioned_by: user?.name || 'Unknown',
          decommission_details: 'Decommissioned via user interface'
        } : null;
        console.log('Updated selected device:', updatedDevice);
        return updatedDevice;
      });

      toast({
        title: 'Device Decommissioned',
        description: `${selectedDevice.machine_name} has been successfully decommissioned.`,
      });

      setShowDecommissionConfirm(false);
    } catch (error: any) {
      console.error('Decommission error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to decommission device.',
        variant: 'destructive',
      });
    } finally {
      setDecommissioningDevice(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/devices/${deviceId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setDevices(prevDevices => prevDevices.filter(device => device.device_id !== deviceId));
      
      if (selectedDevice && selectedDevice.device_id === deviceId) {
        setSelectedDevice(null);
        setShowDeviceDetails(false);
      }

      toast({
        title: 'Device Deleted',
        description: 'The device has been permanently deleted.',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete device.',
        variant: 'destructive',
      });
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <span>Authentication Required</span>
            </CardTitle>
            <CardDescription>
              Please log in to access your profile
            </CardDescription>
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

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Maintenance': return 'secondary';
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">User Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* User Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>User Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Personal Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Type:</span>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span>January 2024</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Account Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Devices:</span>
                    <span>{devices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed Scans:</span>
                    <span>{devices.filter(d => d.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Compliance:</span>
                    <span className={getComplianceColor(85)}>85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Login:</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Devices Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-6 w-6" />
              <span>User Devices</span>
            </CardTitle>
            <CardDescription>
              Manage and monitor your registered devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading devices...</div>
            ) : devices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No devices found. Add a new device to start.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <Card key={device.device_id} className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">{device.machine_name}</h4>
                        <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                          {device.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{device.device_subtype}</p>
                      <Separator className="my-3" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP Address:</span>
                          <span>{device.ip_address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Owner:</span>
                          <span>{device.owner_name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Added:</span>
                          <span>{new Date(device.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => handleViewDetails(device)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/compliance')}
            >
              Add New Device
            </Button>
          </CardContent>
        </Card>

        {/* User Reports Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>Compliance Reports</span>
            </CardTitle>
            <CardDescription>
              View and download your compliance assessment reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {devices.map((report) => (
                <Card key={report.device_id} className="hover-lift">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold">{report.device}</h4>
                          <Badge variant={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{report.type}</p>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{report.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Shield className={`h-4 w-4 ${getComplianceColor(report.compliance)}`} />
                            <span className={getComplianceColor(report.compliance)}>
                              {report.compliance}% Compliant
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm">
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span>{report.criticalIssues} Critical</span>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <Clock className="h-4 w-4" />
                            <span>{report.mediumIssues} Medium</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" disabled={report.status !== 'active'}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Button onClick={() => navigate('/compliance')}>
                Create New Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Device Details Modal */}
        <Modal
          isOpen={showDeviceDetails}
          onClose={() => {
            setShowDeviceDetails(false);
            setSelectedDevice(null);
          }}
          title="Device Details"
          size="lg"
        >
          {selectedDevice && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Device UUID
                    </label>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                      {selectedDevice.uuid}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Device Type
                    </label>
                    <p className="text-sm">
                      <Badge variant="outline">{selectedDevice.type.toUpperCase()}</Badge>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Host Name
                    </label>
                    <p className="text-sm">{selectedDevice.device_subtype}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Contact Number
                    </label>
                    <p className="text-sm">{selectedDevice.owner_phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Status
                    </label>
                    <Badge variant={selectedDevice.status === 'active' ? 'default' : 'secondary'}>
                      {selectedDevice.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      IP Address
                    </label>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                      {selectedDevice.ip_address}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Device Name
                    </label>
                    <p className="text-sm">{selectedDevice.machine_name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Owner Name
                    </label>
                    <p className="text-sm">{selectedDevice.owner_name || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Email Address
                    </label>
                    <p className="text-sm">{selectedDevice.owner_email || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Created On
                    </label>
                    <p className="text-sm">{new Date(selectedDevice.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <p className="text-sm bg-muted/50 p-3 rounded">
                  {selectedDevice.description || 'No description provided'}
                </p>
              </div>

              {selectedDevice.status === 'decommissioned' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">Device Decommissioned</h4>
                  </div>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p><strong>Decommissioned on:</strong> {selectedDevice.decommissioned_on ? new Date(selectedDevice.decommissioned_on).toLocaleDateString() : 'Unknown'}</p>
                    <p><strong>Decommissioned by:</strong> {selectedDevice.decommissioned_by || 'Unknown'}</p>
                    {selectedDevice.decommission_details && (
                      <p><strong>Details:</strong> {selectedDevice.decommission_details}</p>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex space-x-3 pt-4">
                {selectedDevice.status === 'active' ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      console.log('Opening decommission confirmation modal');
                      setShowDecommissionConfirm(true);
                    }}
                    className="flex-1"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Decommission Device
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteDevice(selectedDevice.device_id)}
                    className="flex-1"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Device
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeviceDetails(false);
                    setSelectedDevice(null);
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Decommission Confirmation Modal */}
        <Modal
          isOpen={showDecommissionConfirm}
          onClose={() => {
            console.log('Closing decommission confirmation modal');
            setShowDecommissionConfirm(false);
          }}
          title="Confirm Decommission"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800">Warning: This action cannot be undone</h4>
                <p className="text-sm text-red-700 mt-1">
                  Are you sure you want to decommission "{selectedDevice?.machine_name}"? 
                  This will mark the device as inactive and it will no longer be available for compliance checks.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="destructive"
                onClick={() => {
                  console.log('User confirmed decommission');
                  handleDecommissionDevice();
                }}
                disabled={decommissioningDevice}
                className="flex-1"
              >
                {decommissioningDevice ? 'Decommissioning...' : 'Yes, Decommission'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  console.log('User cancelled decommission');
                  setShowDecommissionConfirm(false);
                }}
                disabled={decommissioningDevice}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
