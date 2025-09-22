# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

LawEdu is a full-stack educational platform for legal studies, specifically focused on LSAT and LNAT preparation. The platform includes course management, instructor consultations, payment processing, and administrative tools.

## Architecture

This is a **three-tier MERN stack application** with separate client applications:

### Backend (Node.js/Express)
- **Location**: `backend/`
- **Stack**: Express.js + MongoDB + JWT authentication
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Cloudinary for image uploads
- **Payment Gateways**: Stripe and Razorpay integration
- **Email**: Nodemailer for notifications

### Frontend (React SPA)
- **Location**: `frontend/`
- **Stack**: React 18 + Vite + TailwindCSS
- **Routing**: React Router DOM
- **State Management**: React Context API (`AppContext`)
- **UI**: TailwindCSS with responsive design
- **API Communication**: Axios with interceptors for auth

### Admin Panel (React SPA)
- **Location**: `admin/`
- **Stack**: React 18 + Vite + TailwindCSS  
- **Purpose**: Administrative dashboard for managing courses, instructors, appointments
- **Context**: Separate `AdminContext` and `DoctorContext` for role-based access

## Development Commands

### Initial Setup (First Time)
```bash
# Backend setup
cd backend
npm install
# Configure .env file with MongoDB, Cloudinary, payment credentials
npm run dev  # or npm run server

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173

# Admin panel setup (new terminal)
cd admin
npm install
npm run dev  # Runs on http://localhost:5174
```

### Daily Development
```bash
# Start all services (run in separate terminals):
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Admin (if needed)
cd admin && npm run dev
```

### Testing & Quality
```bash
# Lint frontend
cd frontend && npm run lint

# Lint admin
cd admin && npm run lint

# Build for production
cd frontend && npm run build
cd admin && npm run build
```

## Key Architecture Patterns

### API Structure
The backend follows a **modular REST API** pattern:
- **Routes** (`routes/`) → **Controllers** (`controllers/`) → **Models** (`models/`)
- **Middleware**: Authentication (`middleware/auth.js`), role-based access (`middleware/role.js`), validation (`middleware/validate.js`)
- **API Endpoints**: All routes prefixed with `/api/` (auth, courses, instructors, appointments, payments, admin)

### Database Models
Core entities with relationships:
- **User**: Base user with role (user/instructor/admin)
- **Instructor**: Extended profile for instructors, references User
- **Course**: LSAT/LNAT courses with curriculum and instructor relationship
- **Appointment**: Consultation bookings between users and instructors
- **Payment**: Transaction records for course enrollments and consultations

### Frontend State Management
- **Global State**: `AppContext` provides user authentication, instructors data, loading states
- **Authentication Flow**: JWT tokens with automatic expiry handling and axios interceptors
- **Protected Routes**: Role-based routing with authentication checks

### Role-Based Access Control
Three user roles with different capabilities:
- **User**: Course enrollment, instructor consultations, profile management
- **Instructor**: Manage appointments, view student consultations, update availability
- **Admin**: Full platform management, user/instructor administration, analytics dashboard

## Environment Configuration

### Backend `.env` Requirements
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lawedu
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_... # Optional
RAZORPAY_KEY_ID=rzp_test_... # Optional
RAZORPAY_KEY_SECRET=... # Optional
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Frontend `.env` Requirements
```bash
VITE_BACKEND_URL=http://localhost:5000
```

### Admin `.env` Requirements
```bash
VITE_BACKEND_URL=http://localhost:5000
```

## Development Workflow

### Adding New Features
1. **API Development**: Create route → controller → update model if needed
2. **Frontend Integration**: Add to context if global state needed → create/update pages/components
3. **Admin Integration**: Add admin routes/pages if administrative access required

### Authentication Flow
- JWT tokens stored in localStorage
- Automatic token expiry detection and refresh
- Global axios interceptors handle 401 responses
- Context provides `logout()`, `isTokenExpired()` utilities

### File Upload Workflow
- Images uploaded to Cloudinary via multer middleware
- User profile images, course thumbnails, instructor photos supported
- File size limits configured (10mb for JSON/images)

### Payment Integration
- Dual payment gateway support (Stripe + Razorpay)
- Payment controller handles webhook validation
- Transaction records stored in Payment model

## Common Development Tasks

### Adding a New API Endpoint
1. Create route handler in appropriate routes file (`routes/`)
2. Implement controller logic (`controllers/`)
3. Add validation middleware if needed
4. Update frontend service calls in components/context
5. Test authentication/authorization as needed

### Database Schema Changes
1. Update Mongoose model in `models/`
2. Consider migration needs for existing data
3. Update controller logic to handle new fields
4. Update frontend interfaces and form handling

### Adding New Pages
1. Create component in `pages/` directory
2. Add route to `App.jsx`
3. Update navigation/menu components if needed
4. Add context integration for data fetching
5. Implement responsive design with TailwindCSS

## Deployment Notes

### Frontend/Admin Deployment (Vercel)
- Both frontend and admin have `vercel.json` configured for SPA routing
- Environment variables must be set in Vercel dashboard
- Build commands: `npm run build`

### Backend Deployment
- Express server configured with CORS for multiple origins
- Production MongoDB connection required
- Environment variables for all third-party services
- Cloudinary for production file storage

## File Structure Conventions

### Backend Organization
```
backend/
├── config/          # Database and service configurations
├── controllers/     # Request handlers and business logic
├── middleware/      # Authentication, validation, role checking
├── models/          # Mongoose schemas and models
├── routes/          # API route definitions
├── utils/           # Payment gateway and email utilities
└── server.js        # Application entry point
```

### Frontend Organization
```
frontend/src/
├── components/      # Reusable UI components
├── pages/          # Route-specific page components
├── context/        # Global state management
├── assets/         # Static images and icons
└── App.jsx         # Main application and routing
```

### Admin Organization
```
admin/src/
├── components/     # Admin-specific UI components (Navbar, Sidebar)
├── pages/          # Admin dashboard pages
├── context/        # Admin and doctor context providers
└── App.jsx         # Admin application routing
```

This platform is built for scalability with clear separation of concerns, comprehensive authentication, and multi-role user management.
