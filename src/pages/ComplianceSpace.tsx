
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Shield, ChevronDown, ChevronUp, Check, X, SkipForward, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const mockControls = [
  {
    _id: '1',
    controlId: '1.1.1',
    title: 'Ensure mounting of cramfs filesystems is disabled',
    description: 'The cramfs filesystem type is a compressed read-only Linux filesystem embedded in small footprint systems.',
    implementation: 'modprobe -n -v cramfs',
    section: 'Filesystem Configuration',
    status: '',
    explanation: '',
    details: ''
  },
  {
    _id: '2',
    controlId: '1.1.2',
    title: 'Ensure mounting of freevxfs filesystems is disabled',
    description: 'The freevxfs filesystem type is a free version of the Veritas type filesystem.',
    implementation: 'modprobe -n -v freevxfs',
    section: 'Filesystem Configuration',
    status: '',
    explanation: '',
    details: ''
  },
  {
    _id: '3',
    controlId: '2.1.1',
    title: 'Ensure xinetd is not installed',
    description: 'The eXtended InterNET Daemon (xinetd) is an open source super daemon.',
    implementation: 'rpm -q xinetd',
    section: 'Services',
    status: '',
    explanation: '',
    details: ''
  }
];

export default function ComplianceSpace() {
  const [teams, setTeams] = useState(mockTeams);
  const [devices, setDevices] = useState(mockDevices);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [controls, setControls] = useState([]);
  const [currentControlIndex, setCurrentControlIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [configName, setConfigName] = useState('');
  const [configComments, setConfigComments] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId);
    setSelectedDevice('');
    setControls([]);
  };

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevice(deviceId);
    setLoading(true);
    // Mock loading controls
    setTimeout(() => {
      setControls(mockControls);
      setCurrentControlIndex(0);
      setLoading(false);
    }, 1000);
  };

  const handleControlUpdate = (controlId, field, value) => {
    setControls(prev => prev.map(control => 
      control._id === controlId ? { ...control, [field]: value } : control
    ));
  };

  const handleSaveConfiguration = () => {
    if (!configName.trim()) {
      return;
    }
    console.log('Saving configuration:', { configName, configComments, controls });
    setShowSaveDialog(false);
    setConfigName('');
    setConfigComments('');
  };

  const filteredDevices = devices.filter(device => device.teamId === selectedTeam);
  const currentControl = controls[currentControlIndex];

  const groupedControls = controls.reduce((acc, control) => {
    if (!acc[control.section]) {
      acc[control.section] = [];
    }
    acc[control.section].push(control);
    return acc;
  }, {});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!selectedTeam || !selectedDevice) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Compliance Space</h1>
            <p className="text-muted-foreground">Select a team and device to begin compliance marking</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {teams.map((team) => (
                  <Button
                    key={team._id}
                    variant={selectedTeam === team._id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleTeamSelect(team._id)}
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
                      onClick={() => handleDeviceSelect(device._id)}
                      disabled={loading}
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
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Compliance Marking</h1>
            <p className="text-muted-foreground">
              Device: {devices.find(d => d._id === selectedDevice)?.name}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowSaveDialog(true)} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(groupedControls).map(([section, sectionControls]) => (
              <Collapsible
                key={section}
                open={expandedSections[section]}
                onOpenChange={() => toggleSection(section)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left p-2"
                  >
                    <span className="font-medium">{section}</span>
                    {expandedSections[section] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 ml-2">
                  {sectionControls.map((control) => {
                    const globalIndex = controls.findIndex(c => c._id === control._id);
                    return (
                      <Button
                        key={control._id}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start text-xs",
                          currentControlIndex === globalIndex && "bg-accent",
                          control.status === 'pass' && "text-green-600",
                          control.status === 'fail' && "text-red-600",
                          control.status === 'skip' && "text-gray-500"
                        )}
                        onClick={() => setCurrentControlIndex(globalIndex)}
                      >
                        <div className="flex items-center gap-2">
                          {control.status === 'pass' && <Check className="h-3 w-3" />}
                          {control.status === 'fail' && <X className="h-3 w-3" />}
                          {control.status === 'skip' && <SkipForward className="h-3 w-3" />}
                          {!control.status && <div className="h-3 w-3 rounded-full border" />}
                          <span>{control.controlId}</span>
                        </div>
                      </Button>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Control Details */}
        <Card>
          <CardHeader>
            <CardTitle>Control Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentControl && (
              <>
                <div>
                  <h3 className="font-semibold text-lg">{currentControl.controlId}</h3>
                  <h4 className="font-medium text-base mt-1">{currentControl.title}</h4>
                </div>
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground">Description</h5>
                  <p className="text-sm mt-1">{currentControl.description}</p>
                </div>
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground">Implementation</h5>
                  <p className="text-sm mt-1 font-mono bg-muted p-2 rounded">
                    {currentControl.implementation}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Compliance Marking */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentControl && (
              <>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <RadioGroup
                    value={currentControl.status || ''}
                    onValueChange={(value) => handleControlUpdate(currentControl._id, 'status', value)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pass" id="pass" />
                      <Label htmlFor="pass" className="flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" />
                        Pass
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fail" id="fail" />
                      <Label htmlFor="fail" className="flex items-center gap-1 text-red-600">
                        <X className="h-4 w-4" />
                        Fail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="skip" id="skip" />
                      <Label htmlFor="skip" className="flex items-center gap-1 text-gray-500">
                        <SkipForward className="h-4 w-4" />
                        Skip
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="explanation" className="text-sm font-medium">
                    Explanation (Required)
                  </Label>
                  <Textarea
                    id="explanation"
                    value={currentControl.explanation || ''}
                    onChange={(e) => handleControlUpdate(currentControl._id, 'explanation', e.target.value)}
                    placeholder="Explain your compliance marking..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="details" className="text-sm font-medium">
                    Additional Details (Optional)
                  </Label>
                  <Textarea
                    id="details"
                    value={currentControl.details || ''}
                    onChange={(e) => handleControlUpdate(currentControl._id, 'details', e.target.value)}
                    placeholder="Additional implementation details..."
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentControlIndex(Math.max(0, currentControlIndex - 1))}
                    disabled={currentControlIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentControlIndex(Math.min(controls.length - 1, currentControlIndex + 1))}
                    disabled={currentControlIndex === controls.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Configuration Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="configName">Configuration Name</Label>
              <Input
                id="configName"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                placeholder="Enter configuration name..."
              />
            </div>
            <div>
              <Label htmlFor="configComments">Comments/Details</Label>
              <Textarea
                id="configComments"
                value={configComments}
                onChange={(e) => setConfigComments(e.target.value)}
                placeholder="Additional comments about this configuration..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfiguration} className="bg-green-600 hover:bg-green-700">
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
