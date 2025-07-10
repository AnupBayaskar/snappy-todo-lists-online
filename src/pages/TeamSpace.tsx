
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Users, Plus, Eye, Trash2, UserPlus, Building } from 'lucide-react';

// Mock data - in a real app, this would come from your backend
const mockTeams = [
  {
    id: 'team-1',
    name: 'Security Team',
    admin: 'john.doe@company.com',
    members: [
      { id: 'user-1', name: 'John Doe', email: 'john.doe@company.com', role: 'admin' },
      { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@company.com', role: 'user' },
      { id: 'user-3', name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'user' },
    ]
  },
  {
    id: 'team-2',
    name: 'IT Operations',
    admin: 'alice.wilson@company.com',
    members: [
      { id: 'user-4', name: 'Alice Wilson', email: 'alice.wilson@company.com', role: 'admin' },
      { id: 'user-5', name: 'Bob Brown', email: 'bob.brown@company.com', role: 'user' },
    ]
  }
];

const TeamSpace = () => {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Mock user's team - in real app, this would be fetched based on user
  const userTeam = mockTeams[0]; // Assuming user belongs to first team
  const isAdmin = user?.role === 'admin';

  const handleViewDetails = (userId: string) => {
    console.log('View details for user:', userId);
    // In real app, navigate to user details page or open modal
  };

  const handleRemoveUser = (teamId: string, userId: string) => {
    console.log('Remove user:', userId, 'from team:', teamId);
    // In real app, call API to remove user from team
  };

  const handleAddTeam = () => {
    console.log('Add new team');
    // In real app, open modal or navigate to add team page
  };

  const handleAddUser = () => {
    console.log('Add new user');
    // In real app, open modal or navigate to add user page
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Team Space</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage teams and team members' : 'View your team information'}
          </p>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mb-6 flex gap-4">
            <Button onClick={handleAddTeam} className="bg-brand-green hover:bg-brand-green/90">
              <Building className="mr-2 h-4 w-4" />
              Add New Team
            </Button>
            <Button onClick={handleAddUser} variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>
        )}

        <div className="grid gap-6">
          {/* User's Team (Always visible) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>Your Team: {userTeam.name}</span>
              </CardTitle>
              <CardDescription>
                Team members and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Team Admin</h4>
                  <Badge variant="secondary">{userTeam.admin}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Team Members ({userTeam.members.length})</h4>
                  <div className="grid gap-2">
                    {userTeam.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(member.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Teams (Admin only) */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>All Teams</CardTitle>
                <CardDescription>
                  Manage all teams and their members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTeams.map((team) => (
                    <div key={team.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{team.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Admin: {team.admin}
                          </p>
                        </div>
                        <Badge variant="outline">{team.members.length} members</Badge>
                      </div>
                      
                      {selectedTeam === team.id && (
                        <div className="mt-4 space-y-2">
                          {team.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div>
                                <p className="font-medium text-sm">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                  {member.role}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewDetails(member.id)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {member.role !== 'admin' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveUser(team.id, member.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
                        className="mt-2"
                      >
                        {selectedTeam === team.id ? 'Hide Members' : 'View Members'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamSpace;
