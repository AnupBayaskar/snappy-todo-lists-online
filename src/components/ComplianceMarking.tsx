
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';

interface ComplianceMarkingProps {
  teamId: string;
  deviceId: string;
  onBack: () => void;
}

export const ComplianceMarking: React.FC<ComplianceMarkingProps> = ({
  teamId,
  deviceId,
  onBack
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Selection
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Compliance Marking</h1>
          <p className="text-muted-foreground">
            Team: {teamId} | Device: {deviceId}
          </p>
        </div>
      </div>

      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle>Compliance Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compliance Marking Interface</h3>
            <p className="text-muted-foreground">
              The detailed compliance marking interface will be implemented here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
