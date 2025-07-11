
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Monitor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Define the getTeams and getDevices functions (replace with your actual API calls)
const getTeams = async () => {
  // Replace with your actual API call to fetch teams
  return Promise.resolve({
    teams: [
      { _id: 'team1', name: 'Team Alpha', members: ['user1', 'user2'] },
      { _id: 'team2', name: 'Team Beta', members: ['user3', 'user4'] },
    ],
  });
};

const getDevices = async () => {
  // Replace with your actual API call to fetch devices
  return Promise.resolve({
    devices: [
      { _id: 'device1', name: 'Server 1', teamId: 'team1' },
      { _id: 'device2', name: 'Laptop 1', teamId: 'team2' },
    ],
  });
};

interface Team {
  _id: string;
  name: string;
  members: string[];
}

interface Device {
  _id: string;
  name: string;
  teamId: string;
}

export default function DeviceSpace() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching teams and devices for device space');
        const [teamsResponse, devicesResponse] = await Promise.all([
          getTeams(),
          getDevices()
        ]);
        
        const teamsData = teamsResponse.teams || [];
        const devicesData = devicesResponse.devices || [];
        
        setTeams(teamsData);
        setDevices(devicesData);
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

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleOpenAddDeviceModal = () => {
    setIsAddDeviceModalOpen(true);
  };

  const handleCloseAddDeviceModal = () => {
    setIsAddDeviceModalOpen(false);
    setNewDeviceName('');
  };

  const handleAddDevice = () => {
    if (newDeviceName.trim() !== '') {
      // Simulate adding a new device
      const newDevice: Device = {
        _id: `device${devices.length + 1}`,
        name: newDeviceName,
        teamId: selectedTeam || '',
      };
      setDevices([...devices, newDevice]);
      handleCloseAddDeviceModal();
      toast({
        title: "Success",
        description: "Device added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Device name cannot be empty",
        variant: "destructive",
      });
    }
  };

  // Check if user has admin privileges (team-lead or organization-lead)
  const isAdmin = user?.role === 'team-lead' || user?.role === 'organization-lead';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Device Space</h2>
          <p className="text-muted-foreground">
            Manage your devices and teams.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedTeam && (
            <Button size="sm" className="brand-primary" onClick={handleOpenAddDeviceModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Teams */}
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(var(--brand-success))]" />
                Your Teams
              </CardTitle>
              {isAdmin && (
                <Button size="sm" className="brand-success">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <Button
                    key={team._id}
                    variant={selectedTeam === team._id ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${
                      selectedTeam === team._id ? 'brand-primary' : ''
                    }`}
                    onClick={() => handleTeamSelect(team._id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{team.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {team.members.length} members
                      </span>
                    </div>
                  </Button>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No teams found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Middle Panel - Devices */}
        <Card className="glass-effect border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
              Devices
            </CardTitle>
            <CardDescription>
              A list of all devices associated with the selected team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Team</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.length > 0 ? (
                  devices
                    .filter((device) => device.teamId === selectedTeam)
                    .map((device) => (
                      <TableRow key={device._id}>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell>
                          {teams.find((team) => team._id === device.teamId)?.name || 'Unknown'}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No devices found for the selected team.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Device Modal */}
      {isAddDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Device</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deviceName">Device Name</Label>
                <Input
                  type="text"
                  id="deviceName"
                  placeholder="Enter device name"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={handleCloseAddDeviceModal}>
                  Cancel
                </Button>
                <Button onClick={handleAddDevice}>Add Device</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
