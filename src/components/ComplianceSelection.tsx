
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Monitor, Server, Smartphone, Wifi } from "lucide-react"
import { Team, Device } from "@/hooks/useCompliance"

interface ComplianceSelectionProps {
  teams: Team[]
  devices: Device[]
  selectedTeam: string
  selectedDevice: string
  onTeamSelect: (teamId: string) => void
  onDeviceSelect: (deviceId: string) => void
  onStartMarking: () => void
}

const getDeviceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'server':
      return Server
    case 'laptop':
    case 'desktop':
      return Monitor
    case 'mobile':
    case 'phone':
      return Smartphone
    case 'network':
    case 'router':
      return Wifi
    default:
      return Monitor
  }
}

export function ComplianceSelection({
  teams,
  devices,
  selectedTeam,
  selectedDevice,
  onTeamSelect,
  onDeviceSelect,
  onStartMarking
}: ComplianceSelectionProps) {
  const filteredDevices = devices.filter(device => device.teamId === selectedTeam)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Team Selection */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-center">Select Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            {teams.map((team) => (
              <Button
                key={team._id}
                variant={selectedTeam === team._id ? "default" : "outline"}
                size="lg"
                className={`transition-all duration-200 ${
                  selectedTeam === team._id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                    : "hover:bg-blue-50 dark:hover:bg-slate-800"
                }`}
                onClick={() => onTeamSelect(team._id)}
              >
                {team.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Selection */}
      {selectedTeam && (
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle className="text-center">Select Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map((device) => {
                const Icon = getDeviceIcon(device.type)
                return (
                  <Button
                    key={device._id}
                    variant={selectedDevice === device._id ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-200 ${
                      selectedDevice === device._id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                        : "hover:bg-blue-50 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => onDeviceSelect(device._id)}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="font-medium">{device.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {device.type}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Marking Button */}
      {selectedTeam && selectedDevice && (
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={onStartMarking}
          >
            Mark Compliance
          </Button>
        </div>
      )}
    </div>
  )
}
