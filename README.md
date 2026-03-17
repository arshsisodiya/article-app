# Role-Based Access Control (RBAC) System

A modern, full-stack web application demonstrating secure authentication and Role-Based Access Control (RBAC). Built with Node.js, Express, MongoDB, and React.

---

## 🔐 How Authentication Works

1. **Secure Storage**: Passwords are never stored in plain text. They are hashed with a salt using `bcryptjs` during signup.
2. **Identification**: On login, the server validates credentials and issues a signed **JWT**.
3. **Stateless Sessions**: The JWT contains safe user metadata (ID, email, role). The frontend stores this in `localStorage`.
4. **Request Verification**: The `authenticate` middleware on the backend intercepts incoming requests, verifies the JWT signature, and populates `req.user` for subsequent logic.

---

## 🛡️ How Role-Based Permissions are Implemented

The system uses a **multi-layered approach** to ensure security:

- **Backend (Hard Enforcement)**: 
    - A higher-order function `authorize(allowedRoles)` acts as a gatekeeper. 
    - It is applied to specific routes (e.g., `router.delete('/articles/:id', authorize(['admin']), ...)`.
    - If a user's role doesn't match, they receive a `403 Forbidden` response.
- **Frontend (UI/UX Layer)**: 
    - The `AuthContext` provides permission flags like `canCreate` or `canDelete`.
    - We use these to conditionally render buttons, links, and navigation items.
    - `ProtectedRoute` components wrap sensitive pages to prevent unauthorized access.

---

## 🧪 How to Test Each Role

Use the following test accounts (already seeded) to verify role-based behavior:

| Role | Permissions | Testing Instructions |
|------|-------------|----------------------|
| **Admin** | Full Access | Login as `admin@test.com` (password: `password`). You can manage users, change roles, and delete any article. |
| **Editor** | Write & Read | Login as `editor@test.com` (password: `password`). You can create/edit articles, but cannot delete them or access User Management. |
| **Viewer** | Read Only | Login as `viewer@test.com` (password: `password`). You can read articles, but all management actions are hidden. |

---

## 🚀 Project Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas connection string

### 1. Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configuration
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_random_key
NODE_ENV=development
```

### 3. Database Initialization
Populate the database with demo accounts:
```bash
cd backend
npm run seed
```

### 4. Running Locally
Run both servers from the root directory:
```bash
npm run dev:backend   # Starts API at http://localhost:5000
npm run dev:frontend  # Starts React at http://localhost:5173
```

---

## 🏗️ Architecture Overview

The project follows a **Client-Server Architecture** with a clear separation of concerns:

- **Frontend (React/Vite)**: A Single Page Application (SPA) using `React Context` for Auth state and `React Router` for navigation guards.
- **Backend (Node/Express)**: A RESTful API designed for serverless environments. It uses modular routing and middleware-based security.
- **Database (MongoDB Atlas)**: Cloud-hosted NoSQL database using **Mongoose** for data modeling.
- **Security Layer**: Stateless JWT authentication, adaptive hashing with `bcryptjs`, and custom authorization middleware.

---

## 📡 API Flow Explanation

Lifecycle of a typical protected request (e.g., Creating an Article):

1. **Frontend**: User submits a form. The API wrapper attaches the JWT to the `Authorization` header.
2. **Backend (Middleware 1)**: `authenticate` validates the JWT and extracts the user's identity.
3. **Backend (Middleware 2)**: `authorize(['admin', 'editor'])` checks for sufficient permissions.
4. **Backend (Controller)**: The request reaches the route handler, which performs the database operation.
5. **Database**: Mongoose saves the document, ensuring data integrity.

---

## 🛰️ Walkthrough & Assumptions

### Walkthrough
1. **Explore as Viewer**: Log in with the Viewer account. Notice how the "User Management" sidebar and "New Article" buttons are hidden.
2. **Promote a User**: Log in as Admin. Go to the "Users" page. Find a User and change their role to "Editor".
3. **Create Content**: Log in with that updated user. Create an article and see it appear in the global feed.
4. **Delete Content**: Log in as Admin and delete the test article to see Admin-only privileges in effect.

### Assumptions Made
- **Token Expiry**: JWTs are set to expire in 8 hours to balance security and UX.
- **Default Role**: New self-registered users are assigned the `viewer` role by default.
- **Statelessness**: No session data is stored on the server; all identity info is contained within the JWT.
- **Role Hierarchy**: While Admin has more permissions than Editor, permissions are defined by explicit lists of allowed roles for each action.

---

## 🌐 Deployment (Vercel)

### 1. Backend
- Set **Root Directory** to `backend`.
- Configure Env: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.

### 2. Frontend
- Set **Root Directory** to `frontend`.
- Configure Env: `VITE_API_BASE_URL` (Deploved backend URL).
