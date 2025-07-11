
import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/useToast';
import { getTeams, Team } from '@/api/organizations';
import { getDevices, Device } from '@/api/devices';

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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching teams and devices for reports');
        const [teamsResponse, devicesResponse] = await Promise.all([
          getTeams(),
          getDevices()
        ]);
        setTeams((teamsResponse as any).teams);
        setDevices((devicesResponse as any).devices);
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
  }, [toast]);

  const handleDeviceSelect = async (deviceId: string) => {
    console.log('Device selected for reports:', deviceId);
    setSelectedDevice(deviceId);
    // Mock saved configurations
    setSavedConfigs([
      {
        _id: 'config1',
        name: 'Security Baseline Configuration',
        deviceId,
        teamId: 'team1',
        createdAt: '2024-01-20T10:00:00Z',
        validatedBy: 'Sarah Johnson',
        markedBy: 'Mike Davis',
        status: 'validated'
      },
      {
        _id: 'config2',
        name: 'Network Security Controls',
        deviceId,
        teamId: 'team1',
        createdAt: '2024-01-19T14:30:00Z',
        validatedBy: 'Alice Brown',
        markedBy: 'John Smith',
        status: 'validated'
      },
      {
        _id: 'config3',
        name: 'Access Control Configuration',
        deviceId,
        teamId: 'team1',
        createdAt: '2024-01-18T09:15:00Z',
        validatedBy: 'Bob Wilson',
        markedBy: 'Mike Davis',
        status: 'denied'
      }
    ]);
  };

  const handleGenerateReport = async (configId: string) => {
    try {
      console.log('Generating report for configuration:', configId);
      toast({
        title: "Success",
        description: "Report generated successfully",
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="h-96 bg-muted rounded animate-pulse" />
            <div className="lg:col-span-2 h-96 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Reports Space
            </h1>
            <p className="text-muted-foreground mt-2">Generate and download compliance reports</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Device Selection */}
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Your Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(devicesByTeam).map(([teamName, teamDevices]) => (
                  <div key={teamName} className="space-y-2">
                    <h4 className="font-medium text-sm">{teamName}</h4>
                    <div className="space-y-1">
                      {teamDevices.map((device) => (
                        <Button
                          key={device._id}
                          variant={selectedDevice === device._id ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => handleDeviceSelect(device._id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{device.name}</span>
                            <span className="text-xs text-muted-foreground">{device.type}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Saved Configurations */}
          <div className="lg:col-span-2">
            {selectedDevice ? (
              <Card className="glass-effect border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Saved Configurations</CardTitle>
                    <Button className="bg-green-600 hover:bg-green-700">
                      View Saved Configurations
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Device: {getDeviceName(selectedDevice)}
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {savedConfigs.map((config) => (
                        <div
                          key={config._id}
                          className="p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{config.name}</h4>
                            <Badge
                              variant={config.status === 'validated' ? 'default' : 'destructive'}
                              className={config.status === 'validated' ? 'bg-green-600' : ''}
                            >
                              {config.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(config.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Validated by {config.validatedBy}
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Marked by {config.markedBy}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedConfig(config)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleGenerateReport(config._id)}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Generate Report
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-effect border-border/50">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Device</h3>
                    <p className="text-muted-foreground">
                      Choose a device from your teams to view saved configurations and generate reports
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Configuration Details Dialog */}
        <Dialog open={!!selectedConfig} onOpenChange={() => setSelectedConfig(null)}>
          <DialogContent className="bg-background max-w-4xl">
            <DialogHeader>
              <DialogTitle>Configuration Details</DialogTitle>
            </DialogHeader>
            {selectedConfig && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Configuration</h4>
                    <p>{selectedConfig.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                    <Badge
                      variant={selectedConfig.status === 'validated' ? 'default' : 'destructive'}
                      className={selectedConfig.status === 'validated' ? 'bg-green-600' : ''}
                    >
                      {selectedConfig.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Created</h4>
                    <p>{new Date(selectedConfig.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Control Summary</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">15</div>
                      <div className="text-sm text-green-600">Passed</div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">3</div>
                      <div className="text-sm text-red-600">Failed</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">2</div>
                      <div className="text-sm text-gray-600">Skipped</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => selectedConfig && handleGenerateReport(selectedConfig._id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Generate PDF Report
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export to Excel
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
