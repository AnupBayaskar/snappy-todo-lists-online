
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Monitor, ArrowRight } from 'lucide-react';
import { Team, Device } from '@/hooks/useCompliance';

interface ComplianceSelectionProps {
  teams: Team[];
  devices: Device[];
  selectedTeam: string;
  selectedDevice: string;
  onTeamSelect: (teamId: string) => void;
  onDeviceSelect: (deviceId: string) => void;
  onStartMarking: () => void;
}

export const ComplianceSelection: React.FC<ComplianceSelectionProps> = ({
  teams,
  devices,
  selectedTeam,
  selectedDevice,
  onTeamSelect,
  onDeviceSelect,
  onStartMarking
}) => {
  const filteredDevices = selectedTeam 
    ? devices.filter(device => device.teamId === selectedTeam)
    : [];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Select Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teams.map((team) => (
              <Button
                key={team._id}
                variant={selectedTeam === team._id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onTeamSelect(team._id)}
              >
                {team.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-green-600" />
            Select Device
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTeam ? (
            <div className="space-y-2">
              {filteredDevices.map((device) => (
                <Button
                  key={device._id}
                  variant={selectedDevice === device._id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => onDeviceSelect(device._id)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{device.name}</span>
                    <span className="text-xs text-muted-foreground">{device.type}</span>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Please select a team first
            </p>
          )}
        </CardContent>
      </Card>

      {selectedTeam && selectedDevice && (
        <div className="md:col-span-2 flex justify-center">
          <Button
            onClick={onStartMarking}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
          >
            Start Compliance Marking
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
