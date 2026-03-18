import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SubmitComplaint } from './components/SubmitComplaint';
import { ComplaintDetail } from './components/ComplaintDetail';
import { ProfilePage } from './components/ProfilePage';
import { TrackIssues } from './components/TrackIssues';
import { AboutUs } from './components/AboutUs';
import { AIAssistant } from './components/AIAssistant';
import { Toaster } from './components/ui/sonner';
import { 
  supabase, 
  User, 
  Complaint,
  initializeDatabase,
  getComplaintsByUser,
  getComplaintsByOfficer,
  getAllComplaints,
  getAllUsers,
  createComplaint,
  updateComplaint,
  resolveComplaint,
  createUser,
  updateUser
} from './lib/supabase';
import { toast } from 'sonner@2.0.3';

export type Page = 'home' | 'login' | 'register' | 'dashboard' | 'submit' | 'complaint' | 'profile' | 'track' | 'about' | 'ai-assistant';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for existing session and initialize database
  useEffect(() => {
    async function initializeApp() {
      try {
        setLoading(true);
        
        // Initialize database
        await initializeDatabase();
        
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile from database
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile && !error) {
            setUser(profile);
            setCurrentPage('dashboard');
            await loadUserData(profile);
          }
        } else {
          // Check localStorage for demo user session
          const savedUser = localStorage.getItem('fixflow_user');
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setCurrentPage('dashboard');
            await loadUserData(userData);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        toast.error('Failed to initialize application');
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  // Load user-specific data
  async function loadUserData(userData: User) {
    try {
      if (userData.role === 'officer') {
        const officerComplaints = await getComplaintsByOfficer(userData.id);
        setComplaints(officerComplaints);
      } else if (userData.role === 'admin') {
        const allComplaints = await getAllComplaints();
        const allUsers = await getAllUsers();
        setComplaints(allComplaints);
        setUsers(allUsers);
      } else {
        const userComplaints = await getComplaintsByUser(userData.id);
        setComplaints(userComplaints);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    }
  }

  const login = async (userData: User) => {
    setUser(userData);
    
    // Save to localStorage for demo users (they start with 'demo-')
    if (userData.id.startsWith('demo-')) {
      localStorage.setItem('fixflow_user', JSON.stringify(userData));
    }
    
    await loadUserData(userData);
    setCurrentPage('dashboard');
  };

  const logout = async () => {
    try {
      if (user && !user.id.startsWith('demo-')) {
        await supabase.auth.signOut();
      }
      
      setUser(null);
      setComplaints([]);
      setUsers([]);
      localStorage.removeItem('fixflow_user');
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const addComplaint = async (complaintData: {
    title: string;
    category: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    attachments?: string[];
  }) => {
    if (!user) return;
    
    try {
      const newComplaint = await createComplaint({
        ...complaintData,
        user_id: user.id,
      });
      
      // Update local state
      setComplaints(prev => [newComplaint, ...prev]);
      return newComplaint.id;
    } catch (error) {
      console.error('Error creating complaint:', error);
      toast.error('Failed to submit complaint');
      throw error;
    }
  };

    const updateComplaintLocal = async (id: string, updates: Partial<Complaint>) => {
    try {
      // Perform the API update
      const response = await updateComplaint(id, updates);
      
      if (!response) {
        throw new Error('Failed to update complaint');
      }

      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint.id === id ? { ...complaint, ...response } : complaint
      ));
      
      toast.success('Complaint updated successfully');
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint');
      throw error;
    }
  };

  const cancelComplaint = async (id: string) => {
    try {
      await updateComplaint(id, {
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      });
      
      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint.id === id ? { 
          ...complaint, 
          status: 'cancelled' as const,
          cancelled_at: new Date().toISOString()
        } : complaint
      ));
    } catch (error) {
      console.error('Error cancelling complaint:', error);
      toast.error('Failed to cancel complaint');
    }
  };

  const resolveComplaintLocal = async (id: string, resolution?: string) => {
    if (!user) return;
    
    try {
      const resolvedComplaint = await resolveComplaint(id, user.id, resolution);
      
      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint.id === id ? resolvedComplaint : complaint
      ));
      
      toast.success('Complaint resolved successfully');
    } catch (error) {
      console.error('Error resolving complaint:', error);
      toast.error('Failed to resolve complaint');
    }
  };

  const viewComplaint = (id: string) => {
    setSelectedComplaintId(id);
    setCurrentPage('complaint');
  };

  const addUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser.id;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
      throw error;
    }
  };

  const updateUserLocal = async (id: string, updates: Partial<User>) => {
    try {
      await updateUser(id, updates);
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} user={user} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} onLogin={login} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} onLogin={login} />;
      case 'dashboard':
        if (user?.role === 'officer') {
          return (
            <OfficerDashboard
              user={user}
              complaints={complaints}
              onViewComplaint={viewComplaint}
              onUpdateComplaint={updateComplaintLocal}
              onResolveComplaint={(id, resolution) => resolveComplaintLocal(id, resolution)}
            />
          );
        } else if (user?.role === 'admin') {
          return (
            <AdminDashboard
              user={user}
              complaints={complaints}
              users={users}
              onUpdateComplaint={updateComplaintLocal}
              onAddUser={addUser}
              onUpdateUser={updateUserLocal}
            />
          );
        } else {
          return (
            <Dashboard
              user={user}
              complaints={complaints.filter(c => c.user_id === user?.id)}
              onViewComplaint={viewComplaint}
              onCancelComplaint={cancelComplaint}
            />
          );
        }
      case 'submit':
        // Prevent officers and admins from accessing submit page
        if (user?.role === 'officer' || user?.role === 'admin') {
          setCurrentPage('dashboard');
          return null;
        }
        return <SubmitComplaint onSubmit={addComplaint} setCurrentPage={setCurrentPage} user={user} />;
      case 'complaint':
        const complaint = complaints.find(c => c.id === selectedComplaintId);
        return complaint ? (
          <ComplaintDetail
            complaint={complaint}
            onUpdate={updateComplaintLocal}
            onCancel={cancelComplaint}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <div className="p-8 text-center">Complaint not found</div>
        );
      case 'profile':
        return <ProfilePage user={user} setCurrentPage={setCurrentPage} onLogout={logout} />;
      case 'track':
        return <TrackIssues complaints={complaints} onViewComplaint={viewComplaint} />;
      case 'about':
        return <AboutUs setCurrentPage={setCurrentPage} />;
      case 'ai-assistant':
        return <AIAssistant user={user} setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} user={user} />;
    }
  };

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            user={user}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onLogout={logout}
          />
          <main>
        {renderPage()}
      </main>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}