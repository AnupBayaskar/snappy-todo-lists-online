
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Upload, HelpCircle, Eye, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const mockUserTeams = [
  { id: '1', name: 'Security Team', role: 'Team Lead' },
  { id: '2', name: 'Compliance Board', role: 'Member' }
];

const mockUserConfigurations = [
  {
    id: '1',
    name: 'Web Server Security Config',
    date: '2024-01-15',
    device: 'Web Server 01',
    status: 'Validated'
  },
  {
    id: '2',
    name: 'Database Hardening',
    date: '2024-01-12',
    device: 'Database Server',
    status: 'Pending'
  },
  {
    id: '3',
    name: 'Workstation Setup',
    date: '2024-01-10',
    device: 'John Laptop',
    status: 'Denied'
  }
];

const rolePermissions = {
  'member': {
    title: 'Member',
    permissions: [
      'Create compliance configurations',
      'Mark compliance controls',
      'Submit configurations for validation',
      'View own submissions and status'
    ]
  },
  'validator': {
    title: 'Validator',
    permissions: [
      'All member permissions',
      'Validate compliance submissions',
      'Review and approve configurations',
      'Send queries back to members'
    ]
  },
  'team-lead': {
    title: 'Team Lead',
    permissions: [
      'All validator permissions',
      'Manage team members',
      'Assign roles within team',
      'Generate team reports'
    ]
  },
  'organization-lead': {
    title: 'Organization Lead',
    permissions: [
      'All team lead permissions',
      'Create and manage teams',
      'Organization-wide oversight',
      'User management across all teams'
    ]
  }
};

export default function Profile() {
  const { user } = useAuth();
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [expandedConfigs, setExpandedConfigs] = useState(false);

  const handleProfilePictureUpload = () => {
    console.log('Profile picture upload clicked');
    // Mock implementation
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your profile and settings</p>
        </div>
      </div>

      {/* Header Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-2xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                onClick={handleProfilePictureUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>

            {/* Organization and Role Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{user?.organizationName || 'SmartEdge Technologies'}</h2>
              <div className="flex items-center gap-2 mb-4">
                <Badge 
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                >
                  {rolePermissions[user?.role]?.title || 'Member'}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowRoleInfo(true)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Name:</strong> {user?.name || 'John Doe'}</p>
                <p><strong>Email:</strong> {user?.email || 'john.doe@smartedge.in'}</p>
                <p><strong>User ID:</strong> {user?.id || 'USR-001'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Your Teams */}
        <Card>
          <CardHeader>
            <CardTitle>Your Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">{team.name}</h4>
                    <p className="text-sm text-muted-foreground">Role: {team.role}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Opens Team Space page
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Your Configurations */}
        <Card>
          <CardHeader>
            <CardTitle>Your Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`space-y-3 ${!expandedConfigs ? 'max-h-64 overflow-hidden' : ''}`}>
              {mockUserConfigurations.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{config.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Device: {config.device} • {config.date}
                    </p>
                    <Badge
                      variant={
                        config.status === 'Validated' ? 'default' :
                        config.status === 'Denied' ? 'destructive' : 'secondary'
                      }
                      className={
                        config.status === 'Validated' ? 'bg-green-100 text-green-800' : ''
                      }
                    >
                      {config.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setExpandedConfigs(!expandedConfigs)}
              >
                {expandedConfigs ? 'Show Less' : 'Read More'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {expandedConfigs ? 'Collapse view' : 'Expand to see all configurations'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Information Dialog */}
      <Dialog open={showRoleInfo} onOpenChange={setShowRoleInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Role: {rolePermissions[user?.role]?.title || 'Member'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Permissions & Responsibilities:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {(rolePermissions[user?.role]?.permissions || rolePermissions.member.permissions).map((permission, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t">
              <Button onClick={() => setShowRoleInfo(false)} className="w-full">
                Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
