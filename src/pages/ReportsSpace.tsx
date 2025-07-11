
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FileText, Download, Eye, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data
const mockTeams = [
  { _id: '1', name: 'Security Team' },
  { _id: '2', name: 'IT Operations' }
];

const mockDevices = [
  { _id: '1', name: 'Web Server 01', type: 'Ubuntu Server 20.04', teamId: '1' },
  { _id: '2', name: 'Database Server', type: 'CentOS 8', teamId: '1' },
  { _id: '3', name: 'John Laptop', type: 'Windows 11 Pro', teamId: '2' }
];

const mockConfigurations = [
  {
    id: '1',
    name: 'Web Server Security Config',
    date: '2024-01-15',
    validatedBy: 'Admin User',
    markedBy: 'John Doe',
    status: 'validated'
  },
  {
    id: '2',
    name: 'Database Hardening Config',
    date: '2024-01-14',
    validatedBy: 'Validator User',
    markedBy: 'Jane Smith',
    status: 'validated'
  }
];

export default function ReportsSpace() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [showConfigurations, setShowConfigurations] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showConfigDetails, setShowConfigDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDevices = mockDevices.filter(device => device.teamId === selectedTeam);
  const selectedDeviceInfo = mockDevices.find(d => d._id === selectedDevice);

  const handleViewConfigurations = () => {
    if (selectedDevice) {
      setShowConfigurations(true);
    }
  };

  const handleGenerateReport = (configId) => {
    console.log('Generating report for config:', configId);
    // Mock report generation
    alert('Report generated successfully! Download will start shortly.');
  };

  if (!selectedTeam || !selectedDevice) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Reports Space</h1>
            <p className="text-muted-foreground">Generate and view compliance reports</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Teams</h2>
            <p className="text-muted-foreground mb-6">[Select a Device]</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {mockTeams.map((team) => (
                    <Button
                      key={team._id}
                      variant={selectedTeam === team._id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedTeam(team._id)}
                    >
                      {team.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Device</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTeam ? (
                  <div className="grid gap-2">
                    {filteredDevices.map((device) => (
                      <Button
                        key={device._id}
                        variant={selectedDevice === device._id ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedDevice(device._id)}
                      >
                        {device.name} ({device.type})
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Please select a team first</p>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedDevice && (
            <div className="flex justify-center">
              <Button
                onClick={handleViewConfigurations}
                className="bg-teal-600 hover:bg-teal-700"
              >
                View Saved Configurations
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showConfigurations) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Device Reports</h1>
            <p className="text-muted-foreground">
              Viewing configurations for {selectedDeviceInfo?.name}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Device Details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="underline">{selectedDeviceInfo?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Type:</span>
                <p className="text-muted-foreground">{selectedDeviceInfo?.type}</p>
              </div>
              <div>
                <span className="font-medium">Team:</span>
                <p className="text-muted-foreground">
                  {mockTeams.find(t => t._id === selectedTeam)?.name}
                </p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Configurations List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Saved Configurations</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Search configurations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockConfigurations.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                      <span className="font-medium">{config.name}</span>
                      <span className="text-sm text-muted-foreground">{config.date}</span>
                      <span className="text-sm text-muted-foreground">
                        Validated by: {config.validatedBy}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Marked by: {config.markedBy}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedConfig(config);
                          setShowConfigDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateReport(config.id)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Details Dialog */}
        <Dialog open={showConfigDetails} onOpenChange={setShowConfigDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configuration Details</DialogTitle>
            </DialogHeader>
            {selectedConfig && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Sections and Device */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Configuration Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p className="text-muted-foreground">{selectedConfig.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Device:</span>
                      <p className="text-muted-foreground">{selectedDeviceInfo?.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Date Created:</span>
                      <p className="text-muted-foreground">{selectedConfig.date}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {selectedConfig.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Middle: Control Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Selected Control Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium">Control ID: 1.1.1</h4>
                      <p className="text-muted-foreground">
                        Ensure mounting of cramfs filesystems is disabled
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Implementation:</h5>
                      <code className="text-xs bg-muted p-2 rounded block">
                        modprobe -n -v cramfs
                      </code>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Member's Marked Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Marked Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className="ml-2 bg-green-100 text-green-800">Pass</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Explanation:</span>
                      <p className="text-muted-foreground mt-1">
                        Control implemented correctly. Cramfs filesystem mounting is disabled
                        as required by security standards.
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Additional Details:</span>
                      <p className="text-muted-foreground mt-1">
                        Verified using modprobe command. System properly configured.
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Marked by:</span>
                      <p className="text-muted-foreground">{selectedConfig.markedBy}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setShowConfigurations(false);
              setSelectedDevice('');
              setSelectedTeam('');
            }}
          >
            Back to Team Selection
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
