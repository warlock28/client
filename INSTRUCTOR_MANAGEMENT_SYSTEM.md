# Instructor Management System - Implementation Guide

## Overview

The instructor management system has been completely redesigned to follow proper security practices:

- **Instructors can no longer self-register** through the student interface
- **Only admins can create, edit, and delete instructor accounts**
- **Instructors access their limited dashboard through the admin panel**
- **Comprehensive audit trail** tracks all admin actions

## System Architecture

### 1. Student Interface (Frontend)
- **Location**: `/frontend/src/`
- **Access**: Public access, students only
- **Removed Features**: 
  - Instructor login option
  - Instructor registration
  - Instructor dashboard route

### 2. Admin Panel
- **Location**: `/admin/src/`
- **Access**: Admin and Instructor login only
- **Features**:
  - Admin: Full instructor management
  - Instructor: Limited dashboard access

### 3. Backend APIs
- **Admin APIs**: `/api/admin/*` - Full CRUD operations
- **Instructor APIs**: `/api/instructor/*` - Limited dashboard access

## User Roles & Access Control

### Admin Role
- **Login**: Through admin panel only
- **Credentials**: Set via environment variables
- **Capabilities**:
  - Create new instructor accounts
  - Edit instructor profiles and permissions
  - Delete instructor accounts
  - Monitor all activities
  - View comprehensive audit logs
  - Access all system data

### Instructor Role  
- **Account Creation**: Admin-created only
- **Login**: Through admin panel with admin-provided credentials
- **Capabilities**:
  - View personal dashboard (read-only for most data)
  - Manage assigned consultations
  - Update limited profile information (fees, availability, about section)
  - View assigned students and consultation history

### Student Role
- **Login**: Through main website
- **Self-registration**: Allowed
- **Capabilities**:
  - Browse instructors (view-only)
  - Book consultations
  - Manage personal profile
  - View consultation history

## Environment Setup

### Required Environment Variables

Add to backend `.env` file:
```
ADMIN_EMAIL=admin@lawfull.com
ADMIN_PASSWORD=your_secure_admin_password
```

### Database Changes

New collection added:
- `auditlogs` - Tracks all admin actions with timestamps

## API Endpoints

### Admin Endpoints (`/api/admin/`)

#### Authentication
- `POST /login` - Admin login

#### Instructor Management
- `POST /add-instructor` - Create new instructor (requires image upload)
- `GET /all-instructors` - List all instructors
- `POST /change-instructor-availability` - Toggle instructor availability
- `DELETE /delete-instructor/:id` - Delete instructor account

#### Monitoring
- `GET /dashboard` - Admin dashboard data
- `GET /audit-logs` - System audit trail
- `GET /all-consultations` - All consultations across system

### Instructor Endpoints (`/api/instructor/`)

#### Authentication  
- `POST /login` - Instructor login (admin panel only)

#### Dashboard
- `GET /profile` - Get instructor profile
- `POST /update-profile` - Update limited profile fields
- `GET /dashboard` - Dashboard statistics
- `GET /consultations` - Personal consultations
- `POST /complete-consultation` - Mark consultation complete
- `POST /cancel-consultation` - Cancel consultation

## Frontend Components

### Admin Panel Components

#### Admin Views
- `AddInstructor.jsx` - Create new instructor form
- `InstructorsList.jsx` - Manage existing instructors  
- `AuditLogs.jsx` - View system audit trail

#### Instructor Views (Limited Access)
- `InstructorDashboard.jsx` - Personal dashboard
- `InstructorConsultations.jsx` - Manage consultations
- `InstructorProfile.jsx` - Edit limited profile info

## Security Features

### Role-Based Authentication
- JWT tokens with role-specific claims
- Middleware-enforced access control
- Admin-only and instructor-only routes

### Audit Trail
All admin actions are logged with:
- Admin user details
- Action type and timestamp
- Target resource information
- IP address and user agent
- Detailed action description

### Data Validation
- Input sanitization on all forms
- Server-side validation with express-validator
- File upload security with multer
- SQL injection protection via Mongoose ODM

## Usage Instructions

### For Admins

1. **Login to Admin Panel**:
   - Navigate to `/admin`
   - Use admin credentials from environment variables

2. **Add New Instructor**:
   - Go to "Add Instructor" section
   - Fill complete instructor profile
   - Upload instructor photo
   - System creates account and emails credentials

3. **Manage Instructors**:
   - View all instructors in "Instructors List"
   - Toggle availability status
   - Delete accounts (if no pending consultations)
   - Monitor instructor activities

4. **Monitor System**:
   - Review dashboard for system metrics
   - Check audit logs for security monitoring
   - View all consultations across instructors

### For Instructors

1. **Access Dashboard**:
   - Navigate to `/admin` 
   - Login with admin-provided credentials
   - Dashboard shows limited instructor view

2. **Manage Profile**:
   - Update consultation fees
   - Edit about section
   - Set availability status
   - Update contact information

3. **Handle Consultations**:
   - View upcoming consultations
   - Mark consultations as complete
   - Cancel if necessary
   - View student information

## Error Handling

### Frontend Error Handling
- Toast notifications for user feedback
- Form validation with error messages
- Loading states for async operations
- Graceful fallbacks for failed requests

### Backend Error Handling
- Comprehensive try-catch blocks
- Detailed error logging
- Consistent error response format
- Audit logging for failed operations

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing  
```bash
# Student Interface
cd frontend
npm test

# Admin Panel
cd admin
npm test
```

## Deployment Considerations

### Environment Variables
Ensure all required environment variables are set in production:
- Database connection strings
- JWT secrets
- Admin credentials
- Cloudinary configuration

### File Upload Security
- Configure proper file size limits
- Implement virus scanning for uploads
- Use secure file storage (Cloudinary)

### Database Security
- Enable MongoDB authentication
- Use connection encryption (SSL/TLS)
- Regular security updates
- Backup and recovery procedures

## Migration from Old System

### Data Migration
- Existing instructor accounts remain functional
- Update instructor login flow to use admin panel
- Migrate existing consultation data
- Preserve user relationships

### User Communication
- Notify instructors of new login process
- Provide admin panel access instructions
- Update user documentation
- Train admin users on new features

## Support & Maintenance

### Monitoring
- Review audit logs regularly
- Monitor system performance
- Track user adoption metrics
- Security incident response

### Updates
- Regular security patches
- Feature enhancement requests
- User feedback integration
- System optimization

---

## Quick Start

1. **Backend Setup**:
```bash
cd backend
npm install
# Set environment variables
npm start
```

2. **Admin Panel Setup**:
```bash
cd admin
npm install
npm run dev
```

3. **Student Interface**:
```bash
cd frontend
npm install  
npm run dev
```

4. **First Admin Login**:
- Go to http://localhost:5173 (admin panel)
- Login with ADMIN_EMAIL and ADMIN_PASSWORD
- Start creating instructor accounts

The system is now ready for production use with proper security controls and comprehensive audit capabilities.
