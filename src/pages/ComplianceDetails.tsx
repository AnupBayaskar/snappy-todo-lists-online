
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import DeviceOverview from '@/components/compliance/DeviceOverview';
import SectionDetails from '@/components/compliance/SectionDetails';
import ComplianceActions from '@/components/compliance/ComplianceActions';

const mockSections = [
  { id: 'section-1', name: 'Authentication & Access Control' },
  { id: 'section-2', name: 'Network Security' },
  { id: 'section-3', name: 'Data Protection' },
  { id: 'section-4', name: 'Logging & Monitoring' }
];

const mockSectionDetails = {
  'section-1': [
    {
      id: 'detail-1',
      title: 'Multi-Factor Authentication',
      description: 'Ensure all user accounts require multi-factor authentication',
      category: 'Access Control',
      criticality: 'High' as const
    },
    {
      id: 'detail-2',
      title: 'Password Complexity',
      description: 'Enforce strong password policies with minimum complexity requirements',
      category: 'Authentication',
      criticality: 'Medium' as const
    }
  ],
  'section-2': [
    {
      id: 'detail-3',
      title: 'Firewall Configuration',
      description: 'Configure firewall rules to restrict unnecessary network access',
      category: 'Network',
      criticality: 'High' as const
    }
  ]
};

const ComplianceDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { teamData, deviceData } = location.state || {};

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const sectionDetails = selectedSection ? mockSectionDetails[selectedSection as keyof typeof mockSectionDetails] || [] : [];
  const selectedSectionName = selectedSection ? mockSections.find(s => s.id === selectedSection)?.name || '' : '';

  const handleActionChange = (action: string) => {
    setSelectedAction(selectedAction === action ? null : action);
  };

  const handleSaveConfiguration = () => {
    toast({
      title: 'Configuration Saved',
      description: 'Your compliance configuration has been saved successfully.'
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: 'Report Generated',
      description: 'Compliance report is being generated and will be available shortly.'
    });
  };

  const handleBack = () => {
    navigate('/compliance');
  };

  const handlePrevious = () => {
    // Logic for previous section/item
    console.log('Previous clicked');
  };

  const handleMark = () => {
    // Logic for marking current item
    console.log('Mark clicked');
  };

  const handleNext = () => {
    // Logic for next section/item
    console.log('Next clicked');
  };

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-muted-foreground">
            This page is only accessible to users with the appropriate role.
          </p>
        </Card>
      </div>
    );
  }

  if (!teamData || !deviceData) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Access</h2>
          <p className="text-muted-foreground mb-4">
            Please select team and device from the compliance page.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Compliance
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Compliance Details</h1>
            <p className="text-muted-foreground">
              {teamData.name} - {deviceData.name}
            </p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
          {/* Left Column: Device Sections */}
          <div className="space-y-4">
            <DeviceOverview
              teamName={teamData.name}
              teamId={teamData.id}
              deviceName={deviceData.name}
              sections={mockSections}
              selectedSection={selectedSection}
              onSectionChange={setSelectedSection}
            />
          </div>

          {/* Right Column: Combined Section Details & Compliance Actions */}
          <div className="space-y-4">
            <SectionDetails
              sectionName={selectedSectionName}
              details={sectionDetails}
            />
            
            {selectedSection && (
              <ComplianceActions
                comment={comment}
                onCommentChange={setComment}
                selectedAction={selectedAction}
                onActionChange={handleActionChange}
                onPrevious={handlePrevious}
                onMark={handleMark}
                onNext={handleNext}
                canGoPrevious={true}
                canGoNext={true}
              />
            )}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-center space-x-4 pt-6 border-t">
          <Button
            onClick={handleSaveConfiguration}
            variant="outline"
            className="min-w-[200px]"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
          <Button
            onClick={handleGenerateReport}
            className="min-w-[200px] bg-brand-green hover:bg-brand-green/90"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDetails;
