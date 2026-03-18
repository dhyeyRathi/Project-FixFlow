import React, { useEffect, useState } from 'react';
import '@/styles/globals.css';
import type { Complaint } from '../types';
import { toast } from 'sonner';
import { 
  BarChart3,
  FileText, 
  Clock, 
  CheckCircle,
  Search, 
  Filter,
  Eye,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useAuth } from '../context/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'employee' | 'citizen' | 'officer' | 'admin';
  department?: string;
}

interface OfficerDashboardProps {
  user: User | null;
  complaints: Complaint[];
  onViewComplaint: (id: string) => void;
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
}

export function OfficerDashboard({ user, complaints, onViewComplaint, onUpdateComplaint }: OfficerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [progressNote, setProgressNote] = useState('');
  const [resolution, setResolution] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter complaints assigned to this officer
  const assignedComplaints = complaints.filter(complaint => {
    if (!user || !complaint) return false;
    
    // Check if complaint is assigned to this officer
    if (complaint.assigned_to === user.id) return true;
    
    // Check if it's a pending complaint in the officer's department
    if (complaint.status === 'pending' && 
        user.department && 
        complaint.department && 
        complaint.department === user.department) {
      return true;
    }
    
    return false;
  });

  // Apply filters
  const filteredComplaints = assignedComplaints.filter(complaint => {
    try {
      const titleMatch = complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const categoryMatch = complaint.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const idMatch = complaint.id?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      
      const matchesSearch = titleMatch || categoryMatch || idMatch || searchTerm === '';
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    } catch (error) {
      console.error('Error filtering complaint:', error);
      return false;
    }
  });

  // Stats for officer
  const stats = {
    total: assignedComplaints.length,
    pending: assignedComplaints.filter(c => c.status === 'pending').length,
    inProgress: assignedComplaints.filter(c => c.status === 'in-progress').length,
    resolved: assignedComplaints.filter(c => c.status === 'resolved').length,
    overdue: assignedComplaints.filter(c => {
      return c.due_date && new Date(c.due_date) < new Date() && c.status !== 'resolved' && c.status !== 'cancelled';
    }).length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'escalated':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Escalated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStartProgress = async (complaint: Complaint) => {
    if (!user) {
      toast.error('Please log in to perform this action');
      return;
    }

    try {
      setIsUpdating(true);
      
      // First check if complaint is still in a state where it can be started
      if (complaint.status !== 'pending') {
        toast.error('This complaint cannot be started - it is no longer pending');
        return;
      }

      const updates: Partial<Complaint> = {
        status: 'in-progress' as const,
        assigned_to: user.id,
        assigned_at: new Date().toISOString(),
        progress_notes: [...(complaint.progress_notes || []), {
          id: Date.now().toString(),
          note: 'Started working on complaint',
          added_by: user.id,
          added_at: new Date().toISOString()
        }]
      };

      await onUpdateComplaint(complaint.id, updates);
      toast.success('Complaint marked as in progress');
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update complaint status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddProgressNote = async () => {
    if (!selectedComplaint || !progressNote.trim() || !user) return;

    try {
      setIsUpdating(true);

      const newNote = {
        id: Date.now().toString(),
        note: progressNote.trim(),
        added_by: user.id,
        added_at: new Date().toISOString()
      };

      const updates: Partial<Complaint> = {
        progress_notes: [...(selectedComplaint.progress_notes || []), newNote]
      };

      await onUpdateComplaint(selectedComplaint.id, updates);
      setProgressNote('');
      toast.success('Progress note added successfully');
    } catch (error) {
      toast.error('Failed to add progress note');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResolveComplaint = async () => {
    if (!selectedComplaint || !resolution.trim() || !user) return;

    try {
      setIsUpdating(true);

      const updates: Partial<Complaint> = {
        status: 'resolved' as const,
        progress_notes: [...(selectedComplaint.progress_notes || []), {
          id: Date.now().toString(),
          note: `Resolution: ${resolution.trim()}`,
          added_by: user.id,
          added_at: new Date().toISOString()
        }]
      };

      await onUpdateComplaint(selectedComplaint.id, updates);
      setResolution('');
      setSelectedComplaint(null);
      toast.success('Complaint resolved successfully');
    } catch (error) {
      toast.error('Failed to resolve complaint');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (complaint: Complaint, reason: string) => {
    if (!user) return;

    try {
      const updates: Partial<Complaint> = {
        status: 'cancelled' as const,
        cancelled_at: new Date().toISOString(),
        progress_notes: [...(complaint.progress_notes || []), {
          id: Date.now().toString(),
          note: `Rejected: ${reason}`,
          added_by: user.id,
          added_at: new Date().toISOString()
        }]
      };

      await onUpdateComplaint(complaint.id, updates);
      toast.success('Complaint has been rejected');
    } catch (error) {
      toast.error('Failed to reject complaint');
    }
  };

  const isOverdue = (complaint: Complaint) => {
    if (!complaint.due_date) return false;
    return new Date(complaint.due_date) < new Date() && 
           complaint.status !== 'resolved' && 
           complaint.status !== 'cancelled';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl text-gray-900">Officer Dashboard</h1>
              <p className="mt-1 text-gray-600">
                {user?.name} - {user?.department} Department
              </p>
              <p className="text-sm text-gray-500">
                Manage and resolve assigned complaints efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  const highPriorityPending = filteredComplaints.filter(c => 
                    c.priority === 'high' && c.status === 'pending'
                  );
                  if (highPriorityPending.length > 0) {
                    onViewComplaint(highPriorityPending[0].id);
                  } else {
                    toast.info('No high priority pending complaints');
                  }
                }}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Review High Priority
              </Button>
              <Button
                onClick={() => {
                  const overdueCases = filteredComplaints.filter(isOverdue);
                  if (overdueCases.length > 0) {
                    onViewComplaint(overdueCases[0].id);
                  } else {
                    toast.info('No overdue complaints');
                  }
                }}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                Handle Overdue
              </Button>
              <Button
                onClick={() => setStatusFilter('in-progress')}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                View In Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Assigned</p>
                  <p className="text-2xl text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl text-gray-900">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl text-gray-900">{stats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl text-gray-900">{stats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        {assignedComplaints.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Your Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl text-green-700">{stats.resolved}</p>
                  <p className="text-sm text-green-600">Resolved This Period</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl text-blue-700">
                    {stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-sm text-blue-600">Resolution Rate</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl text-purple-700">{stats.inProgress}</p>
                  <p className="text-sm text-purple-600">Active Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complaints List */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Complaints</CardTitle>
            <CardDescription>
              {filteredComplaints.length} of {assignedComplaints.length} complaints
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 mb-2">No complaints found</h3>
                <p className="text-gray-600">No complaints match your current filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className={`p-6 hover:bg-gray-50 transition-colors ${isOverdue(complaint) ? 'border-l-4 border-red-500 bg-red-50/30' : complaint.priority === 'high' ? 'border-l-4 border-orange-400 bg-orange-50/30' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg text-gray-900">{complaint.title}</h3>
                          {getStatusBadge(complaint.status)}
                          {getPriorityBadge(complaint.priority)}
                          {isOverdue(complaint) && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {complaint.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(complaint.created_at)}
                          </span>
                          <span>{complaint.department}</span>
                          {complaint.due_date && (
                            <span className={`flex items-center gap-1 ${isOverdue(complaint) ? 'text-red-600' : ''}`}>
                              Due: {formatDate(complaint.due_date)}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-700 line-clamp-2 mb-2">
                          {complaint.description}
                        </p>

                        {complaint.progress_notes && complaint.progress_notes.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {complaint.progress_notes.length} progress note{complaint.progress_notes.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewComplaint(complaint.id)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>

                        {complaint.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStartProgress(complaint)}
                            className="bg-primary hover:bg-primary/90 gap-2"
                          >
                            <TrendingUp className="w-4 h-4" />
                            Start
                          </Button>
                        )}

                        {complaint.status === 'in-progress' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const resolution = prompt('How was this issue resolved? Please provide details:');
                              if (resolution && resolution.trim() && user) {
                                const updates: Partial<Complaint> = {
                                  status: 'resolved' as const,
                                  progress_notes: [...(complaint.progress_notes || []), {
                                    id: Date.now().toString(),
                                    note: `Resolution: ${resolution.trim()}`,
                                    added_by: user.id,
                                    added_at: new Date().toISOString()
                                  }]
                                };
                                onUpdateComplaint(complaint.id, updates);
                                toast.success('Complaint marked as resolved');
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700 gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Resolved
                          </Button>
                        )}

                        {(complaint.status === 'in-progress' || complaint.status === 'pending') && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedComplaint(complaint)}
                                className="gap-2"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Update
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Update Complaint Progress</DialogTitle>
                                <DialogDescription>
                                  Add progress notes or resolve the complaint
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                {/* Previous Progress Notes */}
                                {selectedComplaint?.progress_notes && selectedComplaint.progress_notes.length > 0 && (
                                  <div>
                                    <Label className="text-base">Previous Progress Notes</Label>
                                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                                      {selectedComplaint.progress_notes?.map((note: { id: string; note: string; added_by: string; added_at: string }) => (
                                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                                          <p className="text-sm text-gray-800">{note.note}</p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Added on {formatDate(note.added_at)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Add Progress Note */}
                                <div>
                                  <Label htmlFor="progressNote">Add Progress Note</Label>
                                  <Textarea
                                    id="progressNote"
                                    value={progressNote}
                                    onChange={(e) => setProgressNote(e.target.value)}
                                    placeholder="Enter progress update..."
                                    rows={3}
                                    className="mt-1"
                                  />
                                  <Button
                                    onClick={handleAddProgressNote}
                                    disabled={!progressNote.trim() || isUpdating}
                                    className="mt-2"
                                    size="sm"
                                  >
                                    Add Note
                                  </Button>
                                </div>

                                {selectedComplaint && selectedComplaint.status !== 'resolved' && (
                                  <>
                                    {/* Resolve Complaint */}
                                    <div>
                                      <Label htmlFor="resolution">Resolution (Mark as Resolved)</Label>
                                      <Textarea
                                        id="resolution"
                                        value={resolution}
                                        onChange={(e) => setResolution(e.target.value)}
                                        placeholder="Enter final resolution..."
                                        rows={4}
                                        className="mt-1"
                                      />
                                      <Button
                                        onClick={handleResolveComplaint}
                                        disabled={!resolution.trim() || isUpdating}
                                        className="mt-2 bg-green-600 hover:bg-green-700"
                                        size="sm"
                                      >
                                        Resolve Complaint
                                      </Button>
                                    </div>

                                    {/* Escalate Option */}
                                    <div className="pt-4 border-t">
                                      <Button
                                        onClick={() => {
                                          const reason = prompt('Please provide a reason for escalation:');
                                          if (reason && selectedComplaint) {
                                            handleReject(selectedComplaint, reason);
                                            setSelectedComplaint(null);
                                          }
                                        }}
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        size="sm"
                                      >
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Escalate to Higher Authority
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}