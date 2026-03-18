import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle, Clock, TrendingUp, Users, FileText, Shield } from 'lucide-react';
import type { Page } from '../App';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'employee' | 'citizen';
}

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  user: User | null;
}

export function HomePage({ setCurrentPage, user }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Introduction Section */}
      <section className="bg-[#699e7e] py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Welcome to <span className="text-5xl">FixFlow</span></h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-4xl mx-auto">
            FixFlow is your trusted partner in resolving complaints and ensuring your voice is heard. 
            Our advanced platform connects you with dedicated support teams, tracks your issues in real-time, 
            and provides transparent resolution processes. Whether you're a student, parent, employee, or citizen, 
            we're committed to turning your concerns into actionable solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-white mb-2">Secure & Confidential</h3>
              <p className="text-white/80">Your complaints are handled with utmost privacy and security</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-white mb-2">Fast Resolution</h3>
              <p className="text-white/80">Average resolution time of 2-5 business days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-white mb-2">Expert Support</h3>
              <p className="text-white/80">Dedicated team of professionals ready to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#699e7e]/10 to-[#699e7e]/5 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl mb-6 text-gray-900">
            Your Voice Matters with <span className="text-[#699e7e] font-bold text-6xl">FixFlow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A comprehensive complaint management system that ensures every issue is heard, tracked, and resolved efficiently. 
            From students to citizens, we're here to make your concerns count.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button
                  size="lg"
                  onClick={() => setCurrentPage('submit')}
                  className="bg-[#699e7e] hover:bg-[#5a8a6b] text-white px-8 py-4 text-lg"
                >
                  Submit a Complaint
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentPage('dashboard')}
                  className="border-[#699e7e] text-[#699e7e] hover:bg-[#699e7e]/10 px-8 py-4 text-lg"
                >
                  View Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => setCurrentPage('register')}
                  className="bg-[#699e7e] hover:bg-[#5a8a6b] text-white px-8 py-4 text-lg"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentPage('login')}
                  className="border-[#699e7e] text-[#699e7e] hover:bg-[#699e7e]/10 px-8 py-4 text-lg"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#699e7e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#699e7e]" />
              </div>
              <h3 className="text-3xl text-gray-900 mb-2">1,247</h3>
              <p className="text-gray-600">Issues Resolved</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl text-gray-900 mb-2">2.5 Days</h3>
              <p className="text-gray-600">Average Resolution Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl text-gray-900 mb-2">96%</h3>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-3xl text-gray-900 mb-2">5,000+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">How FixFlow Works</h2>
            <p className="text-lg text-gray-600">Simple, transparent, and effective complaint resolution</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-[#699e7e]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-[#699e7e]" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Submit Your Issue</h3>
              <p className="text-gray-600">
                Fill out our simple form with details about your complaint. Upload evidence and get a unique tracking ID instantly.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your complaint status in real-time. Get notifications via email, SMS, or through your dashboard.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Get Resolution</h3>
              <p className="text-gray-600">
                Receive detailed resolution information and provide feedback to help us improve our services.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">Who Can Use FixFlow?</h2>
            <p className="text-lg text-gray-600">Serving diverse communities with tailored solutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Students</h3>
              <p className="text-gray-600">Academic issues, facility problems, discrimination, etc.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Parents</h3>
              <p className="text-gray-600">School-related concerns, child safety, educational quality</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Employees</h3>
              <p className="text-gray-600">Workplace issues, harassment, policy violations</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Citizens</h3>
              <p className="text-gray-600">Public services, infrastructure, government concerns</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#699e7e]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl text-white mb-4">Ready to Make Your Voice Heard?</h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of users who trust FixFlow to resolve their concerns effectively and transparently.
          </p>
          <Button
            size="lg"
            onClick={() => setCurrentPage(user ? 'submit' : 'register')}
            className="bg-white text-[#699e7e] hover:bg-gray-100 px-8 py-4 text-lg"
          >
            {user ? 'Submit Your First Complaint' : 'Get Started Today'}
          </Button>
        </div>
      </section>
    </div>
  );
}