import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Search, Eye, Calendar, AlertCircle } from 'lucide-react';
import type { Complaint } from '../App';

interface TrackIssuesProps {
  complaints: Complaint[];
  onViewComplaint: (id: string) => void;
}

export function TrackIssues({ complaints, onViewComplaint }: TrackIssuesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Complaint[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    
    const results = complaints.filter(complaint =>
      complaint.id.toLowerCase().includes(query) ||
      complaint.title.toLowerCase().includes(query) ||
      complaint.category.toLowerCase().includes(query) ||
      complaint.description.toLowerCase().includes(query) ||
      complaint.status.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (priority === 'medium') {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-green-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayedComplaints = isSearching ? searchResults : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Issues</h1>
          <p className="text-xl text-gray-600">
            Search and track the status of your complaints using your complaint ID or keywords
          </p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter complaint ID, title, category, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg py-3"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Search Tips:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use your complaint ID (e.g., "CMP-123456") for exact matches</li>
              <li>Search by category like "academic", "facility", "harassment"</li>
              <li>Use keywords from your complaint title or description</li>
              <li>Search by status: "pending", "in-progress", "resolved"</li>
            </ul>
          </div>
        </Card>

        {/* Search Results */}
        {isSearching && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results
              </h2>
              <span className="text-gray-600">
                {searchResults.length} complaint{searchResults.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {searchResults.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">No complaints found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or check your complaint ID
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {searchResults.map((complaint) => (
                  <Card key={complaint.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {complaint.title}
                          </h3>
                          <Badge className={`${getStatusColor(complaint.status)} capitalize`}>
                            {complaint.status}
                          </Badge>
                          {getPriorityIcon(complaint.priority)}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <strong>ID:</strong> {complaint.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(complaint.submittedAt)}
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {complaint.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 line-clamp-2">
                          {complaint.description}
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => onViewComplaint(complaint.id)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!isSearching && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Track by ID
              </h3>
              <p className="text-gray-600 mb-4">
                Enter your unique complaint ID (e.g., CMP-123456) to quickly find and track your specific issue.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search by Keywords
              </h3>
              <p className="text-gray-600 mb-4">
                Use keywords from your complaint title, description, or category to find multiple related issues.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}