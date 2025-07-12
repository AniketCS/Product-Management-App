# Product Management App

A full-stack product management application with React frontend and Node.js/Express backend.


- **Frontend**: https://product-management-frontend-aniket.netlify.app/
- **Backend**: https://product-management-backend-29kc.onrender.com/
- **API Documentation**: https://product-management-backend-29kc.onrender.com/api-docs

## Setup Instructions

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://product-management-backend-29kc.onrender.com
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://product-management-backend-29kc.onrender.com
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-management-app
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## API Documentation

Visit the Swagger documentation at: https://product-management-backend-29kc.onrender.com/api-docs

## Authentication

The app includes user authentication with JWT tokens:
- Register new users
- Login with email/password
- Protected routes for product management
- Automatic token refresh

## Features

- User Authentication (Register/Login)
- Product CRUD Operations
- Pagination, Sorting, and Filtering
- Responsive Bootstrap UI
- Redux State Management
- Form Validation with Formik & Yup
- Toast Notifications
- API Documentation with Swagger
- CORS Configuration
- Environment-based Configuration

## Tech Stack

### Frontend
- React 19
- Redux (with Thunk)
- React Router DOM
- React Bootstrap
- Formik & Yup
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator
- CORS middleware
- Swagger UI for API docs

## Deployment

### Frontend (Netlify)
- Connected to GitHub repository
- Automatic deployments on push
- Environment variables configured

### Backend (Render)
- Connected to GitHub repository
- Automatic deployments on push
- Environment variables configured
- MongoDB Atlas connection

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Protected routes
- Environment variable protection

## License

MIT License
