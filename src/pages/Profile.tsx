
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Users, Monitor, Shield, CheckSquare, FileText, Building, Crown, Mail, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const roleConfig = {
  'organization-lead': { 
    label: 'Organization Leader', 
    icon: Crown, 
    color: 'bg-primary/10 text-primary',
    description: 'Full access to all organizational functions'
  },
  'team-lead': { 
    label: 'Team Leader', 
    icon: Shield, 
    color: 'bg-secondary/10 text-secondary',
    description: 'Manage team members and validate compliance'
  },
  'validator': { 
    label: 'Validator', 
    icon: CheckSquare, 
    color: 'bg-green-500/10 text-green-600',
    description: 'Validate compliance submissions'
  },
  'member': { 
    label: 'Member', 
    icon: User, 
    color: 'bg-gray-500/10 text-gray-600',
    description: 'Submit and track compliance configurations'
  }
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  const roleInfo = roleConfig[user.role] || roleConfig.member;
  const RoleIcon = roleInfo.icon;

  const getQuickActions = () => {
    const actions = [
      { name: 'Team Space', href: '/team-space', icon: Users, description: 'Manage your teams' },
      { name: 'Device Space', href: '/device-space', icon: Monitor, description: 'Configure devices' },
      { name: 'Compliance Space', href: '/compliance-space', icon: Shield, description: 'Mark compliance' },
      { name: 'Validation Space', href: '/validation-space', icon: CheckSquare, description: 'Validate submissions' },
      { name: 'Reports Space', href: '/reports-space', icon: FileText, description: 'Generate reports' },
    ];

    if (user.role === 'organization-lead') {
      actions.push({
        name: 'Organization Space',
        href: '/organization-space',
        icon: Building,
        description: 'Manage organizations'
      });
    }

    return actions;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <Badge className={cn("mt-2", roleInfo.color)}>
                <RoleIcon className="h-4 w-4 mr-2" />
                {roleInfo.label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {roleInfo.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-muted-foreground">Navigate to different sections of the application</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {getQuickActions().map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={action.name}
                      variant="outline"
                      onClick={() => navigate(action.href)}
                      className="h-auto p-4 justify-start hover:border-primary/20 hover:bg-primary/5 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ActionIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{action.name}</div>
                          <div className="text-sm text-muted-foreground">{action.description}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info for Org Leaders */}
          {user.role === 'organization-lead' && (
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Organization Leader Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Create Organizations</h4>
                      <p className="text-sm text-muted-foreground">Set up new organizational structures</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/organization-space')}
                    >
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Global Validation</h4>
                      <p className="text-sm text-muted-foreground">Validate compliance across all teams</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/validation-space')}
                    >
                      Validate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
