
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building, Plus, Users, Search, Filter, Crown, Shield, CheckCircle, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Mock data
const mockTeams = [
  {
    _id: '1',
    name: 'Security Team',
    details: 'Handles security compliance and auditing',
    admin: 'John Doe',
    members: [
      { _id: '1', name: 'John Doe', role: 'team-lead' },
      { _id: '2', name: 'Jane Smith', role: 'validator' },
      { _id: '3', name: 'Bob Wilson', role: 'member' }
    ]
  },
  {
    _id: '2',
    name: 'IT Operations',
    details: 'Manages IT infrastructure and operations',
    admin: 'Alice Johnson',
    members: [
      { _id: '4', name: 'Alice Johnson', role: 'team-lead' },
      { _id: '5', name: 'Charlie Brown', role: 'member' }
    ]
  }
];

const mockAllMembers = [
  { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'team-lead', teams: ['Security Team'] },
  { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'validator', teams: ['Security Team'] },
  { _id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'member', teams: ['Security Team'] },
  { _id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'team-lead', teams: ['IT Operations'] },
  { _id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'member', teams: ['IT Operations'] }
];

const roleConfig = {
  'organization-lead': { label: 'Organization Leader', icon: Crown, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  'team-lead': { label: 'Team Leader', icon: Shield, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  'validator': { label: 'Validator', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  'member': { label: 'Member', icon: User, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' }
};

export default function OrganizationSpace() {
  const { user } = useAuth();
  const [teams, setTeams] = useState(mockTeams);
  const [allMembers, setAllMembers] = useState(mockAllMembers);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTeam, setNewTeam] = useState({ name: '', details: '', admin: '' });
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });

  // Only show this page for organization leaders
  if (user?.role !== 'organization-lead') {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            This page is only accessible to Organization Leaders.
          </p>
        </div>
      </div>
    );
  }

  const handleAddTeam = (e) => {
    e.preventDefault();
    console.log('Adding new team:', newTeam);
    setShowAddTeam(false);
    setNewTeam({ name: '', details: '', admin: '' });
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    console.log('Adding new member:', newMember);
    setShowAddMember(false);
    setNewMember({ name: '', email: '', role: '' });
  };

  const filteredMembers = allMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
          <Building className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Organization Space</h1>
          <p className="text-muted-foreground">Manage your organization</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Teams Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Teams</CardTitle>
            <Button onClick={() => setShowAddTeam(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card
                  key={team._id}
                  className="border-2 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowTeamDetails(true);
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        <p className="text-sm text-muted-foreground font-normal">
                          {team.members.length} members
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{team.details}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Admin:</span>
                      <Badge variant="outline" className="text-xs">
                        {team.admin}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Members List Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl">Organization Members</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={() => setShowAddMember(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardTitle>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Search members by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredMembers.map((member) => {
                const roleInfo = roleConfig[member.role] || roleConfig.member;
                const RoleIcon = roleInfo.icon;
                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" alt={member.name} />
                        <AvatarFallback className="bg-red-100 dark:bg-red-900/30 text-red-600">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-xs", roleInfo.color)}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleInfo.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Teams: {member.teams.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Team Dialog */}
      <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Team</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTeam} className="space-y-4">
            <Input
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              required
            />
            <Textarea
              placeholder="Team Details/Description"
              value={newTeam.details}
              onChange={(e) => setNewTeam({ ...newTeam, details: e.target.value })}
              rows={3}
            />
            <Select
              value={newTeam.admin}
              onValueChange={(value) => setNewTeam({ ...newTeam, admin: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Team Admin" />
              </SelectTrigger>
              <SelectContent>
                {allMembers.filter(m => m.role === 'team-lead' || m.role === 'validator').map((member) => (
                  <SelectItem key={member._id} value={member.name}>
                    {member.name} ({roleConfig[member.role]?.label})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddTeam(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Create Team
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Team Details Dialog */}
      <Dialog open={showTeamDetails} onOpenChange={setShowTeamDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Details: {selectedTeam?.name}</DialogTitle>
          </DialogHeader>
          {selectedTeam && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Team Information</h4>
                <p className="text-sm text-muted-foreground mb-2">{selectedTeam.details}</p>
                <p className="text-sm"><strong>Admin:</strong> {selectedTeam.admin}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Team Members ({selectedTeam.members.length})</h4>
                <div className="space-y-2">
                  {selectedTeam.members.map((member) => {
                    const roleInfo = roleConfig[member.role] || roleConfig.member;
                    return (
                      <div key={member._id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                          <Badge className={cn("text-xs", roleInfo.color)}>
                            {roleInfo.label}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            Reassign
                          </Button>
                          <Button size="sm" variant="outline">
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Add Members
                </Button>
                <Button variant="outline" className="flex-1">
                  Edit Team
                </Button>
                <Button variant="destructive" className="flex-1">
                  Delete Team
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              required
            />
            <Select
              value={newMember.role}
              onValueChange={(value) => setNewMember({ ...newMember, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="validator">Validator</SelectItem>
                <SelectItem value="team-lead">Team Lead</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddMember(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
