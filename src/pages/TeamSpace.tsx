
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, UserPlus, Crown, Shield, CheckCircle, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Mock data - in real app this would come from API
const mockTeams = [
  {
    _id: '1',
    name: 'Security Team',
    members: [
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'team-lead', avatar: '', joinedAt: '2024-01-15', teamId: '1' },
      { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'validator', avatar: '', joinedAt: '2024-02-01', teamId: '1' },
      { _id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'member', avatar: '', joinedAt: '2024-02-15', teamId: '1' }
    ]
  },
  {
    _id: '2',
    name: 'IT Operations',
    members: [
      { _id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'team-lead', avatar: '', joinedAt: '2024-01-20', teamId: '2' },
      { _id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'member', avatar: '', joinedAt: '2024-03-01', teamId: '2' }
    ]
  }
];

const roleConfig = {
  'organization-lead': { label: 'Organization Leader', icon: Crown, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  'team-lead': { label: 'Team Leader', icon: Shield, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  'validator': { label: 'Validator', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  'member': { label: 'Member', icon: User, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' }
};

export default function TeamSpace() {
  const [teams, setTeams] = useState(mockTeams);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '', teamId: '' });
  const { user } = useAuth();

  const handleAddMember = (e) => {
    e.preventDefault();
    console.log('Adding new member:', newMember);
    // Mock implementation
    setShowAddMember(false);
    setNewMember({ name: '', email: '', role: '', teamId: '' });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="flex gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="w-16 h-20 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage your organization's teams and members</p>
        </div>
      </div>

      <div className="space-y-6">
        {teams.map((team) => (
          <Card key={team._id} className="border hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.members.length} members</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {team.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex flex-col items-center p-4 rounded-xl border border-border hover:bg-accent/50 transition-all duration-200 cursor-pointer min-w-[140px]"
                    onClick={() => setSelectedMember(member)}
                  >
                    <Avatar className="h-12 w-12 mb-3">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-sm text-center mb-2">{member.name}</p>
                    <Badge className={cn("text-xs mb-2", roleConfig[member.role]?.color || roleConfig.member.color)}>
                      {roleConfig[member.role]?.label || 'Member'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 text-blue-600 hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                  </div>
                ))}

                <div
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer min-w-[140px] min-h-[160px]"
                  onClick={() => {
                    setNewMember({ ...newMember, teamId: team._id });
                    setShowAddMember(true);
                  }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-blue-600">Add Member</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
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

      {/* Member Details Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-lg">
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.email}</p>
                  <Badge className={cn("mt-2", roleConfig[selectedMember.role]?.color || roleConfig.member.color)}>
                    {roleConfig[selectedMember.role]?.label || 'Member'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Joined:</span>
                  <span>{new Date(selectedMember.joinedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Team ID:</span>
                  <span className="font-mono text-xs">{selectedMember.teamId}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Reassign Team
                </Button>
                <Button variant="outline" className="flex-1">
                  Change Role
                </Button>
                <Button variant="destructive" className="flex-1">
                  Remove
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
