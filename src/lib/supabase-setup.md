# Supabase Setup Instructions

## 1. Create a new Supabase project
- Go to [https://supabase.com](https://supabase.com)
- Create a new project
- Note down your project URL and anon key

## 2. Set up environment variables
Create a `.env.local` file in your root directory with:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run the database schema
In your Supabase SQL editor, run the contents of `/sql/schema.sql`

## 4. Test the connection
The app will automatically initialize the database tables and insert default users when you first run it.

## Default Demo Users
The following demo users are available for testing:
- **Student:** student@university.edu / demo123
- **Parent:** parent@email.com / demo123  
- **Employee:** employee@company.com / demo123
- **Citizen:** citizen@city.gov / demo123
- **Officer:** officer@university.edu / demo123
- **Admin:** admin@university.edu / demo123

## Database Tables

### users
- Contains all user profiles (students, officers, admins)
- Links to Supabase Auth users
- Includes role-based access control

### complaints  
- Stores all complaint data
- Automatically assigns to officers based on department
- Tracks status changes and resolution
- Supports file attachments and progress notes

## Features Included
✅ Role-based authentication
✅ Automatic officer assignment by category
✅ Real-time status updates
✅ Category filtering by user role
✅ Complaint resolution workflow
✅ Admin dashboard with analytics
✅ Officer dashboard for managing assigned complaints
✅ User dashboard for tracking submissions