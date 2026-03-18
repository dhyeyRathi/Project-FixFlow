import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { signIn } from '../lib/supabase';
import type { Page } from '../App';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'parent' | 'employee' | 'citizen' | 'officer' | 'admin';
  department?: string;
}

interface LoginPageProps {
  setCurrentPage: (page: Page) => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ setCurrentPage, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoUsers = [
    { email: 'student@university.edu', password: 'demo123', name: 'John Doe', phone: '+1-555-0001', role: 'student' as const },
    { email: 'parent@email.com', password: 'demo123', name: 'Jane Smith', phone: '+1-555-0002', role: 'parent' as const },
    { email: 'employee@company.com', password: 'demo123', name: 'Mike Johnson', phone: '+1-555-0003', role: 'employee' as const },
    { email: 'citizen@city.gov', password: 'demo123', name: 'Sarah Wilson', phone: '+1-555-0004', role: 'citizen' as const },
    { email: 'officer@university.edu', password: 'demo123', name: 'Officer Brown', phone: '+1-555-0101', role: 'officer' as const, department: 'Academic Affairs' },
    { email: 'admin@university.edu', password: 'demo123', name: 'Admin User', phone: '+1-555-0100', role: 'admin' as const, department: 'Administration' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email && password) {
        const { user } = await signIn(email, password);
        onLogin(user);
        toast.success('Login successful!');
      } else {
        toast.error('Please fill in all fields');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your FixFlow account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <Button variant="link" className="text-sm text-primary hover:text-primary/80 p-0">
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to FixFlow?</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentPage('register')}
                >
                  Create an account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}