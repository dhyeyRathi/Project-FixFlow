# FixFlow Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" and fill in your project details
3. Wait for the project to be initialized (this takes a few minutes)

## 2. Configure Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **Anon Key**
3. Update the `/lib/supabase.ts` file by replacing the placeholder values:

```typescript
// Replace these with your actual credentials
const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'
```

## 3. Set up the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Copy the entire contents of the `sql/schema.sql` file
3. Paste it into the SQL Editor and click **Run**

This will create:
- `users` table with proper authentication integration
- `complaints` table with foreign key relationships
- Row Level Security (RLS) policies for data protection
- Default officer and admin users for testing

## 4. Test the Connection

1. Restart your development server after updating the Supabase credentials
2. Try logging in with the demo accounts:
   - **Regular Users**: `student@university.edu`, `parent@email.com`, etc. (password: `demo123`)
   - **Officer**: `officer@university.edu` (password: `demo123`)
   - **Admin**: `admin@university.edu` (password: `demo123`)

## 5. Verify Database Tables

In your Supabase dashboard:
1. Go to **Table Editor**
2. You should see two tables: `users` and `complaints`
3. The `users` table should have several default officers and an admin

## Demo vs Production Users

- **Demo Users**: Use hardcoded credentials and work even without Supabase connection
- **Production Users**: Created through the registration form and stored in Supabase
- Both types of users can coexist in the system

## Troubleshooting

If you're not seeing tables in Supabase:
1. Make sure you've run the SQL schema in the SQL Editor
2. Check the SQL Editor for any error messages
3. Verify your Supabase credentials are correct in `/lib/supabase.ts`
4. Restart your development server after making changes

## Security Notes

- Row Level Security is enabled to protect user data
- Users can only see their own complaints
- Officers can only see complaints assigned to them
- Admins have full access to manage all data
- Authentication is handled by Supabase Auth with JWT tokens