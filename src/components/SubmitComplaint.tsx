import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ALL_DEPARTMENTS, User } from '../lib/supabase';
import type { Page } from '../App';

interface SubmitComplaintProps {
  onSubmit: (complaint: {
    title: string;
    category: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    attachments?: string[];
  }) => Promise<string | undefined>;
  setCurrentPage: (page: Page) => void;
  user: User | null;
}

export function SubmitComplaint({ onSubmit, setCurrentPage, user }: SubmitComplaintProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use all departments as categories
  const categories = ALL_DEPARTMENTS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        toast.error('You must be logged in to submit a complaint');
        return;
      }

      if (!user) {
        toast.error('You must be logged in to submit a complaint');
        return;
      }

      if (formData.title && formData.category && formData.description) {
        const complaintId = await onSubmit({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          priority: formData.priority,
          attachments: attachments.map(file => file.name)
        });

        toast.success(`Complaint submitted successfully! Tracking ID: ${complaintId}`);
        setCurrentPage('dashboard');
      } else {
        toast.error('Please fill in all required fields');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error('Some files were rejected. Please ensure files are images, PDFs, or text files under 5MB.');
    }

    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl text-gray-900">Submit New Issue</h1>
          <p className="mt-2 text-gray-600">
            Please provide detailed information about your issue. All fields marked with * are required.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>
              Fill out this form to submit your complaint. You'll receive a tracking ID to monitor progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Brief summary of your issue"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Priority will be automatically determined by our AI based on your issue details
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide detailed information about your issue..."
                  rows={6}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Evidence/Attachments</Label>
                <div className="mt-1">
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      <label htmlFor="file-upload" className="font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer">
                        Upload files
                      </label>{' '}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, PDF, TXT up to 5MB each (max 5 files)
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.txt"
                      className="hidden"
                    />
                  </div>

                  {/* Uploaded Files */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage('dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Issue'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll receive a unique tracking ID to monitor your complaint</li>
            <li>• Our team will review your submission within 24 hours</li>
            <li>• You'll get regular updates via email and in your dashboard</li>
            <li>• Average resolution time is 2-5 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}