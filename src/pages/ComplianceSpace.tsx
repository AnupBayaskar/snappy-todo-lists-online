import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  Eye,
  FileText,
  Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ComplianceSpace() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock compliance data
  const complianceItems = [
    {
      id: '1',
      control: 'CIS Control 1.1',
      title: 'Establish and Maintain Detailed Enterprise Asset Inventory',
      description: 'Establish and maintain an accurate, detailed, and up-to-date inventory of all enterprise assets.',
      status: 'compliant',
      lastUpdated: '2024-01-15',
      assignedTo: 'Security Team',
      priority: 'high'
    },
    {
      id: '2',
      control: 'CIS Control 2.1',
      title: 'Establish and Maintain a Software Inventory',
      description: 'Establish and maintain a detailed inventory of all licensed software installed on enterprise assets.',
      status: 'pending',
      lastUpdated: '2024-01-14',
      assignedTo: 'IT Operations',
      priority: 'medium'
    },
    {
      id: '3',
      control: 'CIS Control 3.1',
      title: 'Establish and Maintain a Data Management Process',
      description: 'Establish and maintain a data management process for sensitive data.',
      status: 'non-compliant',
      lastUpdated: '2024-01-13',
      assignedTo: 'Development Team',
      priority: 'high'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'non-compliant': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'compliant': 'bg-green-500 hover:bg-green-600',
      'non-compliant': 'bg-red-500 hover:bg-red-600',
      'pending': 'bg-yellow-500 hover:bg-yellow-600'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-500'}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'high': { variant: 'destructive' as const, text: 'High' },
      'medium': { variant: 'secondary' as const, text: 'Medium' },
      'low': { variant: 'outline' as const, text: 'Low' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['medium'];
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    );
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.control.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate compliance statistics
  const totalItems = complianceItems.length;
  const compliantItems = complianceItems.filter(item => item.status === 'compliant').length;
  const nonCompliantItems = complianceItems.filter(item => item.status === 'non-compliant').length;
  const pendingItems = complianceItems.filter(item => item.status === 'pending').length;
  const compliancePercentage = Math.round((compliantItems / totalItems) * 100);

  return (
    <div className="container mx-auto p-6 space-y-6 pt-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage CIS compliance controls across your organization
          </p>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compliancePercentage}%</div>
            <Progress value={compliancePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{compliantItems}</div>
            <p className="text-xs text-muted-foreground">Controls passing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{nonCompliantItems}</div>
            <p className="text-xs text-muted-foreground">Controls failing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingItems}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search compliance controls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="compliant">Compliant</option>
            <option value="non-compliant">Non-Compliant</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Compliance Controls List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <CardTitle className="text-lg">{item.control}</CardTitle>
                    <CardDescription>{item.title}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPriorityBadge(item.priority)}
                  {getStatusBadge(item.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{item.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated: </span>
                    <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Evidence
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No compliance controls found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedStatus !== 'all' 
              ? "Try adjusting your search or filter criteria."
              : "Compliance controls will appear here once configured."}
          </p>
        </div>
      )}
    </div>
  );
}
