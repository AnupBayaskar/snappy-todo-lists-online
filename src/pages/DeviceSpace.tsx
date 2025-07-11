import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Server, 
  Plus, 
  Settings, 
  Trash2, 
  Edit, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';

// Mock data for devices
const mockDevices = [
  {
    id: 'dev-001',
    name: 'Web Server - Production',
    type: 'Server',
    os: 'Ubuntu 22.04 LTS',
    status: 'compliant',
    lastScan: '2024-01-15T10:30:00Z',
    complianceScore: 85,
    criticalIssues: 0,
    warnings: 3,
    team: 'Security Team',
    location: 'Data Center A'
  },
  {
    id: 'dev-002',
    name: 'Database Server - MySQL',
    type: 'Database',
    os: 'CentOS 8',
    status: 'non-compliant',
    lastScan: '2024-01-14T15:45:00Z',
    complianceScore: 62,
    criticalIssues: 2,
    warnings: 8,
    team: 'IT Operations',
    location: 'Data Center B'
  },
  {
    id: 'dev-003',
    name: 'Firewall - Corporate',
    type: 'Firewall',
    os: 'FortiOS 7.0',
    status: 'pending',
    lastScan: '2024-01-10T08:00:00Z',
    complianceScore: 78,
    criticalIssues: 1,
    warnings: 5,
    team: 'Network Security',
    location: 'Headquarters'
  },
  {
    id: 'dev-004',
    name: 'Laptop - John Doe',
    type: 'Endpoint',
    os: 'Windows 11 Pro',
    status: 'compliant',
    lastScan: '2024-01-16T14:20:00Z',
    complianceScore: 92,
    criticalIssues: 0,
    warnings: 1,
    team: 'End Users',
    location: 'Remote'
  },
  {
    id: 'dev-005',
    name: 'Cloud Instance - API',
    type: 'Cloud',
    os: 'Amazon Linux 2',
    status: 'non-compliant',
    lastScan: '2024-01-13T22:55:00Z',
    complianceScore: 55,
    criticalIssues: 3,
    warnings: 12,
    team: 'DevOps',
    location: 'AWS Cloud'
  }
];

export default function DeviceSpace() {
  const [devices, setDevices] = useState(mockDevices);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '',
    os: '',
    team: '',
    location: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Compliant</Badge>;
      case 'non-compliant':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="w-3 h-3 mr-1" />Non-Compliant</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleAddDevice = (e) => {
    e.preventDefault();
    const newDeviceId = `dev-${Date.now()}`;
    const newDeviceData = {
      id: newDeviceId,
      name: newDevice.name,
      type: newDevice.type,
      os: newDevice.os,
      status: 'pending',
      lastScan: new Date().toISOString(),
      complianceScore: 0,
      criticalIssues: 0,
      warnings: 0,
      team: newDevice.team,
      location: newDevice.location
    };
    setDevices([...devices, newDeviceData]);
    setShowAddDevice(false);
    setNewDevice({ name: '', type: '', os: '', team: '', location: '' });
  };

  const handleRemoveDevice = (deviceId) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    setShowDeviceDetails(false);
  };

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || device.status === filterStatus)
  );

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Device Management</h1>
            <p className="text-muted-foreground">Monitor and manage your infrastructure devices</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDevice(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="non-compliant">Non-Compliant</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map(device => (
          <Card key={device.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setSelectedDevice(device); setShowDeviceDetails(true); }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-4 h-4" />
                <span>{device.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Type: {device.type}</p>
              <p className="text-sm text-muted-foreground">OS: {device.os}</p>
              <div className="mt-2">{getStatusBadge(device.status)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Device Dialog */}
      <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>Enter the details for the new device.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDevice} className="space-y-4">
            <div className="grid gap-2">
              <Input
                type="text"
                placeholder="Device Name"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Select onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Device Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="Firewall">Firewall</SelectItem>
                  <SelectItem value="Endpoint">Endpoint</SelectItem>
                  <SelectItem value="Cloud">Cloud Instance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Input
                type="text"
                placeholder="Operating System"
                value={newDevice.os}
                onChange={(e) => setNewDevice({ ...newDevice, os: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Input
                type="text"
                placeholder="Team"
                value={newDevice.team}
                onChange={(e) => setNewDevice({ ...newDevice, team: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Input
                type="text"
                placeholder="Location"
                value={newDevice.location}
                onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Add Device</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Device Details Dialog */}
      <Dialog open={!!selectedDevice && showDeviceDetails} onOpenChange={() => { setShowDeviceDetails(false); setSelectedDevice(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
            <DialogDescription>Information about the selected device.</DialogDescription>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Device Name</p>
                <p className="text-muted-foreground">{selectedDevice.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Type</p>
                <p className="text-muted-foreground">{selectedDevice.type}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Operating System</p>
                <p className="text-muted-foreground">{selectedDevice.os}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                {getStatusBadge(selectedDevice.status)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => alert('Edit functionality not implemented.')}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Device
                </Button>
                <Button variant="destructive" onClick={() => handleRemoveDevice(selectedDevice.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Device
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
