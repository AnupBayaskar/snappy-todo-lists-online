import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Plus,
  Users,
  Search,
  Filter,
  Crown,
  Shield,
  CheckCircle,
  User,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock data
const mockOrganizations = [
  {
    _id: "1",
    name: "TechCorp Security",
    description: "Enterprise security compliance management",
    createdAt: "2024-01-15T10:00:00Z",
    memberCount: 45,
    teamCount: 8,
    status: "active",
  },
  {
    _id: "2",
    name: "Healthcare Systems",
    description: "HIPAA compliance and healthcare IT security",
    createdAt: "2024-01-10T14:30:00Z",
    memberCount: 23,
    teamCount: 4,
    status: "active",
  },
];

const mockTeams = [
  {
    _id: "1",
    name: "Security Team",
    details: "Handles security compliance and auditing",
    admin: "John Doe",
    members: [
      { _id: "1", name: "John Doe", role: "team-lead" },
      { _id: "2", name: "Jane Smith", role: "validator" },
      { _id: "3", name: "Bob Wilson", role: "member" },
    ],
  },
  {
    _id: "2",
    name: "IT Operations",
    details: "Manages IT infrastructure and operations",
    admin: "Alice Johnson",
    members: [
      { _id: "4", name: "Alice Johnson", role: "team-lead" },
      { _id: "5", name: "Charlie Brown", role: "member" },
    ],
  },
];

const mockAllMembers = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "team-lead",
    teams: ["Security Team"],
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "validator",
    teams: ["Security Team"],
  },
  {
    _id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "member",
    teams: ["Security Team"],
  },
  {
    _id: "4",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "team-lead",
    teams: ["IT Operations"],
  },
  {
    _id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "member",
    teams: ["IT Operations"],
  },
];

const roleConfig = {
  "organization-lead": {
    label: "Organization Leader",
    icon: Crown,
    color: "bg-primary/10 text-primary",
  },
  "team-lead": {
    label: "Team Leader",
    icon: Shield,
    color: "bg-secondary/10 text-secondary",
  },
  validator: {
    label: "Validator",
    icon: CheckCircle,
    color: "bg-green-500/10 text-green-600",
  },
  member: {
    label: "Member",
    icon: User,
    color: "bg-gray-500/10 text-gray-600",
  },
};

