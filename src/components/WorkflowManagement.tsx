import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, ChevronRight, CheckCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedTo: string;
  dueDate: string;
}

interface Workflow {
  id: string;
  title: string;
  steps: WorkflowStep[];
  caseId: string;
  status: 'Active' | 'Completed' | 'On Hold';
}

const WorkflowManagement: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      title: 'Standard Fraud Investigation',
      caseId: '1',
      status: 'Active',
      steps: [
        {
          id: '1',
          title: 'Initial Assessment',
          description: 'Review initial case details and evidence',
          status: 'Completed',
          assignedTo: 'Kofi Sarkodie',
          dueDate: '2024-03-15',
        },
        {
          id: '2',
          title: 'Evidence Collection',
          description: 'Gather all relevant evidence and documentation',
          status: 'In Progress',
          assignedTo: 'Cyril Ameko',
          dueDate: '2024-03-20',
        },
        {
          id: '3',
          title: 'Analysis',
          description: 'Analyze collected evidence and identify patterns',
          status: 'Pending',
          assignedTo: 'Kenneth Kofi Davordzie',
          dueDate: '2024-03-25',
        },
        {
          id: '4',
          title: 'Report Generation',
          description: 'Prepare final investigation report',
          status: 'Pending',
          assignedTo: 'Kofi Sarkodie',
          dueDate: '2024-03-30',
        },
      ],
    },
  ]);

  const [isNewWorkflowDialogOpen, setIsNewWorkflowDialogOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    title: '',
    description: '',
    caseId: '',
  });

  const [isEditStepDialogOpen, setIsEditStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const handleCreateWorkflow = () => {
    if (!newWorkflow.title.trim()) return;

    const workflowToAdd: Workflow = {
      id: Date.now().toString(),
      title: newWorkflow.title,
      caseId: newWorkflow.caseId,
      status: 'Active',
      steps: [
        {
          id: Date.now().toString(),
          title: 'Initial Assessment',
          description: 'Review initial case details and evidence',
          status: 'Pending',
          assignedTo: 'Unassigned',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      ],
    };
    setWorkflows([...workflows, workflowToAdd]);
    setNewWorkflow({ title: '', description: '', caseId: '' });
    setIsNewWorkflowDialogOpen(false);
  };

  const handleAddStep = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    setEditingStep({
      id: Date.now().toString(),
      title: '',
      description: '',
      status: 'Pending',
      assignedTo: 'Unassigned',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsEditStepDialogOpen(true);
  };

  const handleSaveStep = () => {
    if (!editingStep?.title.trim() || !selectedWorkflowId) return;

    setWorkflows(workflows.map(workflow => {
      if (workflow.id === selectedWorkflowId) {
        return {
          ...workflow,
          steps: [...workflow.steps, editingStep],
        };
      }
      return workflow;
    }));
    setIsEditStepDialogOpen(false);
    setEditingStep(null);
    setSelectedWorkflowId(null);
  };

  const handleUpdateStepStatus = (workflowId: string, stepId: string, newStatus: WorkflowStep['status']) => {
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === workflowId) {
        const updatedSteps = workflow.steps.map(step => {
          if (step.id === stepId) {
            return { ...step, status: newStatus };
          }
          return step;
        });

        // Update workflow status based on steps
        const allCompleted = updatedSteps.every(step => step.status === 'Completed');
        const anyInProgress = updatedSteps.some(step => step.status === 'In Progress');

        return {
          ...workflow,
          steps: updatedSteps,
          status: allCompleted ? 'Completed' : anyInProgress ? 'Active' : workflow.status,
        };
      }
      return workflow;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      case 'On Hold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Pending':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Workflow Management</h1>
          <Button onClick={() => setIsNewWorkflowDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6">
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{workflow.title}</CardTitle>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddStep(workflow.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflow.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{step.title}</h3>
                          <Badge className={getStepStatusColor(step.status)}>
                            {step.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{step.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Assigned to: {step.assignedTo}</span>
                          <span>Due: {step.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStepStatus(workflow.id, step.id, 'Completed')}
                          disabled={step.status === 'Completed'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isNewWorkflowDialogOpen} onOpenChange={setIsNewWorkflowDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Workflow Title"
                value={newWorkflow.title}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Workflow Description"
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Case ID"
                value={newWorkflow.caseId}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, caseId: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewWorkflowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow} disabled={!newWorkflow.title.trim()}>
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditStepDialogOpen} onOpenChange={setIsEditStepDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Step Title"
                value={editingStep?.title || ''}
                onChange={(e) => setEditingStep(editingStep ? { ...editingStep, title: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Step Description"
                value={editingStep?.description || ''}
                onChange={(e) => setEditingStep(editingStep ? { ...editingStep, description: e.target.value } : null)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Assigned To"
                value={editingStep?.assignedTo || ''}
                onChange={(e) => setEditingStep(editingStep ? { ...editingStep, assignedTo: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="date"
                value={editingStep?.dueDate || ''}
                onChange={(e) => setEditingStep(editingStep ? { ...editingStep, dueDate: e.target.value } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStepDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStep} disabled={!editingStep?.title.trim()}>
              Add Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowManagement; 