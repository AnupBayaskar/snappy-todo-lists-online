
import { useState } from "react";
import { ComplianceSelection } from "@/components/ComplianceSelection";
import { ComplianceMarking } from "@/components/ComplianceMarking";
import { useCompliance } from "@/hooks/useCompliance";

export default function ComplianceSpace() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [isMarkingMode, setIsMarkingMode] = useState(false);
  const { teams, devices } = useCompliance();

  const handleStartMarking = () => {
    if (selectedTeam && selectedDevice) {
      console.log('Starting compliance marking for:', { selectedTeam, selectedDevice });
      setIsMarkingMode(true);
    }
  };

  const handleBackToSelection = () => {
    setIsMarkingMode(false);
  };

  if (isMarkingMode) {
    return (
      <div className="container mx-auto p-6">
        <ComplianceMarking
          teamId={selectedTeam}
          deviceId={selectedDevice}
          onBack={handleBackToSelection}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Compliance Space
          </h1>
          <p className="text-xl text-muted-foreground">Mark compliance for your devices</p>
        </div>

        <ComplianceSelection
          teams={teams}
          devices={devices}
          selectedTeam={selectedTeam}
          selectedDevice={selectedDevice}
          onTeamSelect={setSelectedTeam}
          onDeviceSelect={setSelectedDevice}
          onStartMarking={handleStartMarking}
        />
      </div>
    </div>
  );
}
