
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, User, CheckCircle, BarChart3, Monitor, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Team {
  _id: string;
  name: string;
}

interface Device {
  _id: string;
  name: string;
  type: string;
  teamId: string;
}

interface SavedConfiguration {
  _id: string;
  name: string;
  deviceId: string;
  teamId: string;
  createdAt: string;
  validatedBy: string;
  markedBy: string;
  status: 'validated' | 'denied' | 'pending';
}

export default function ReportsSpace() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<SavedConfiguration | null>(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching teams and devices for reports');
        // Mock data - replace with actual API calls
        setTeams([
          { _id: '1', name: 'Security Team' },
          { _id: '2', name: 'IT Operations' },
          { _id: '3', name: 'Development Team' }
        ]);
        setDevices([
          { _id: '1', name: 'Web Server 01', type: 'Ubuntu Server', teamId: '1' },
          { _id: '2', name: 'Database Server', type: 'CentOS', teamId: '1' },
          { _id: '3', name: 'Development Laptop', type: 'Windows 11 Pro', teamId: '2' },
          { _id: '4', name: 'Production API', type: 'Docker Container', teamId: '3' }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeviceSelect = async (deviceId: string) => {
    console.log('Device selected for reports:', deviceId);
    setSelectedDevice(deviceId);
    // Mock saved configurations - only validated ones
    setSavedConfigs([
      {
        _id: 'config1',
        name: 'Security Baseline Configuration',
        deviceId,
        teamId: '1',
        createdAt: '2024-01-20T10:00:00Z',
        validatedBy: 'Sarah Johnson',
        markedBy: 'Mike Davis',
        status: 'validated'
      },
      {
        _id: 'config2',
        name: 'Network Security Controls',
        deviceId,
        teamId: '1',
        createdAt: '2024-01-19T14:30:00Z',
        validatedBy: 'Alice Brown',
        markedBy: 'John Smith',
        status: 'validated'
      }
    ]);
  };

  const handleGenerateReport = async (configId: string) => {
    try {
      console.log('Generating report for configuration:', configId);
      setShowGenerateDialog(false);
      toast({
        title: "Report Generated Successfully",
        description: "Your compliance report has been generated and will be downloaded shortly.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t._id === teamId);
    return team?.name || 'Unknown Team';
  };

  const getDeviceName = (deviceId: string) => {
    const device = devices.find(d => d._id === deviceId);
    return device?.name || 'Unknown Device';
  };

  const devicesByTeam = devices.reduce((acc, device) => {
    const teamName = getTeamName(device.teamId);
    if (!acc[teamName]) {
      acc[teamName] = [];
    }
    acc[teamName].push(device);
    return acc;
  }, {} as Record<string, Device[]>);

  const filteredConfigs = savedConfigs.filter(config =>
    config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.validatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.markedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-12 bg-muted rounded-lg animate-pulse" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="h-96 bg-muted rounded-lg animate-pulse" />
              <div className="lg:col-span-2 h-96 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                <BarChart3 className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Reports Space
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Generate comprehensive compliance reports and track your security posture
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Team and Device Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span>Your Teams</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Select a Device</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(devicesByTeam).map(([teamName, teamDevices]) => (
                    <div key={teamName} className="space-y-3">
                      <h4 className="font-semibold text-primary border-b border-primary/20 pb-2">
                        {teamName}
                      </h4>
                      <div className="space-y-2">
                        {teamDevices.map((device) => (
                          <Button
                            key={device._id}
                            variant={selectedDevice === device._id ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start text-left h-auto p-3",
                              selectedDevice === device._id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            )}
                            onClick={() => handleDeviceSelect(device._id)}
                          >
                            <div className="flex flex-col items-start space-y-1">
                              <span className="font-medium">{device.name}</span>
                              <span className="text-xs opacity-75">{device.type}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Panel - Device Details and Configurations */}
            <div className="lg:col-span-2">
              {selectedDevice ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  {/* Device Details */}
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                            <Monitor className="h-6 w-6 text-secondary" />
                          </div>
                          <div>
                            <CardTitle>{getDeviceName(selectedDevice)}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {devices.find(d => d._id === selectedDevice)?.type}
                            </p>
                          </div>
                        </div>
                        <Button className="button-primary">
                          View Saved Configurations
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Team: {getTeamName(devices.find(d => d._id === selectedDevice)?.teamId || '')}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Saved Configurations */}
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Saved Configurations</CardTitle>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search configurations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-48"
                          />
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="validator">Validator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-3">
                          {filteredConfigs.map((config) => (
                            <div
                              key={config._id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex-1 grid grid-cols-4 gap-4 items-center text-sm">
                                <span className="font-medium">{config.name}</span>
                                <span className="text-muted-foreground">
                                  {new Date(config.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-muted-foreground">
                                  Validated by: {config.validatedBy}
                                </span>
                                <span className="text-muted-foreground">
                                  Marked by: {config.markedBy}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedConfig(config);
                                    setShowViewDetails(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" className="button-primary">
                                      <Download className="h-4 w-4 mr-2" />
                                      Generate Report
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-6 h-6 text-primary" />
                                      </div>
                                      <AlertDialogTitle>Generate Compliance Report</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to generate a GRC compliance report for "{config.name}"? 
                                        This will create a downloadable PDF document.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleGenerateReport(config._id)}
                                        className="bg-primary hover:bg-primary/90"
                                      >
                                        Generate Report
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="glass-card h-96 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Monitor className="h-16 w-16 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">No Device Selected</h3>
                      <p className="text-muted-foreground">Select a device from your teams to view saved configurations</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={showViewDetails} onOpenChange={setShowViewDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuration Details</DialogTitle>
          </DialogHeader>
          {selectedConfig && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Device and Config Info */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Configuration Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Config Name:</span> {selectedConfig.name}
                  </div>
                  <div>
                    <span className="font-medium">Device:</span> {getDeviceName(selectedConfig.deviceId)}
                  </div>
                  <div>
                    <span className="font-medium">Team:</span> {getTeamName(selectedConfig.teamId)}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(selectedConfig.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <Badge className="ml-2 bg-green-500/10 text-green-600">{selectedConfig.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Middle: Control Details */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Control Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium">Control ID: 1.1.1</h4>
                        <p className="text-muted-foreground">Ensure mounting of cramfs filesystems is disabled</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Control ID: 2.1.1</h4>
                        <p className="text-muted-foreground">Ensure xinetd is not installed</p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Right: Marked Details */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Marked Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>1.1.1 Filesystem Controls</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-xs">Pass</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>2.1.1 Service Controls</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-xs">Pass</span>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
