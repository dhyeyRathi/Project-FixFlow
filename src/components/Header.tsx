import React from 'react';
import { Button } from './ui/button';
import { Home, FileText, Search, User, Bug, MessageSquare } from 'lucide-react';
import logoImage from 'figma:asset/4995155343ff100050a22aef62618ed0aa8c26b0.png';
import type { Page } from '../App';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'parent' | 'employee' | 'citizen' | 'officer' | 'admin';
  department?: string;
}

interface HeaderProps {
  user: User | null;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

export function Header({ user, currentPage, setCurrentPage }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <img 
              src={logoImage} 
              alt="FixFlow Logo" 
              className="w-10 h-10"
            />
            <span className="text-3xl font-bold text-primary tracking-tight">FixFlow</span>
          </div>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage('dashboard')}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                {user.role === 'officer' ? 'Officer Dashboard' : user.role === 'admin' ? 'Admin Dashboard' : 'Home'}
              </Button>
              {/* Only show Submit Issue for regular users */}
              {user.role !== 'officer' && user.role !== 'admin' && (
                <Button
                  variant={currentPage === 'submit' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage('submit')}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Submit Issue
                </Button>
              )}
              <Button
                variant={currentPage === 'track' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage('track')}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                Track Issues
              </Button>
              <Button
                variant={currentPage === 'ai-assistant' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage('ai-assistant')}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                AI Assistant
              </Button>
              <Button
                variant={currentPage === 'about' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage('about')}
                className="gap-2"
              >
                About
              </Button>
              <Button
                variant={currentPage === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage('profile')}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
            </nav>
          )}

          {/* User section */}
          <div className="flex items-center gap-4">
            {!user && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage('login')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage('register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50 px-4 py-2">
          <div className="flex justify-around">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentPage('dashboard')}
            >
              <Home className="w-4 h-4" />
            </Button>
            {/* Only show Submit Issue for regular users in mobile */}
            {user.role !== 'officer' && user.role !== 'admin' && (
              <Button
                variant={currentPage === 'submit' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage('submit')}
              >
                <FileText className="w-4 h-4" />
              </Button>
            )}
            <Button 
              variant={currentPage === 'track' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setCurrentPage('track')}
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentPage('profile')}
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}