
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { HardDrive, Plus, Eye, Trash2, Server, Laptop, Smartphone } from 'lucide-react';

// Mock device data
const mockDevices = [
  {
    id: 'device-1',
    name: 'Server-01',
    type: 'server',
    status: 'active',
    ipAddress: '192.168.1.10',
    lastSeen: '2024-01-10T10:30:00Z',
    owner: 'IT Team',
    location: 'Data Center A'
  },
  {
    id: 'device-2',
    name: 'Laptop-Marketing-01',
    type: 'laptop',
    status: 'active',
    ipAddress: '192.168.1.25',
    lastSeen: '2024-01-10T09:15:00Z',
    owner: 'John Doe',
    location: 'Office Floor 2'
  },
  {
    id: 'device-3',
    name: 'Mobile-Security-01',
    type: 'mobile',
    status: 'inactive',
    ipAddress: '192.168.1.35',
    lastSeen: '2024-01-09T16:45:00Z',
    owner: 'Jane Smith',
    location: 'Remote'
  },
  {
    id: 'device-4',
    name: 'Server-02',
    type: 'server',
    status: 'maintenance',
    ipAddress: '192.168.1.11',
    lastSeen: '2024-01-08T14:20:00Z',
    owner: 'IT Team',
    location: 'Data Center B'
  }
];

const DeviceSpace = () => {
  const { user } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'server':
        return Server;
      case 'laptop':
        return Laptop;
      case 'mobile':
        return Smartphone;
      default:
        return HardDrive;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleViewDetails = (deviceId: string) => {
    setSelectedDevice(selectedDevice === deviceId ? null : deviceId);
  };

  const handleAddDevice = () => {
    console.log('Add new device');
    // In real app, open modal or navigate to add device page
  };

  const handleDecommissionDevice = (deviceId: string) => {
    console.log('Decommission device:', deviceId);
    // In real app, call API to decommission device
  };

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Device Space</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage all devices in your organization' : 'View device information'}
          </p>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mb-6">
            <Button onClick={handleAddDevice} className="bg-brand-green hover:bg-brand-green/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Device
            </Button>
          </div>
        )}

        {/* Device List */}
        <div className="grid gap-4">
          {mockDevices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.type);
            const isSelected = selectedDevice === device.id;
            
            return (
              <Card key={device.id} className="transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <DeviceIcon className="h-8 w-8 text-muted-foreground" />
                        <div className="relative">
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(device.status)}`}></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{device.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{device.ipAddress}</span>
                          <Badge variant="outline" className="capitalize">
                            {device.type}
                          </Badge>
                          <Badge variant={device.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                            {device.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(device.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {isSelected ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                  </div>

                  {/* Device Details (Expanded View) */}
                  {isSelected && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Device Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Owner:</span>
                                <span>{device.owner}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Location:</span>
                                <span>{device.location}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Seen:</span>
                                <span>{formatLastSeen(device.lastSeen)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant={device.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                  {device.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Network Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">IP Address:</span>
                                <span className="font-mono">{device.ipAddress}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Device Type:</span>
                                <span className="capitalize">{device.type}</span>
                              </div>
                            </div>
                          </div>

                          {/* Admin Actions */}
                          {isAdmin && (
                            <div className="pt-4">
                              <h4 className="font-semibold mb-2">Admin Actions</h4>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDecommissionDevice(device.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Decommission Device
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {mockDevices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <HardDrive className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Devices Found</h3>
              <p className="text-muted-foreground mb-6">
                {isAdmin ? 'Add your first device to get started' : 'No devices are currently registered'}
              </p>
              {isAdmin && (
                <Button onClick={handleAddDevice} className="bg-brand-green hover:bg-brand-green/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Device
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DeviceSpace;
