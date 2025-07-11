import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Users,
  Server
} from 'lucide-react';

// Mock compliance data
const complianceOverview = {
  totalControls: 180,
  compliantControls: 142,
  nonCompliantControls: 28,
  pendingControls: 10,
  overallScore: 79
};

const recentActivities = [
  {
    id: 1,
    type: 'compliance_check',
    device: 'Web Server - Production',
    control: 'CIS-1.1.1 Ensure mounting of cramfs filesystems is disabled',
    status: 'compliant',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'John Doe'
  },
  {
    id: 2,
    type: 'configuration_change',
    device: 'Database Server - MySQL',
    control: 'CIS-1.2.3 Ensure password reuse is limited',
    status: 'non-compliant',
    timestamp: '2024-01-14T15:45:00Z',
    user: 'Jane Smith'
  },
  {
    id: 3,
    type: 'system_update',
    device: 'File Server - Archive',
    control: 'CIS-1.3.1 Ensure updates, patches, and hotfixes are installed',
    status: 'pending',
    timestamp: '2024-01-13T09:12:00Z',
    user: 'Bob Wilson'
  },
  {
    id: 4,
    type: 'user_login',
    device: 'Workstation - Developer 1',
    control: 'CIS-1.4.2 Ensure multifactor authentication for all accounts',
    status: 'compliant',
    timestamp: '2024-01-12T18:22:00Z',
    user: 'Alice Johnson'
  },
  {
    id: 5,
    type: 'policy_update',
    device: 'Firewall - Corporate',
    control: 'CIS-1.5.3 Ensure firewall rules are reviewed annually',
    status: 'non-compliant',
    timestamp: '2024-01-11T11:58:00Z',
    user: 'Charlie Brown'
  }
];

const complianceControls = [
  {
    id: 'ctrl-001',
    control: 'CIS-1.1.1 Ensure mounting of cramfs filesystems is disabled',
    device: 'Web Server - Production',
    team: 'Security Team',
    status: 'compliant',
    priority: 'low',
    lastChecked: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ctrl-002',
    control: 'CIS-1.2.3 Ensure password reuse is limited',
    device: 'Database Server - MySQL',
    team: 'IT Operations',
    status: 'non-compliant',
    priority: 'critical',
    lastChecked: '2024-01-14T15:45:00Z'
  },
  {
    id: 'ctrl-003',
    control: 'CIS-1.3.1 Ensure updates, patches, and hotfixes are installed',
    device: 'File Server - Archive',
    team: 'Security Team',
    status: 'pending',
    priority: 'medium',
    lastChecked: '2024-01-13T09:12:00Z'
  },
  {
    id: 'ctrl-004',
    control: 'CIS-1.4.2 Ensure multifactor authentication for all accounts',
    device: 'Workstation - Developer 1',
    team: 'IT Operations',
    status: 'compliant',
    priority: 'low',
    lastChecked: '2024-01-12T18:22:00Z'
  },
  {
    id: 'ctrl-005',
    control: 'CIS-1.5.3 Ensure firewall rules are reviewed annually',
    device: 'Firewall - Corporate',
    team: 'Security Team',
    status: 'non-compliant',
    priority: 'high',
    lastChecked: '2024-01-11T11:58:00Z'
  }
];

export default function ComplianceSpace() {
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'non-compliant':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Monitor CIS compliance across your infrastructure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overall Compliance</CardTitle>
            {complianceOverview.overallScore >= 70 ? (
              <TrendingUp className="w-5 h-5 ml-2 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 ml-2 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{complianceOverview.overallScore}%</h2>
              <p className="text-sm text-muted-foreground">
                {complianceOverview.compliantControls} / {complianceOverview.totalControls} controls compliant
              </p>
              <Progress value={complianceOverview.overallScore} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Non-Compliant Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-red-600">{complianceOverview.nonCompliantControls}</h2>
              <p className="text-sm text-muted-foreground">Requires immediate attention</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-yellow-600">{complianceOverview.pendingControls}</h2>
              <p className="text-sm text-muted-foreground">Awaiting validation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Recent Activity</span>
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Compliance Controls</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(activity.status)}
                      <div>
                        <p className="font-medium">{activity.device}</p>
                        <p className="text-sm text-muted-foreground">{activity.control}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{new Date(activity.timestamp).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">By: {activity.user}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {complianceControls.map((control) => (
                  <Card key={control.id} className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">{control.control}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Device: {control.device}</p>
                        <p className="text-xs text-muted-foreground">Team: {control.team}</p>
                        <div className="flex items-center justify-between">
                          <span>Status:</span>
                          {control.status === 'compliant' ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Compliant
                            </Badge>
                          ) : control.status === 'non-compliant' ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Non-Compliant
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Priority:</span>
                          {getPriorityBadge(control.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground">Last Checked: {new Date(control.lastChecked).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
