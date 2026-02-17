# Pet Adoption Management System

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/rjv450/pet-adoption-system)

A full-stack web application for managing pet adoptions. Built with the MERN stack (MongoDB, Express, React, Node.js) and Next.js for the frontend.

**Repository**: [https://github.com/rjv450/pet-adoption-system](https://github.com/rjv450/pet-adoption-system)

## Overview

This system allows users to browse pets available for adoption, apply to adopt pets, and enables administrators to manage pets and adoption requests efficiently.

## Features

### Visitor
- ✅ View list of available pets
- ✅ Search pets by name or breed
- ✅ Filter pets by species, breed, and age
- ✅ View pet details
- ✅ Pagination on pet list

### User
- ✅ Register/Login with JWT authentication
- ✅ Apply to adopt available pets
- ✅ View own adoption applications and statuses
- ✅ Receive notifications for application status changes

### Admin
- ✅ Add/Edit/Delete pets
- ✅ Upload pet photos
- ✅ View all adoption applications
- ✅ Approve or reject applications
- ✅ Update pet status automatically or manually

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Swagger** - API documentation

## Project Structure

```
pet-adoption-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── swagger.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── petController.js
│   │   │   ├── applicationController.js
│   │   │   └── notificationController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Pet.js
│   │   │   ├── Application.js
│   │   │   └── Notification.js
│   │   ├── utils/
│   │   │   └── seed.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── petRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   └── notificationRoutes.js
│   │   └── app.js
│   ├── uploads/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   └── lib/
│   └── package.json
├── docs/
│   └── Pet_Adoption_API.postman_collection.json
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/pet-adoption
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880
   ```

5. Create the uploads directory (if it doesn't exist):
   ```bash
   mkdir uploads
   ```

6. (Optional) Seed the database with admin user and sample pets:
   ```bash
   npm run seed
   ```
   
   This creates:
   - Admin user: `admin@petadopt.com` / `admin123`
   - 10 sample pets for testing

7. Start the development server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

7. Access Swagger API documentation:
   ```
   http://localhost:5000/api-docs
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file (if needed):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## API Documentation

### Swagger Documentation
When the backend server is running, visit:
```
http://localhost:5000/api-docs
```

### Postman Collection
Import the Postman collection from `docs/Pet_Adoption_API.postman_collection.json` to test all API endpoints.

See `docs/README.md` for detailed API documentation.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Pets
- `GET /api/pets` - Get all pets (with filters and pagination)
  - Query params: `species`, `breed`, `age`, `search`, `page`, `limit`
- `GET /api/pets/:id` - Get single pet
- `POST /api/pets` - Create pet (Admin only, multipart/form-data)
- `PUT /api/pets/:id` - Update pet (Admin only, multipart/form-data)
- `DELETE /api/pets/:id` - Delete pet (Admin only)

### Applications
- `POST /api/applications` - Apply for adoption (User)
- `GET /api/applications` - Get applications (User: own, Admin: all)
- `PUT /api/applications/:id` - Update application status (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## User Roles

- **Visitor**: Can browse pets without authentication
- **User**: Can apply for adoption, view own applications
- **Admin**: Full access to manage pets and applications

## Database Models

### User
- name, email, password, role (user/admin)

### Pet
- name, species, breed, age, description, status (available/pending/adopted), image

### Application
- user, pet, message, status (pending/approved/rejected)

### Notification
- user, application, message, type, read status

## Bonus Features Implemented

✅ **Pet Photo Upload** - Admins can upload pet images using multipart/form-data
✅ **Notifications System** - Users receive notifications when application status changes
✅ **Swagger API Documentation** - Interactive API docs at `/api-docs`
✅ **Postman Collection** - Complete API collection for testing

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `UPLOAD_PATH` - Path for uploaded files
- `MAX_FILE_SIZE` - Maximum file size in bytes

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Update `MONGO_URI` to production database
3. Set a strong `JWT_SECRET`
4. Configure file upload storage (consider cloud storage for production)

### Frontend Deployment
1. Set `NEXT_PUBLIC_API_URL` to production API URL
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred hosting

## Getting Started with Git

### Initial Setup

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "first commit"

# Rename branch to master
git branch -M master

# Add remote repository
git remote add origin git@github.com:rjv450/pet-adoption-system.git

# Push to remote
git push -u origin master
```

### Clone the Repository

```bash
git clone https://github.com/rjv450/pet-adoption-system.git
cd pet-adoption-system
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/rjv450/pet-adoption-system/issues).

## Repository

- **GitHub**: [https://github.com/rjv450/pet-adoption-system](https://github.com/rjv450/pet-adoption-system)
- **Issues**: [Report a bug or request a feature](https://github.com/rjv450/pet-adoption-system/issues)
#   p e t - a d o p t i o n - s y s t e m  
 