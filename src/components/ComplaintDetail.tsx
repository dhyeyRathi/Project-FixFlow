import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Star,
  CheckCircle,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Page, Complaint } from '../App';

interface ComplaintDetailProps {
  complaint: Complaint;
  onUpdate: (id: string, updates: Partial<Complaint>) => void;
  setCurrentPage: (page: Page) => void;
}

export function ComplaintDetail({ complaint, onUpdate, setCurrentPage }: ComplaintDetailProps) {
  const [feedbackRating, setFeedbackRating] = useState(complaint.feedback?.rating || 0);
  const [feedbackComment, setFeedbackComment] = useState(complaint.feedback?.comment || '');
  const [showFeedback, setShowFeedback] = useState(false);

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'in-progress': return 60;
      case 'resolved': return 100;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Low Priority</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFeedbackSubmit = () => {
    if (feedbackRating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    onUpdate(complaint.id, {
      feedback: {
        rating: feedbackRating,
        comment: feedbackComment
      }
    });

    toast.success('Feedback submitted successfully!');
    setShowFeedback(false);
  };

  const handleResolutionAction = (accepted: boolean) => {
    // In a real app, this would update the complaint status
    toast.success(accepted ? 'Resolution accepted' : 'Resolution rejected');
  };

  const mockResolution = complaint.status === 'resolved' ? 
    "Thank you for bringing this issue to our attention. After thorough investigation, we have implemented the following solution:\n\n1. Addressed the specific concern raised in your complaint\n2. Implemented preventive measures to avoid similar issues\n3. Updated our internal processes to better handle such situations\n\nWe appreciate your patience and feedback. If you have any further concerns, please don't hesitate to reach out." :
    null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2">{complaint.title}</h1>
              <div className="flex items-center gap-3">
                {getStatusBadge(complaint.status)}
                {getPriorityBadge(complaint.priority)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tracking ID</p>
              <p className="text-lg text-gray-900">{complaint.id}</p>
            </div>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {getStatusIcon(complaint.status)}
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{getStatusProgress(complaint.status)}%</span>
                  </div>
                  <Progress value={getStatusProgress(complaint.status)} className="h-2" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${complaint.status !== 'pending' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className={complaint.status !== 'pending' ? 'text-green-600' : 'text-yellow-600'}>
                    Submitted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${complaint.status === 'resolved' ? 'bg-green-500' : complaint.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <span className={complaint.status === 'resolved' ? 'text-green-600' : complaint.status === 'in-progress' ? 'text-blue-600' : 'text-gray-500'}>
                    Under Review
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${complaint.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={complaint.status === 'resolved' ? 'text-green-600' : 'text-gray-500'}>
                    Resolved
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Details */}
            <Card>
              <CardHeader>
                <CardTitle>Complaint Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-600 mb-1">Category</h4>
                  <p className="text-gray-900">{complaint.category}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm text-gray-600 mb-2">Description</h4>
                  <p className="text-gray-900 leading-relaxed">{complaint.description}</p>
                </div>
                
                {complaint.attachments && complaint.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Attachments</h4>
                      <div className="space-y-2">
                        {complaint.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Resolution */}
            {complaint.status === 'resolved' && mockResolution && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Resolution
                  </CardTitle>
                  <CardDescription>
                    Resolved on {complaint.resolvedAt ? formatDate(complaint.resolvedAt) : formatDate(complaint.submittedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 leading-relaxed mb-6">{mockResolution}</p>
                  
                  {!complaint.feedback && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleResolutionAction(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Resolution
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResolutionAction(false)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject Resolution
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowFeedback(true)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Give Feedback
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Feedback Form */}
            {showFeedback && (
              <Card>
                <CardHeader>
                  <CardTitle>Provide Feedback</CardTitle>
                  <CardDescription>
                    Help us improve by rating this resolution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm text-gray-600 mb-2">Rating</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= feedbackRating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-600 mb-2">Comments (Optional)</h4>
                    <Textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Share your thoughts about the resolution..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={handleFeedbackSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                      Submit Feedback
                    </Button>
                    <Button variant="outline" onClick={() => setShowFeedback(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Feedback */}
            {complaint.feedback && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= complaint.feedback!.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {complaint.feedback.comment && (
                    <p className="text-gray-900">{complaint.feedback.comment}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm text-gray-900">Complaint Submitted</p>
                    <p className="text-xs text-gray-600">{formatDate(complaint.submittedAt)}</p>
                  </div>
                </div>
                
                {complaint.status !== 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-gray-900">Under Review</p>
                      <p className="text-xs text-gray-600">
                        {new Date(new Date(complaint.submittedAt).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {complaint.status === 'resolved' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm text-gray-900">Resolved</p>
                      <p className="text-xs text-gray-600">
                        {complaint.resolvedAt ? formatDate(complaint.resolvedAt) : 'Recently'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm text-gray-900 capitalize">{complaint.status.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Priority</span>
                  <span className="text-sm text-gray-900 capitalize">{complaint.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm text-gray-900">{complaint.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Submitted</span>
                  <span className="text-sm text-gray-900">
                    {new Date(complaint.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-sm text-blue-900 mb-2">Need Help?</h3>
                <p className="text-xs text-blue-800 mb-3">
                  If you have questions about this complaint or need additional assistance:
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Contact support at support@fixflow.com</li>
                  <li>• Call our helpline: 1-800-FIXFLOW</li>
                  <li>• Reference your tracking ID: {complaint.id}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}