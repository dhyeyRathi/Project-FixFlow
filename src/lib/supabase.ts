import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings > API
const supabaseUrl = 'https://arhkrpljhwfvoddnkrlg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyaGtycGxqaHdmdm9kZG5rcmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQxMTEsImV4cCI6MjA3MzQ1MDExMX0.STagZ2FB5k0Gl2kuLdYk6M71Cd4-vmHY--WfNx4lD5c';

// Create Supabase client with auth options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper to check if the user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
function createMockSupabaseClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: new Error('Please configure your Supabase credentials in /lib/supabase.ts') 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: new Error('Please configure your Supabase credentials in /lib/supabase.ts') 
      }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') })
        }),
        order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') })
      }),
      insert: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) 
        })
      }),
      update: () => ({ 
        eq: () => ({ 
          select: () => ({ 
            single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) 
          })
        })
      }),
      upsert: () => Promise.resolve({ error: new Error('Supabase not configured') })
    }),
    rpc: () => Promise.resolve({ error: new Error('Supabase not configured') })
  };
}

// Database Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'parent' | 'employee' | 'citizen' | 'officer' | 'admin';
  department?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  last_login?: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'cancelled' | 'escalated';
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  submitted_at: string;
  assigned_to?: string;
  assigned_at?: string;
  assigned_by?: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution?: string;
  cancelled_at?: string;
  escalated_at?: string;
  escalation_reason?: string;
  department?: string;
  due_date?: string;
  attachments?: string[];
  feedback_rating?: number;
  feedback_comment?: string;
  feedback_given_at?: string;
  progress_notes?: Array<{
    id: string;
    note: string;
    added_by: string;
    added_at: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

// Category-Department mapping
export const CATEGORY_DEPARTMENT_MAP: Record<string, string> = {
  'Academic Affairs': 'Academic Affairs',
  'Facilities': 'Facilities', 
  'Student Services': 'Student Services',
  'Human Resources': 'Human Resources',
  'IT Services': 'IT Services',
  'Security': 'Security',
  'Administration': 'Administration'
};

// All possible departments
export const ALL_DEPARTMENTS = [
  'Academic Affairs',
  'Facilities',
  'Student Services',
  'IT Services',
  'Security',
  'Administration',
  'Human Resources'
] as const;

// Role-based categories
export const ROLE_CATEGORIES: Record<string, string[]> = {
  'student': ['Academic Affairs', 'Facilities', 'Student Services', 'IT Services', 'Security'],
  'parent': ['Academic Affairs', 'Student Services', 'Administration'],
  'employee': ['Human Resources', 'Facilities', 'IT Services', 'Security', 'Administration'],
  'citizen': ['Administration', 'Security', 'Facilities']
};

// Initialize database by inserting default users
export async function initializeDatabase() {
  // Remove demo mode check and always use Supabase
  
  try {
    await insertDefaultUsers();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize demo data in localStorage when Supabase isn't configured
function initializeDemoData() {
  const demoComplaints = localStorage.getItem('fixflow_demo_complaints');
  if (!demoComplaints) {
    localStorage.setItem('fixflow_demo_complaints', JSON.stringify([]));
  }
  
  const demoUsers = localStorage.getItem('fixflow_demo_users');
  if (!demoUsers) {
    const defaultUsers = [
      {
        id: 'demo-officer-1',
        name: 'John Smith',
        email: 'officer@university.edu',
        phone: '+1-555-0101',
        role: 'officer',
        department: 'Academic Affairs',
        is_active: true
      },
      {
        id: 'demo-officer-2', 
        name: 'Sarah Wilson',
        email: 'officer2@university.edu',
        phone: '+1-555-0102',
        role: 'officer',
        department: 'Facilities',
        is_active: true
      },
      {
        id: 'demo-admin-1',
        name: 'Admin User',
        email: 'admin@university.edu',
        phone: '+1-555-0100',
        role: 'admin',
        department: 'Administration',
        is_active: true
      }
    ];
    localStorage.setItem('fixflow_demo_users', JSON.stringify(defaultUsers));
  }
}

// Insert default users if they don't exist
async function insertDefaultUsers() {
  const defaultUsers = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'John Smith',
      email: 'officer@university.edu',
      phone: '+1-555-0101',
      role: 'officer' as const,
      department: 'Academic Affairs',
      is_active: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Sarah Wilson', 
      email: 'officer2@university.edu',
      phone: '+1-555-0102',
      role: 'officer' as const,
      department: 'Facilities',
      is_active: true
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Mike Johnson',
      email: 'officer3@university.edu',
      phone: '+1-555-0103',
      role: 'officer' as const,
      department: 'Student Services',
      is_active: true
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Lisa Brown',
      email: 'officer4@university.edu',
      phone: '+1-555-0104',
      role: 'officer' as const,
      department: 'IT Services',
      is_active: true
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Admin User',
      email: 'admin@university.edu', 
      phone: '+1-555-0100',
      role: 'admin' as const,
      department: 'Administration',
      is_active: true
    }
  ];

  for (const user of defaultUsers) {
    const { error } = await supabase
      .from('users')
      .upsert(user, { onConflict: 'email' });
    
    if (error) {
      console.error('Error inserting default user:', error);
    }
  }
}

// Authentication functions
export async function signUp(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: User['role'];
  department?: string;
}) {
  try {
    // Validate email format
    if (!userData.email.includes('@') || !userData.email.includes('.')) {
      throw new Error('Invalid email format');
    }

    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          department: userData.department
        }
      }
    });

    if (authError) {
      console.error('Auth error details:', {
        status: authError.status,
        message: authError.message,
        name: authError.name,
        details: authError
      });
      throw authError;
    }

    if (authData.user) {
      // Then create user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          department: userData.department,
          is_active: true,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return { user: userProfile, session: authData.session };
    }

    throw new Error('Failed to create user');
  } catch (error) {
    console.error('Sign up error details:', {
      error,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Check for demo users first (these work without Supabase setup)
    const demoUsers = [
      { email: 'student@university.edu', password: 'demo123', name: 'John Doe', phone: '+1-555-0001', role: 'student' as const },
      { email: 'parent@email.com', password: 'demo123', name: 'Jane Smith', phone: '+1-555-0002', role: 'parent' as const },
      { email: 'employee@company.com', password: 'demo123', name: 'Mike Johnson', phone: '+1-555-0003', role: 'employee' as const },
      { email: 'citizen@city.gov', password: 'demo123', name: 'Sarah Wilson', phone: '+1-555-0004', role: 'citizen' as const },
      { email: 'officer@university.edu', password: 'demo123', name: 'Officer Brown', phone: '+1-555-0101', role: 'officer' as const, department: 'Academic Affairs' },
      { email: 'admin@university.edu', password: 'demo123', name: 'Admin User', phone: '+1-555-0100', role: 'admin' as const, department: 'Administration' },
    ];

    const demoUser = demoUsers.find(user => user.email === email && user.password === password);
    
    if (demoUser) {
      // Create a mock session for demo users
      const mockUser: User = {
        id: `demo-${demoUser.role}-${Date.now()}`,
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
        role: demoUser.role,
        department: demoUser.department,
        is_active: true
      };
      
      return { user: mockUser, session: { user: mockUser } };
    }

    // Try Supabase auth for registered users
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id);

      return { user: profile, session: authData.session };
    }

    throw new Error('Authentication failed');
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Complaint functions
export async function createComplaint(complaintData: {
  title: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  attachments?: string[];
}) {
  try {
    // Generate complaint ID
    const complaintId = `CMP-${Date.now().toString().slice(-6)}`;
    
    // Use the category directly as the department
    const department = complaintData.category;
    const dueDate = getDueDateByPriority(complaintData.priority);
    
    // Find available officer in the department
    const assignedOfficer = await getRandomOfficerByDepartment(department);
    
    // If no officer is found for the department, try to assign to an admin
    const finalOfficer = assignedOfficer || await getRandomOfficerByDepartment('Administration');
    
    const complaint = {
      id: complaintId,
      title: complaintData.title,
      category: complaintData.category,
      description: complaintData.description,
      priority: complaintData.priority,
      user_id: complaintData.user_id,
      status: 'pending' as const,
      department,
      due_date: dueDate,
      attachments: complaintData.attachments || [],
      assigned_to: finalOfficer?.id,
      assigned_at: finalOfficer ? new Date().toISOString() : null,
      submitted_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('complaints')
      .insert(complaint)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
}

// Demo version for localStorage
function createComplaintDemo(complaintData: {
  title: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  attachments?: string[];
}) {
  const complaintId = `CMP-${Date.now().toString().slice(-6)}`;
  const department = complaintData.category;
  const dueDate = getDueDateByPriority(complaintData.priority);
  
  // Get random officer from demo users
  const demoUsers = JSON.parse(localStorage.getItem('fixflow_demo_users') || '[]');
  const officers = demoUsers.filter((user: any) => user.role === 'officer' && user.department === department);
  const assignedOfficer = officers.length > 0 ? officers[Math.floor(Math.random() * officers.length)] : null;
  
  const complaint = {
    id: complaintId,
    title: complaintData.title,
    category: complaintData.category,
    description: complaintData.description,
    priority: complaintData.priority,
    user_id: complaintData.user_id,
    status: 'pending' as const,
    department,
    due_date: dueDate,
    attachments: complaintData.attachments || [],
    assigned_to: assignedOfficer?.id || null,
    assigned_at: assignedOfficer ? new Date().toISOString() : null,
    submitted_at: new Date().toISOString(),
  };

  // Save to localStorage
  const existingComplaints = JSON.parse(localStorage.getItem('fixflow_demo_complaints') || '[]');
  existingComplaints.unshift(complaint);
  localStorage.setItem('fixflow_demo_complaints', JSON.stringify(existingComplaints));
  
  return complaint;
}

export async function getComplaintsByUser(userId: string) {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    const complaints = JSON.parse(localStorage.getItem('fixflow_demo_complaints') || '[]');
    return complaints.filter((c: any) => c.user_id === userId);
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    return [];
  }
}

export async function getComplaintsByOfficer(officerId: string) {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    const complaints = JSON.parse(localStorage.getItem('fixflow_demo_complaints') || '[]');
    return complaints.filter((c: any) => c.assigned_to === officerId);
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('assigned_to', officerId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching officer complaints:', error);
    return [];
  }
}

export async function getAllComplaints() {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    const complaints = JSON.parse(localStorage.getItem('fixflow_demo_complaints') || '[]');
    return complaints;
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        users!complaints_user_id_fkey (
          name,
          email,
          phone
        ),
        assigned_officer:users!complaints_assigned_to_fkey (
          name,
          email
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    return [];
  }
}

export async function updateComplaint(id: string, updates: Partial<Complaint>) {
  const isUserAuthenticated = await isAuthenticated();

  // Map status if it exists in updates to match database format
  const formattedUpdates = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  if (!isUserAuthenticated) {
    return updateComplaintDemo(id, formattedUpdates);
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .update(formattedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from update');
    }

    return data;
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
}

function updateComplaintDemo(id: string, updates: Partial<Complaint>) {
  try {
    const complaints = JSON.parse(localStorage.getItem('fixflow_demo_complaints') || '[]');
    
    const updatedComplaints = complaints.map((complaint: any) => {
      if (complaint.id === id) {
        const updatedComplaint = { 
          ...complaint, 
          ...updates,
          updated_at: new Date().toISOString()
        };
        return updatedComplaint;
      }
      return complaint;
    });
    
    localStorage.setItem('fixflow_demo_complaints', JSON.stringify(updatedComplaints));
    
    const updatedComplaint = updatedComplaints.find((c: any) => c.id === id);
    if (!updatedComplaint) {
      throw new Error('Complaint not found');
    }
    
    return updatedComplaint;
  } catch (error) {
    console.error('Error in demo update:', error);
    throw error;
  }
}

export async function resolveComplaint(id: string, officerId: string, resolution?: string) {
  const updates = {
    status: 'resolved' as const,
    resolved_at: new Date().toISOString(),
    resolved_by: officerId,
    resolution: resolution || 'Issue has been resolved.',
    updated_at: new Date().toISOString()
  };

  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return updateComplaintDemo(id, updates);
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error resolving complaint:', error);
    throw error;
  }
}

// Utility functions
async function getRandomOfficerByDepartment(department: string) {
  try {
    const { data: officers, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'officer')
      .eq('department', department)
      .eq('is_active', true);

    if (error) throw error;
    
    if (officers && officers.length > 0) {
      // Return random officer
      const randomIndex = Math.floor(Math.random() * officers.length);
      return officers[randomIndex];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting officer:', error);
    return null;
  }
}

function getDueDateByPriority(priority: string): string {
  const now = new Date();
  switch (priority) {
    case 'high':
      now.setDate(now.getDate() + 2); // 2 days for high priority
      break;
    case 'medium':
      now.setDate(now.getDate() + 5); // 5 days for medium priority
      break;
    case 'low':
      now.setDate(now.getDate() + 10); // 10 days for low priority
      break;
    default:
      now.setDate(now.getDate() + 7); // 7 days default
  }
  return now.toISOString();
}

// User management functions for admin
export async function getAllUsers() {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    const users = JSON.parse(localStorage.getItem('fixflow_demo_users') || '[]');
    return users;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function updateUser(id: string, updates: Partial<User>) {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return updateUserDemo(id, updates);
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

function updateUserDemo(id: string, updates: Partial<User>) {
  const users = JSON.parse(localStorage.getItem('fixflow_demo_users') || '[]');
  const updatedUsers = users.map((user: any) => 
    user.id === id ? { ...user, ...updates, updated_at: new Date().toISOString() } : user
  );
  localStorage.setItem('fixflow_demo_users', JSON.stringify(updatedUsers));
  
  const updatedUser = updatedUsers.find((u: any) => u.id === id);
  return updatedUser;
}

export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return createUserDemo(userData);
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

function createUserDemo(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const newUser = {
    ...userData,
    id: `demo-user-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  };

  const users = JSON.parse(localStorage.getItem('fixflow_demo_users') || '[]');
  users.push(newUser);
  localStorage.setItem('fixflow_demo_users', JSON.stringify(users));
  
  return newUser;
}