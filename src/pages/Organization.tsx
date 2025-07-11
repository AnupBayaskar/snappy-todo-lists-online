
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Plus, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const Organization = () => {
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [organizations, setOrganizations] = useState([
    {
      _id: '1',
      name: 'TechCorp Solutions',
      description: 'Leading technology solutions provider',
      teamsCount: 5,
      membersCount: 25
    }
  ]);
  const [newOrg, setNewOrg] = useState({
    name: '',
    description: ''
  });
  const { toast } = useToast();

  const handleCreateOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.name.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    const organization = {
      _id: Date.now().toString(),
      name: newOrg.name,
      description: newOrg.description,
      teamsCount: 0,
      membersCount: 1
    };

    setOrganizations([...organizations, organization]);
    setNewOrg({ name: '', description: '' });
    setShowCreateOrg(false);

    toast({
      title: "Success",
      description: "Organization created successfully",
    });
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Organization Management</h1>
            <p className="text-muted-foreground">Manage your organization structure and settings</p>
          </div>
          <Button 
            onClick={() => setShowCreateOrg(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card key={org._id} className="glass-effect border-border/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{org.name}</h3>
                  </div>
                </CardTitle>
                <CardDescription>{org.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-accent/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{org.teamsCount}</div>
                      <div className="text-muted-foreground">Teams</div>
                    </div>
                    <div className="text-center p-3 bg-accent/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{org.membersCount}</div>
                      <div className="text-muted-foreground">Members</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="mr-1 h-3 w-3" />
                      Manage Teams
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="mr-1 h-3 w-3" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Organization Dialog */}
        <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  placeholder="Enter organization name..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="orgDescription">Description (Optional)</Label>
                <Textarea
                  id="orgDescription"
                  value={newOrg.description}
                  onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                  placeholder="Brief description of the organization..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateOrg(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Create Organization
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Organization;
