
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Search, Filter, Clock, AlertCircle, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Mock data
const mockPendingValidations = [
  {
    id: '1',
    configName: 'Web Server Security Config',
    team: 'Security Team',
    device: 'Web Server 01',
    deviceType: 'Ubuntu Server 20.04',
    dateCreated: '2024-01-15',
    createdBy: 'John Doe',
    status: 'pending'
  },
  {
    id: '2',
    configName: 'Database Hardening',
    team: 'IT Operations',
    device: 'Database Server',
    deviceType: 'CentOS 8',
    dateCreated: '2024-01-14',
    createdBy: 'Jane Smith',
    status: 'pending'
  }
];

const mockQueriedConfigs = [
  {
    id: '3',
    configName: 'Laptop Security Setup',
    team: 'IT Operations',
    device: 'John Laptop',
    deviceType: 'Windows 11 Pro',
    dateCreated: '2024-01-10',
    createdBy: 'Bob Wilson',
    status: 'queried',
    queryReason: 'Need clarification on control 2.1.1 implementation'
  }
];

const mockUserSubmissions = [
  {
    id: '4',
    configName: 'My Server Config',
    date: '2024-01-12',
    status: 'validated',
    validatedBy: 'Admin User',
    validationId: 'VAL-001'
  },
  {
    id: '5',
    configName: 'Workstation Setup',
    date: '2024-01-08',
    status: 'denied',
    deniedBy: 'Validator User'
  },
  {
    id: '6',
    configName: 'Network Config',
    date: '2024-01-05',
    status: 'unchecked'
  }
];

export default function ValidationSpace() {
  const { user } = useAuth();
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationDetails, setValidationDetails] = useState('');
  const [validatedMarks, setValidatedMarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const isValidator = user?.role === 'validator' || user?.role === 'team-lead' || user?.role === 'organization-lead';

  const handleValidate = (action) => {
    console.log(`${action} configuration:`, selectedConfig, {
      validatedMarks,
      validationDetails
    });
    setShowValidationDialog(false);
    setValidationDetails('');
    setValidatedMarks('');
  };

  const handleRaiseQuery = (configId) => {
    console.log('Raising query for config:', configId);
  };

  if (isValidator) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Validation Space</h1>
            <p className="text-muted-foreground">Validate compliance submissions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Instructions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Validate Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Validation Process:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Review compliance markings</li>
                  <li>• Verify implementation details</li>
                  <li>• Check explanations</li>
                  <li>• Validate or deny submission</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Search & Filter:</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Search configurations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pending Validations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Pending Validations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPendingValidations.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                        <span className="font-medium">{config.configName}</span>
                        <span className="text-sm text-muted-foreground">Team: {config.team}</span>
                        <span className="text-sm text-muted-foreground">Device: {config.device}</span>
                        <span className="text-sm text-muted-foreground">{config.deviceType}</span>
                        <span className="text-sm text-muted-foreground">{config.dateCreated}</span>
                        <span className="text-sm text-muted-foreground">By: {config.createdBy}</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedConfig(config);
                          setShowValidationDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Queried Configurations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Queried Configurations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockQueriedConfigs.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                        <span className="font-medium">{config.configName}</span>
                        <span className="text-sm text-muted-foreground">Team: {config.team}</span>
                        <span className="text-sm text-muted-foreground">Device: {config.device}</span>
                        <span className="text-sm text-muted-foreground">{config.deviceType}</span>
                        <span className="text-sm text-muted-foreground">{config.dateCreated}</span>
                        <span className="text-sm text-muted-foreground">By: {config.createdBy}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedConfig(config);
                          setShowValidationDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Validation Dialog */}
        <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Validation Interface</DialogTitle>
            </DialogHeader>
            {selectedConfig && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Marked Compliances */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Marked Compliances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Config:</strong> {selectedConfig.configName}</p>
                      <p><strong>Device:</strong> {selectedConfig.device}</p>
                      <p><strong>Team:</strong> {selectedConfig.team}</p>
                      {selectedConfig.queryReason && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-blue-700 dark:text-blue-300">
                            <strong>Query:</strong> {selectedConfig.queryReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Middle: Control Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Control Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium">Control ID: 1.1.1</h4>
                        <p className="text-muted-foreground">Sample control for validation</p>
                      </div>
                      <div>
                        <h5 className="font-medium">User Response:</h5>
                        <p className="text-muted-foreground">User marked as 'Pass' with explanation...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Validation Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Validation Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Validated Marks (0 to n)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={validatedMarks}
                        onChange={(e) => setValidatedMarks(e.target.value)}
                        placeholder="Enter number of validated marks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Details
                      </label>
                      <Textarea
                        value={validationDetails}
                        onChange={(e) => setValidationDetails(e.target.value)}
                        placeholder="Validator comments and control references..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleValidate('validate')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Validate
                      </Button>
                      <Button
                        onClick={() => handleValidate('deny')}
                        variant="destructive"
                        className="flex-1"
                      >
                        Deny
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Member View
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Your Submissions</h1>
          <p className="text-muted-foreground">Track your compliance submissions</p>
        </div>
      </div>

      {/* Latest Submissions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Latest Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {mockUserSubmissions.slice(0, 3).map((submission) => (
              <div key={submission.id} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{submission.configName}</h4>
                <p className="text-sm text-muted-foreground mb-2">{submission.date}</p>
                <Badge
                  variant={
                    submission.status === 'validated' ? 'default' :
                    submission.status === 'denied' ? 'destructive' : 'secondary'
                  }
                  className={
                    submission.status === 'validated' ? 'bg-green-100 text-green-800' : ''
                  }
                >
                  {submission.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submissions by Status */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Validated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserSubmissions.filter(s => s.status === 'validated').map((submission) => (
                <div key={submission.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{submission.configName}</h4>
                  <p className="text-sm text-muted-foreground">{submission.date}</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserSubmissions.filter(s => s.status === 'denied').map((submission) => (
                <div key={submission.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{submission.configName}</h4>
                  <p className="text-sm text-muted-foreground">{submission.date}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRaiseQuery(submission.id)}
                    >
                      Raise Query
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Unchecked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserSubmissions.filter(s => s.status === 'unchecked').map((submission) => (
                <div key={submission.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{submission.configName}</h4>
                  <p className="text-sm text-muted-foreground">{submission.date}</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
