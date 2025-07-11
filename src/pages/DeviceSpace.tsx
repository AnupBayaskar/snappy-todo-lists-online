
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Monitor, Plus, Wifi, WifiOff, Server, Smartphone, Laptop } from 'lucide-react';
import { toast } from '@/hooks/useToast';

// Mock data
const mockTeams = [
  { _id: '1', name: 'Security Team' },
  { _id: '2', name: 'IT Operations' }
];

const mockDevices = [
  {
    _id: '1',
    name: 'Web Server 01',
    type: 'Ubuntu Server 20.04',
    ipAddress: '192.168.1.100',
    status: 'online',
    teamId: '1',
    lastSeen: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Database Server',
    type: 'CentOS 8',
    ipAddress: '192.168.1.101',
    status: 'online',
    teamId: '1',
    lastSeen: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'John Laptop',
    type: 'Windows 11 Pro',
    ipAddress: '192.168.1.150',
    status: 'offline',
    teamId: '2',
    lastSeen: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function DeviceSpace() {
  const [devices, setDevices] = useState(mockDevices);
  const [teams, setTeams] = useState(mockTeams);
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '', type: '', ipAddress: '', teamId: '' });

  const handleAddDevice = (e) => {
    e.preventDefault();
    console.log('Adding new device:', newDevice);
    
    const deviceToAdd = {
      _id: `device${devices.length + 1}`,
      ...newDevice,
      status: 'online',
      lastSeen: new Date().toISOString()
    };
    
    setDevices([...devices, deviceToAdd]);
    setShowAddDevice(false);
    setNewDevice({ name: '', type: '', ipAddress: '', teamId: '' });
    
    toast({
      title: "Success",
      description: "Device added successfully",
    });
  };

  const getDeviceIcon = (type) => {
    if (type.toLowerCase().includes('server')) return Server;
    if (type.toLowerCase().includes('mobile') || type.toLowerCase().includes('phone')) return Smartphone;
    if (type.toLowerCase().includes('laptop') || type.toLowerCase().includes('desktop')) return Laptop;
    return Monitor;
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    return team?.name || 'Unknown Team';
  };

  const devicesByTeam = devices.reduce((acc, device) => {
    const teamName = getTeamName(device.teamId);
    if (!acc[teamName]) {
      acc[teamName] = [];
    }
    acc[teamName].push(device);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-32 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Device Space</h1>
          <p className="text-muted-foreground">Manage devices across your organization</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(devicesByTeam).map(([teamName, teamDevices]) => (
          <Card key={teamName} className="border hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Monitor className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{teamName}</h3>
                  <p className="text-sm text-muted-foreground">{teamDevices.length} devices</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {teamDevices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <div
                      key={device._id}
                      className="p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedDevice(device)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <DeviceIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{device.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{device.type}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <div className="flex items-center gap-1">
                            {device.status === 'online' ? (
                              <Wifi className="h-4 w-4 text-green-600" />
                            ) : (
                              <WifiOff className="h-4 w-4 text-red-500" />
                            )}
                            <Badge
                              variant={device.status === 'online' ? 'default' : 'destructive'}
                              className={device.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                            >
                              {device.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">IP</span>
                          <span className="text-sm font-mono">{device.ipAddress}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-green-600 hover:bg-green-50"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <div
                  className="p-4 rounded-xl border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                  onClick={() => {
                    const team = teams.find(t => t.name === teamName);
                    if (team) {
                      setNewDevice({ ...newDevice, teamId: team._id });
                      setShowAddDevice(true);
                    }
                  }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-600">Add Device</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Device Dialog */}
      <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDevice} className="space-y-4">
            <Input
              placeholder="Device Name"
              value={newDevice.name}
              onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              required
            />
            <Input
              placeholder="Device Type (e.g., Ubuntu Server, Windows 10)"
              value={newDevice.type}
              onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
              required
            />
            <Input
              placeholder="IP Address"
              value={newDevice.ipAddress}
              onChange={(e) => setNewDevice({ ...newDevice, ipAddress: e.target.value })}
              required
            />
            <Select
              value={newDevice.teamId}
              onValueChange={(value) => setNewDevice({ ...newDevice, teamId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team._id} value={team._id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddDevice(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Device
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Device Details Dialog */}
      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  {(() => {
                    const DeviceIcon = getDeviceIcon(selectedDevice.type);
                    return <DeviceIcon className="h-8 w-8 text-green-600" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDevice.name}</h3>
                  <p className="text-muted-foreground">{selectedDevice.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedDevice.status === 'online' ? (
                      <Wifi className="h-4 w-4 text-green-600" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <Badge
                      variant={selectedDevice.status === 'online' ? 'default' : 'destructive'}
                      className={selectedDevice.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                    >
                      {selectedDevice.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-mono mt-1">{selectedDevice.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team</p>
                  <p className="mt-1">{getTeamName(selectedDevice.teamId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Seen</p>
                  <p className="mt-1">{new Date(selectedDevice.lastSeen).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Edit Device
                </Button>
                <Button variant="destructive" className="flex-1">
                  Decommission
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
