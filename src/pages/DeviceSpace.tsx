
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Server, 
  Smartphone, 
  Laptop, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Device {
  _id: string;
  name: string;
  type: string;
  ipAddress: string;
  status: 'online' | 'offline';
  teamId: string;
  lastSeen: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
}

export default function DeviceSpace() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');

  // Mock data with proper typing
  const mockTeams: Team[] = [
    { _id: 'team1', name: 'Security Team', description: 'Network security and monitoring' },
    { _id: 'team2', name: 'IT Operations', description: 'System administration and maintenance' },
    { _id: 'team3', name: 'Development', description: 'Software development and testing' }
  ];

  const mockDevices: Device[] = [
    {
      _id: '1',
      name: 'Firewall-Primary',
      type: 'firewall',
      ipAddress: '192.168.1.1',
      status: 'online',
      teamId: 'team1',
      lastSeen: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: 'Web-Server-01',
      type: 'server',
      ipAddress: '192.168.1.100',
      status: 'online',
      teamId: 'team2',
      lastSeen: '2024-01-15T10:25:00Z'
    },
    {
      _id: '3',
      name: 'Dev-Laptop-JD',
      type: 'laptop',
      ipAddress: '192.168.1.205',
      status: 'offline',
      teamId: 'team3',
      lastSeen: '2024-01-14T16:45:00Z'
    }
  ];

  const [devices] = useState<Device[]>(mockDevices);
  const [teams] = useState<Team[]>(mockTeams);

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'server': return Server;
      case 'laptop': return Laptop;
      case 'smartphone': return Smartphone;
      case 'firewall': return Monitor;
      default: return Monitor;
    }
  };

  const handleAddDevice = () => {
    toast({
      title: "Add Device",
      description: "Device addition functionality will be implemented here.",
    });
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.ipAddress.includes(searchQuery);
    const matchesTeam = selectedTeam === 'all' || device.teamId === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  // Group devices by team
  const devicesByTeam = teams.reduce((acc, team) => {
    acc[team.name] = filteredDevices.filter(device => device.teamId === team._id);
    return acc;
  }, {} as Record<string, Device[]>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor devices across your organization
          </p>
        </div>
        <Button onClick={handleAddDevice} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Device</span>
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search devices by name or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Devices by Team */}
      <div className="space-y-8">
        {Object.entries(devicesByTeam).map(([teamName, teamDevices]) => (
          teamDevices.length > 0 && (
            <div key={teamName} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">{teamName}</h2>
                <Badge variant="secondary">{teamDevices.length}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamDevices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <Card key={device._id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <DeviceIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{device.name}</CardTitle>
                              <CardDescription className="capitalize">{device.type}</CardDescription>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge 
                            variant={device.status === 'online' ? 'default' : 'secondary'}
                            className={device.status === 'online' ? 'bg-green-500 hover:bg-green-600' : ''}
                          >
                            {device.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">IP Address</span>
                          <span className="text-sm font-mono">{device.ipAddress}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Last Seen</span>
                          <span className="text-sm">
                            {new Date(device.lastSeen).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No devices found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedTeam !== 'all' 
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first device."}
          </p>
          {(!searchQuery && selectedTeam === 'all') && (
            <Button onClick={handleAddDevice}>
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
