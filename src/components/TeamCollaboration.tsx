import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Send, Plus, UserPlus, MoreVertical, Shield, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type Role = 'Admin' | 'Manager' | 'Investigator' | 'Analyst' | 'Field Agent';

interface TeamMember {
  id: string;
  name: string;
  role: Role;
  status: 'Online' | 'Busy' | 'Offline';
  avatar?: string;
  permissions: string[];
}

interface Message {
  id: string;
  sender: TeamMember;
  content: string;
  timestamp: string;
  caseId: string;
}

const rolePermissions: Record<Role, string[]> = {
  'Admin': ['manage_team', 'manage_roles', 'view_all_cases', 'edit_all_cases'],
  'Manager': ['manage_team', 'view_all_cases', 'edit_all_cases'],
  'Investigator': ['view_assigned_cases', 'edit_assigned_cases', 'create_reports'],
  'Analyst': ['view_assigned_cases', 'analyze_data', 'create_reports'],
  'Field Agent': ['view_assigned_cases', 'update_field_data']
};

const TeamCollaboration: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Kofi Sarkodie',
      role: 'Admin',
      status: 'Online',
      permissions: rolePermissions['Admin'],
    },
    {
      id: '2',
      name: 'Cyril Ameko',
      role: 'Analyst',
      status: 'Busy',
      permissions: rolePermissions['Analyst'],
    },
    {
      id: '3',
      name: 'Kenneth Kofi Davordzie',
      role: 'Field Agent',
      status: 'Offline',
      permissions: rolePermissions['Field Agent'],
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: teamMembers[0],
      content: `I've identified a suspicious pattern in the meter readings from Achimota district.`,
      timestamp: '2024-03-15 10:30',
      caseId: '1',
    },
    {
      id: '2',
      sender: teamMembers[1],
      content: `Can you share the specific readings you're referring to?`,
      timestamp: '2024-03-15 10:32',
      caseId: '1',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Field Agent' as Role,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageToAdd: Message = {
        id: Date.now().toString(),
        sender: teamMembers[0], // This would be the current user
        content: newMessage,
        timestamp: new Date().toLocaleString(),
        caseId: '1', // This would come from the current case context
      };
      setMessages([...messages, messageToAdd]);
      setNewMessage('');
    }
  };

  const handleAddMember = () => {
    if (!newMember.name.trim()) return;

    const memberToAdd: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role,
      status: 'Online',
      permissions: rolePermissions[newMember.role],
    };
    setTeamMembers([...teamMembers, memberToAdd]);
    setNewMember({ name: '', role: 'Field Agent' });
    setIsAddMemberDialogOpen(false);
  };

  const handleUpdateMemberStatus = (memberId: string, newStatus: TeamMember['status']) => {
    setTeamMembers(teamMembers.map(member => {
      if (member.id === memberId) {
        return { ...member, status: newStatus };
      }
      return member;
    }));
  };

  const handleUpdateMemberRole = (memberId: string, newRole: Role) => {
    setTeamMembers(teamMembers.map(member => {
      if (member.id === memberId) {
        return { 
          ...member, 
          role: newRole,
          permissions: rolePermissions[newRole]
        };
      }
      return member;
    }));
    setIsRoleDialogOpen(false);
    setSelectedMember(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online':
        return 'bg-green-500';
      case 'Busy':
        return 'bg-yellow-500';
      case 'Offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-500';
      case 'Manager':
        return 'bg-blue-500';
      case 'Investigator':
        return 'bg-orange-500';
      case 'Analyst':
        return 'bg-teal-500';
      case 'Field Agent':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Team Collaboration</h1>
          <Button onClick={() => setIsAddMemberDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{member.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleUpdateMemberStatus(member.id, 'Online')}>
                          Set Online
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateMemberStatus(member.id, 'Busy')}>
                          Set Busy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateMemberStatus(member.id, 'Offline')}>
                          Set Offline
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedMember(member);
                            setIsRoleDialogOpen(true);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Case Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-[400px] overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-4 p-4 bg-muted rounded-lg"
                  >
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback>
                        {message.sender.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium truncate">{message.sender.name}</span>
                        <Badge className={getRoleColor(message.sender.role)}>
                          {message.sender.role}
                        </Badge>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 break-words">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex space-x-4">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Member Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Select
                value={newMember.role}
                onValueChange={(value: Role) => setNewMember({ ...newMember, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(rolePermissions).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={!newMember.name.trim()}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Change Role for {selectedMember?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Select
                value={selectedMember?.role}
                onValueChange={(value: Role) => handleUpdateMemberRole(selectedMember!.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(rolePermissions).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Current Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember?.permissions.map((permission) => (
                  <Badge key={permission} variant="secondary">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamCollaboration; 