import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Case {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Under Review' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  createdAt: string;
  lastUpdated: string;
  district?: string;
  anomalyType?: string;
  value?: number;
  threshold?: number;
}

const CaseManagement: React.FC = () => {
  const teamMembers = [
    'Kofi Sarkodie',
    'Cyril Ameko',
    'Kenneth Kofi Davordzie'
  ];

  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const { toast } = useToast();

  // Load cases from localStorage on component mount
  useEffect(() => {
    const savedCases = localStorage.getItem('cases');
    if (savedCases) {
      const parsedCases = JSON.parse(savedCases);
      // Update any unassigned cases with team members
      const updatedCases = parsedCases.map((caseItem: Case) => {
        if (caseItem.assignedTo === 'Unassigned') {
          // Assign to Kofi Sarkodie by default if unassigned
          return {
            ...caseItem,
            assignedTo: teamMembers[0],
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return caseItem;
      });
      setCases(updatedCases);
      // Save the updated cases back to localStorage
      localStorage.setItem('cases', JSON.stringify(updatedCases));
    }
  }, []);

  // Save cases to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cases', JSON.stringify(cases));
  }, [cases]);

  // Filter cases based on search term and status
  useEffect(() => {
    let filtered = cases;
    
    if (searchTerm) {
      filtered = filtered.filter(caseItem => 
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.district?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(caseItem => caseItem.status === statusFilter);
    }
    
    setFilteredCases(filtered);
  }, [cases, searchTerm, statusFilter]);

  const [newCase, setNewCase] = useState<{
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    assignedTo: string;
  }>({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: teamMembers[0]
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateCase = () => {
    if (!newCase.title.trim() || !newCase.description.trim() || !newCase.assignedTo) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including assignee",
        variant: "destructive",
      });
      return;
    }

    // Ensure assignedTo is not 'Unassigned'
    const assignedTo = newCase.assignedTo === 'Unassigned' ? teamMembers[0] : newCase.assignedTo;

    const caseToAdd: Case = {
      id: Date.now().toString(),
      ...newCase,
      assignedTo,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    
    setCases(prev => [...prev, caseToAdd]);
    setNewCase({ 
      title: '', 
      description: '', 
      priority: 'Medium',
      assignedTo: teamMembers[0]
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "New case created successfully",
      variant: "default",
    });
  };

  const handleUpdateCaseStatus = (caseId: string, newStatus: Case['status']) => {
    setCases(prev => prev.map(caseItem => {
      if (caseItem.id === caseId) {
        return {
          ...caseItem,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return caseItem;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500';
      case 'In Progress':
        return 'bg-yellow-500';
      case 'Under Review':
        return 'bg-purple-500';
      case 'Closed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'High':
        return 'bg-orange-500';
      case 'Critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col p-2 sm:p-4 md:p-6">
      <div className="flex-none space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Case Management</h1>
          <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search cases..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.length > 0 ? (
            filteredCases.map((caseItem) => (
              <Card key={caseItem.id} className="break-words">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <CardTitle className="text-base sm:text-lg">{caseItem.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getStatusColor(caseItem.status)}>
                        {caseItem.status}
                      </Badge>
                      <Badge className={getPriorityColor(caseItem.priority)}>
                        {caseItem.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 break-words">{caseItem.description}</p>
                  <div className="space-y-2">
                    {caseItem.district && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        District: {caseItem.district}
                      </p>
                    )}
                    {caseItem.anomalyType && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Anomaly Type: {caseItem.anomalyType}
                      </p>
                    )}
                    {caseItem.value !== undefined && caseItem.threshold !== undefined && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Value: {caseItem.value} (Threshold: {caseItem.threshold})
                      </p>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Assigned to:</span>
                      <span>{caseItem.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Created:</span>
                      <span>{caseItem.createdAt}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Select
                      value={caseItem.status}
                      onValueChange={(value: Case['status']) => handleUpdateCaseStatus(caseItem.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center p-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? "No cases match your search criteria" 
                : "No cases have been created yet"}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Case</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Case Title"
                value={newCase.title}
                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Case Description"
                value={newCase.description}
                onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select
                  value={newCase.priority}
                  onValueChange={(value: Case['priority']) =>
                    setNewCase({ ...newCase, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Select
                  value={newCase.assignedTo}
                  onValueChange={(value: string) =>
                    setNewCase({ ...newCase, assignedTo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCase} disabled={!newCase.title.trim() || !newCase.description.trim()}>
              Create Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseManagement; 