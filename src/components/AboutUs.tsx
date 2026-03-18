import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Shield, Users, Clock, CheckCircle, Mail, Phone, MapPin, Award } from 'lucide-react';
import type { Page } from '../App';

interface AboutUsProps {
  setCurrentPage: (page: Page) => void;
}

export function AboutUs({ setCurrentPage }: AboutUsProps) {
  const teamMembers = [
    {
      name: 'Dhyey Rathi',
      role: 'B.Tech 3rd Year',
      description: '',
    },
    {
      name: 'Mandar Yagnik',
      role: 'B.Tech 2nd Year',
      description: '',
    },
    {
      name: 'Janmejay Acharya',
      role: 'B.Tech 2nd Year',
      description: '',
    },
    {
      name: 'Yashumati Jangid',
      role: 'B.Tech 3rd Year',
      description: '',
    },
    {
      name: 'Siddhant Acharya',
      role: 'B.Tech 2nd Year',
      description: '',
    },
    {
      name: 'Divy Brahmbhatt',
      role: 'B.Tech 2nd Year',
      description: '',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About FixFlow</h1>
          <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            We're revolutionizing complaint management by creating transparent, efficient, 
            and user-friendly systems that ensure every voice is heard and every issue is resolved.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To provide a comprehensive, transparent, and efficient platform where individuals 
                can voice their concerns and receive fair, timely resolutions. We believe every 
                complaint deserves proper attention and every person deserves to be heard.
              </p>
            </Card>

            <Card className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become the leading complaint management platform that bridges the gap between 
                organizations and their communities, fostering trust, accountability, and 
                continuous improvement through effective communication.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="text-lg text-gray-600 leading-relaxed space-y-6">
            <p>
              FixFlow was born from the frustration of dealing with slow, opaque complaint processes. 
              Our founders experienced firsthand how difficult it could be to get issues resolved 
              when traditional systems failed to provide transparency or accountability.
            </p>
            <p>
              In 2023, we set out to change this reality. We built FixFlow with the core belief 
              that technology could make complaint management more human, not less. By combining 
              intuitive design with powerful tracking capabilities, we created a platform that 
              works for everyone - from students and parents to employees and citizens.
            </p>
            <p>
              Today, FixFlow serves thousands of users across various sectors, helping resolve 
              issues faster and more effectively than ever before. But our journey is just beginning.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose FixFlow */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FixFlow?</h2>
            <p className="text-lg text-gray-600">
              We're committed to excellence in every aspect of complaint management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">96% Success Rate</h3>
              <p className="text-gray-600">
                Nearly all complaints submitted through our platform receive satisfactory resolutions.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2.5 Day Average</h3>
              <p className="text-gray-600">
                Our streamlined process ensures quick turnaround times for complaint resolution.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your information is protected with enterprise-grade security and privacy measures.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Award Winning</h3>
              <p className="text-gray-600">
                Recognized for innovation in customer service and digital transformation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              Passionate professionals dedicated to your success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">
              Have questions? We're here to help you succeed
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">support@fixflow.com</p>
              <p className="text-gray-600">info@fixflow.com</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-600 text-sm">Mon-Fri 9AM-6PM EST</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Innovation Drive</p>
              <p className="text-gray-600">Tech City, TC 12345</p>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => setCurrentPage('home')}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              Get Started with FixFlow
            </Button>
          </div>
        </div>
      </section>

      {/* Credits Footer */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Created by proud students of JG University</h2>
          <p className="text-xl leading-relaxed">
            Dhyey Rathi | Mandar Yagnik | Janmejay Acharya | Yashumati Jangid | Siddhant Acharya | Divy Brahmbhatt
          </p>
        </div>
      </section>
    </div>
  );
}