
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, Search, Filter, Clock, AlertCircle, Eye, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
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
    deniedBy: 'Validator User',
    denyReason: 'Incomplete security controls'
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
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationDetails, setValidationDetails] = useState('');
  const [validatedMarks, setValidatedMarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [queryText, setQueryText] = useState('');

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
    console.log('Raising query for config:', configId, 'Query:', queryText);
    setQueryText('');
  };

  if (isValidator) {
    return (
      <div className="h-screen flex bg-background">
        {/* Left Panel */}
        <div className={cn(
          "bg-card border-r border-border transition-all duration-300",
          leftPanelOpen ? "w-80" : "w-12"
        )}>
          <div className="p-4 border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="w-full justify-start"
            >
              {leftPanelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {leftPanelOpen && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
          
          {leftPanelOpen && (
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Validate Configuration</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Review compliance markings</p>
                  <p>• Verify implementation details</p>
                  <p>• Check explanations</p>
                  <p>• Validate or deny submission</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Input
                  placeholder="Search configurations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" size="sm" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Validation Space</h1>
                <p className="text-muted-foreground">Validate compliance submissions</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Pending Validations */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Pending Validations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {mockPendingValidations.map((config) => (
                        <div
                          key={config.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 grid grid-cols-6 gap-4 items-center text-sm">
                            <span className="font-medium">{config.configName}</span>
                            <span className="text-muted-foreground">Team: {config.team}</span>
                            <span className="text-muted-foreground">Device: {config.device}</span>
                            <span className="text-muted-foreground">{config.deviceType}</span>
                            <span className="text-muted-foreground">{config.dateCreated}</span>
                            <span className="text-muted-foreground">By: {config.createdBy}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedConfig(config);
                              setShowValidationDialog(true);
                            }}
                            className="button-primary"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Queried Configurations */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-secondary" />
                    Queried Configurations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {mockQueriedConfigs.map((config) => (
                        <div
                          key={config.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 grid grid-cols-6 gap-4 items-center text-sm">
                            <span className="font-medium">{config.configName}</span>
                            <span className="text-muted-foreground">Team: {config.team}</span>
                            <span className="text-muted-foreground">Device: {config.device}</span>
                            <span className="text-muted-foreground">{config.deviceType}</span>
                            <span className="text-muted-foreground">{config.dateCreated}</span>
                            <span className="text-muted-foreground">By: {config.createdBy}</span>
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
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Validation Dialog */}
        <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Validation Interface</DialogTitle>
            </DialogHeader>
            {selectedConfig && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Marked Compliances */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Marked Compliances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Config:</span> {selectedConfig.configName}
                      </div>
                      <div>
                        <span className="font-medium">Device:</span> {selectedConfig.device}
                      </div>
                      <div>
                        <span className="font-medium">Team:</span> {selectedConfig.team}
                      </div>
                      {selectedConfig.queryReason && (
                        <div className="p-3 bg-secondary/10 rounded-lg">
                          <span className="font-medium text-secondary">Query:</span>
                          <p className="text-secondary mt-1">{selectedConfig.queryReason}</p>
                        </div>
                      )}
                      <ScrollArea className="h-48 border rounded-lg p-3">
                        <div className="space-y-2">
                          {/* Mock compliance items */}
                          <div className="flex items-center justify-between">
                            <span>1.1.1 Filesystem Controls</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>2.1.1 Service Controls</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>

                {/* Middle: Control Details */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Control Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium">Control ID: 1.1.1</h4>
                          <p className="text-muted-foreground">Ensure mounting of cramfs filesystems is disabled</p>
                        </div>
                        <div>
                          <h5 className="font-medium">User Response:</h5>
                          <p className="text-muted-foreground">User marked as 'Pass' with explanation...</p>
                        </div>
                        <div>
                          <h5 className="font-medium">Implementation:</h5>
                          <code className="text-xs bg-muted p-2 rounded block">modprobe -n -v cramfs</code>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Right: Validation Controls */}
                <Card className="glass-card">
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="flex-1 bg-green-600 hover:bg-green-700">
                            Validate
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Validation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to validate this configuration? This action will mark it as approved.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleValidate('validate')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Validate
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            Deny
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Denial</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to deny this configuration? This action will reject the submission.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleValidate('deny')}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Deny
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Your Submissions</h1>
          <p className="text-muted-foreground">Track your compliance submissions</p>
        </div>
      </div>

      {/* Latest Submissions */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle>Latest Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockUserSubmissions.slice(0, 3).map((submission) => (
              <div key={submission.id} className="p-4 border rounded-lg glass-card">
                <h4 className="font-medium mb-2">{submission.configName}</h4>
                <p className="text-sm text-muted-foreground mb-2">{submission.date}</p>
                <Badge
                  className={cn(
                    submission.status === 'validated' ? 'bg-green-500/10 text-green-600' :
                    submission.status === 'denied' ? 'bg-destructive/10 text-destructive' : 
                    'bg-secondary/10 text-secondary'
                  )}
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
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-green-600">Validated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserSubmissions.filter(s => s.status === 'validated').map((submission) => (
                <div key={submission.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{submission.configName}</h4>
                  <p className="text-sm text-muted-foreground">{submission.date}</p>
                  <p className="text-xs text-green-600">Validated by: {submission.validatedBy}</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-destructive">Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserSubmissions.filter(s => s.status === 'denied').map((submission) => (
                <div key={submission.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{submission.configName}</h4>
                  <p className="text-sm text-muted-foreground">{submission.date}</p>
                  <p className="text-xs text-destructive">Denied by: {submission.deniedBy}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Dialog>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Raise Query</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            value={queryText}
                            onChange={(e) => setQueryText(e.target.value)}
                            placeholder="Describe your query or concern..."
                            rows={4}
                          />
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              Cancel
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button className="flex-1">
                                  Submit Query
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Submit Query</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to submit this query? It will be sent back to the validator for review.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRaiseQuery(submission.id)}>
                                    Submit Query
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Unchecked</CardTitle>
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
