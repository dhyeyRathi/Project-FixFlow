import type { User as SupabaseUser } from '@supabase/supabase-js';

export type Role = 'student' | 'parent' | 'employee' | 'citizen' | 'officer' | 'admin';

export type User = SupabaseUser & {
  department?: string;
  role?: Role;
  phone?: string;
};

export type Complaint = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'cancelled' | 'escalated';
  category: string;
  department: string;
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
  created_at: string;
  updated_at: string;
};