export default function OrganizationSpace() {
  const { user } = useAuth();

  // All state/hooks and handlers must be declared before any conditional rendering
  // Shared state
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: "",
    description: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [teams, setTeams] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTeam, setNewTeam] = useState({ name: "", details: "", admin: "" });
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Helper to get token
  const getToken = () => localStorage.getItem("governer-token");

  // Super admin handler
  const handleCreateOrgSuper = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("http://localhost:3000/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: newOrg.name,
          description: newOrg.description,
          admin: {
            name: newOrg.adminName,
            email: newOrg.adminEmail,
            password: newOrg.adminPassword,
          },
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create organization");
      }
      setSuccessMsg("Organization and Org Admin created successfully.");
      setNewOrg({
        name: "",
        description: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
      });
      setShowCreateOrg(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Error creating organization");
    } finally {
      setCreating(false);
    }
  };

  // Fetch organizations for super admin (all) or org admin (only their orgs)
  React.useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        let url = "http://localhost:3000/organizations";
        // If org admin, filter by admin email or id
        console.log("hellow", user, user.role, user.email);
        if (user && user.role === "organization-lead" && user.email) {
          url += `?adminEmail=${encodeURIComponent(user.email)}`;
        }
        console.log("[OrganizationSpace] Fetching organizations from:", url);
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch organizations");
        }
        const orgs = await res.json();
        console.log("[OrganizationSpace] Organizations fetched:", orgs);
        setOrganizations(orgs);
      } catch (err) {
        // Optionally show toast
        console.error("[OrganizationSpace] Error fetching organizations:", err);
      }
    };
    fetchOrganizations();
    // Only refetch if user changes
  }, [user]);

  // Fetch teams for selected organization
  React.useEffect(() => {
    if (!selectedOrg) return;
    const fetchTeams = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/teams?organization_id=${
            selectedOrg._id || selectedOrg.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch teams");
        }
        const teams = await res.json();
        setTeams(teams);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeams();
  }, [selectedOrg]);

  // Fetch all users for selected organization
  React.useEffect(() => {
    if (!selectedOrg) return;
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/users?organization_id=${
            selectedOrg._id || selectedOrg.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = await res.json();
        setAllMembers(users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [selectedOrg]);

  // Handlers for org, team, member creation
  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: newOrg.name,
          description: newOrg.description,
          admin: {
            name: newOrg.adminName,
            email: newOrg.adminEmail,
            password: newOrg.adminPassword,
          },
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create organization");
      }
      const org = await res.json();
      setOrganizations([...organizations, org]);
      setSelectedOrg(org);
      setShowCreateOrg(false);
      setNewOrg({
        name: "",
        description: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
      });
    } catch (err) {
      alert(err.message || "Error creating organization");
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!selectedOrg) return;
    try {
      const res = await fetch(`http://localhost:3000/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: newTeam.name,
          details: newTeam.details,
          admin: newTeam.admin,
          organization_id: selectedOrg._id || selectedOrg.id,
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create team");
      }
      const team = await res.json();
      setTeams([...teams, team]);
      setShowAddTeam(false);
      setNewTeam({ name: "", details: "", admin: "" });
    } catch (err) {
      alert(err.message || "Error creating team");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !selectedOrg) return;
    try {
      const res = await fetch(`http://localhost:3000/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email,
          password: newMember.password,
          role: newMember.role,
          team_id: selectedTeam._id || selectedTeam.id,
          organization_id: selectedOrg._id || selectedOrg.id,
        }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to add member");
      }
      const member = await res.json();
      setAllMembers([...allMembers, member]);
      setTeams(
        teams.map((team) =>
          team._id === selectedTeam._id
            ? { ...team, members: [...team.members, member] }
            : team
        )
      );
      setShowAddMember(false);
      setNewMember({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      alert(err.message || "Error adding member");
    }
  };

  // Derived filtered members
  const filteredMembers = allMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DEBUG: Show user object and role for troubleshooting
  console.log("OrganizationSpace user:", user);

  // Optionally, render user info in the UI for quick inspection
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">
          No user found in context. Please log in.
        </div>
      </div>
    );
  }

  // Show user debug info at the top for troubleshooting
  const debugUser = (
    <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded text-xs">
      <strong>Debug User:</strong> {JSON.stringify(user)}
    </div>
  );

  if ((user?.role as string) === "super-admin") {
    return (
      <div className="container mx-auto p-6">
        {debugUser}
        <h1 className="text-3xl font-bold mb-4">Organization Management</h1>
        <p className="mb-6 text-muted-foreground">
          As a Super Admin, you can create organizations and assign an
          Organization Admin. You cannot view or manage organization data.
        </p>
        <Button
          className="bg-primary mb-6"
          onClick={() => setShowCreateOrg(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
        {successMsg && (
          <div className="mb-4 text-green-600 font-medium">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mb-4 text-red-600 font-medium">{errorMsg}</div>
        )}
        <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOrgSuper} className="space-y-4">
              <Input
                placeholder="Organization Name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                required
              />
              <Textarea
                placeholder="Organization Description"
                value={newOrg.description}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, description: e.target.value })
                }
                rows={3}
              />
              <Input
                placeholder="Org Admin Name"
                value={newOrg.adminName}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, adminName: e.target.value })
                }
                required
              />
              <Input
                type="email"
                placeholder="Org Admin Email"
                value={newOrg.adminEmail}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, adminEmail: e.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Org Admin Password"
                value={newOrg.adminPassword}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, adminPassword: e.target.value })
                }
                required
              />
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateOrg(false)}
                  className="flex-1"
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 flex-1"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Organization Admin UI (organization-lead)
  if ((user?.role as string) === "organization-lead") {
    // If no org is selected, show org selection UI (org admin sees only their orgs)
    if (!selectedOrg) {
      return (
        <div className="container mx-auto p-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Building className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Organization Space</h1>
              <p className="text-muted-foreground">
                {organizations.length === 0
                  ? "No organization assigned to you. Please contact your Super Admin."
                  : "Select your organization to manage teams and members"}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Organization</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.length === 0 ? (
              <div className="text-muted-foreground col-span-3">
                No organization found.
              </div>
            ) : (
              organizations.map((org) => (
                <Card
                  key={org._id}
                  className="glass-card hover-lift cursor-pointer border-2 hover:border-primary/20"
                  onClick={() => setSelectedOrg(org)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{org.name}</h3>
                        <Badge className="bg-primary/10 text-primary">
                          {org.status}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {org.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary/5 rounded-xl">
                        <div className="text-lg font-bold text-primary">
                          {org.memberCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Members
                        </div>
                      </div>
                      <div className="text-center p-3 bg-secondary/5 rounded-xl">
                        <div className="text-lg font-bold text-secondary">
                          {org.teamCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Teams
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      );
    }

    // Show org management UI for selected org
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setSelectedOrg(null)}
              className="mr-4"
            >
              ← Back to Organizations
            </Button>
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Building className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{selectedOrg.name}</h1>
              <p className="text-muted-foreground">{selectedOrg.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Teams Section */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Teams</CardTitle>
              <Button
                onClick={() => setShowAddTeam(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams
                  .filter(
                    (team) =>
                      team.organization_id ===
                      (selectedOrg._id || selectedOrg.id)
                  )
                  .map((team) => (
                    <Card
                      key={team._id}
                      className="border-2 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20"
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowTeamDetails(true);
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {team.name}
                            </h3>
                            <p className="text-sm text-muted-foreground font-normal">
                              {Array.isArray(team.members)
                                ? team.members.length
                                : 0}{" "}
                              members
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {team.details}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Admin: </span>
                          <Badge variant="outline" className="text-xs">
                            {user.email}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Members List Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl">Organization Members</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    onClick={() => setShowAddMember(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
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
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn("text-xs", roleInfo.color)}>
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {roleInfo.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Teams: {member.teams.join(", ")}
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.name}{" "}
                                from the organization? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                                Remove Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Dialogs */}
          <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTeam} className="space-y-4">
                <Input
                  placeholder="Team Name"
                  value={newTeam.name}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, name: e.target.value })
                  }
                  required
                />
                <Textarea
                  placeholder="Team Details/Description"
                  value={newTeam.details}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, details: e.target.value })
                  }
                  rows={3}
                />
                <Select
                  value={newTeam.admin}
                  onValueChange={(value) =>
                    setNewTeam({ ...newTeam, admin: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Team Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMembers
                      .filter(
                        (m) => m.role === "team-lead" || m.role === "validator"
                      )
                      .map((member) => (
                        <SelectItem key={member._id} value={member.name}>
                          {member.name} ({roleConfig[member.role]?.label})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddTeam(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 flex-1"
                  >
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
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedTeam.details}
                    </p>
                    <p className="text-sm">
                      <strong>Admin:</strong> {selectedTeam.admin}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">
                      Team Members (
                      {Array.isArray(selectedTeam.members)
                        ? selectedTeam.members.length
                        : 0}
                      )
                    </h4>
                    <div className="space-y-2">
                      {(Array.isArray(selectedTeam.members)
                        ? selectedTeam.members
                        : []
                      ).map((member) => {
                        const roleInfo =
                          roleConfig[member.role] || roleConfig.member;
                        return (
                          <div
                            key={member._id}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
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
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newMember.password}
                  onChange={(e) =>
                    setNewMember({ ...newMember, password: e.target.value })
                  }
                  required
                />
                {/* <Select
                  value={newMember.role}
                  onValueChange={(value) =>
                    setNewMember({ ...newMember, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="validator">Validator</SelectItem>
                    <SelectItem value="team-lead">Team Lead</SelectItem>
                  </SelectContent>
                </Select> */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddMember(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 flex-1"
                  >
                    Add Member
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Fallback: Always show debug info if role is not recognized
  return (
    <div className="container mx-auto p-6">
      {debugUser}
      <div className="text-center text-red-600 font-bold mb-4">
        No matching UI for your role:{" "}
        <span className="font-mono">{user.role}</span>
      </div>
      <div className="text-muted-foreground text-sm">
        If you expected to see the Super Admin or Org Admin UI, check the value
        of <code>user.role</code> above. It must be exactly{" "}
        <code>"super-admin"</code> or <code>"organization-lead"</code>.
      </div>
    </div>
  );

  // Regular User: Only profile and assigned devices/compliance
  if ((user?.role as string) === "user") {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <p className="mb-6 text-muted-foreground">
          View and update your profile, see assigned devices, and perform
          compliance actions.
        </p>
        {/* Profile info, assigned devices, compliance actions UI goes here */}
        <div className="text-muted-foreground">
          (Regular user UI placeholder. Implement profile/device/compliance
          features here.)
        </div>
      </div>
    );
  }

  // Show organization selection first
  if (!selectedOrg) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Building className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Organization Space</h1>
            <p className="text-muted-foreground">
              Select or create an organization
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Organizations</h2>
          <Button
            onClick={() => setShowCreateOrg(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card
              key={org._id}
              className="glass-card hover-lift cursor-pointer border-2 hover:border-primary/20"
              onClick={() => setSelectedOrg(org)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{org.name}</h3>
                    <Badge className="bg-primary/10 text-primary">
                      {org.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {org.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-xl">
                    <div className="text-lg font-bold text-primary">
                      {org.memberCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/5 rounded-xl">
                    <div className="text-lg font-bold text-secondary">
                      {org.teamCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Teams</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Organization Dialog */}
        <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <Input
                placeholder="Organization Name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                required
              />
              <Textarea
                placeholder="Organization Description"
                value={newOrg.description}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, description: e.target.value })
                }
                rows={3}
              />
              <Input
                placeholder="Org Admin Name"
                value={newOrg.adminName}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, adminName: e.target.value })
                }
                required
              />
              <Input
                type="email"
                placeholder="Org Admin Email"
                value={newOrg.adminEmail}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, adminEmail: e.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Org Admin Password"
                value={newOrg.adminPassword}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, adminPassword: e.target.value })
                }
                required
              />
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateOrg(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-primary hover:bg-primary/90 flex-1"
                    >
                      Create Organization
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-primary" />
                      </div>
                      <AlertDialogTitle>
                        Confirm Organization Creation
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to create the organization "
                        {newOrg.name}"? This will also create an Org Admin user.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCreateOrg}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Create Organization
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Show organization management once selected
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setSelectedOrg(null)}
            className="mr-4"
          >
            ← Back to Organizations
          </Button>
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Building className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{selectedOrg.name}</h1>
            <p className="text-muted-foreground">{selectedOrg.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Teams Section */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Teams</CardTitle>
            <Button
              onClick={() => setShowAddTeam(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card
                  key={team._id}
                  className="border-2 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20"
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowTeamDetails(true);
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        <p className="text-sm text-muted-foreground font-normal">
                          {Array.isArray(team.members)
                            ? team.members.length
                            : 0}{" "}
                          members
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {team.details}
                    </p>
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
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl">Organization Members</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button
                  onClick={() => {
                    setShowAddMember(true);
                    setNewMember({
                      name: "",
                      email: "",
                      password: "",
                      role: "member",
                    });
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
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
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-xs", roleInfo.color)}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleInfo.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Teams: {member.teams.join(", ")}
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {member.name} from
                              the organization? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                              Remove Member
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
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
              onChange={(e) =>
                setNewTeam({ ...newTeam, details: e.target.value })
              }
              rows={3}
            />
            <Select
              value={newTeam.admin}
              onValueChange={(value) =>
                setNewTeam({ ...newTeam, admin: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Team Admin" />
              </SelectTrigger>
              <SelectContent>
                {allMembers
                  .filter(
                    (m) => m.role === "team-lead" || m.role === "validator"
                  )
                  .map((member) => (
                    <SelectItem key={member._id} value={member.name}>
                      {member.name} ({roleConfig[member.role]?.label})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddTeam(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 flex-1"
              >
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
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedTeam.details}
                </p>
                <p className="text-sm">
                  <strong>Admin:</strong> {selectedTeam.admin}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-3">
                  Team Members (
                  {Array.isArray(selectedTeam.members)
                    ? selectedTeam.members.length
                    : 0}
                  )
                </h4>
                <div className="space-y-2">
                  {(Array.isArray(selectedTeam.members)
                    ? selectedTeam.members
                    : []
                  ).map((member) => {
                    const roleInfo =
                      roleConfig[member.role] || roleConfig.member;
                    return (
                      <div
                        key={member._id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
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
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={newMember.password}
              onChange={(e) =>
                setNewMember({ ...newMember, password: e.target.value })
              }
              required
            />
            <Select
              value={newMember.role}
              onValueChange={(value) =>
                setNewMember({ ...newMember, role: value })
              }
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddMember(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 flex-1"
              >
                Add Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
