# Role-Based Access Control (RBAC) System

A modern, full-stack web application demonstrating secure authentication and Role-Based Access Control (RBAC). Built with Node.js, Express, MongoDB, and React.

## 🚀 Project Overview

This system provides a secure platform where users can signup, login, and manage articles based on their assigned roles (**Admin**, **Editor**, **Viewer**). It features a dark glassmorphic UI, persistent cloud storage via MongoDB Atlas, and is fully mobile-responsive.

---

## 🏗️ Architecture Overview

The project follows a **Client-Server Architecture** with a clear separation of concerns:

- **Frontend (React/Vite)**: A Single Page Application (SPA) using `React Context` for centralized Auth state and `React Router` for navigation guards.
- **Backend (Node/Express)**: A RESTful API designed for serverless environments (Vercel). It uses modular routing and middleware-based security.
- **Database (MongoDB Atlas)**: Cloud-hosted NoSQL database using **Mongoose** for data modeling and relationship management.
- **Security Layer**: 
    - **Authentication**: Stateless JWT (JSON Web Tokens).
    - **Password Security**: Adaptive hashing using `bcryptjs`.
    - **Authorization**: Custom middleware layer enforcing access control before requests reach the controller.

---

## 🛠️ Project Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A MongoDB Atlas connection string

### 1. Installation
```bash
# Install root dependencies (concurrently scripts)
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
Populate the database with demo accounts and initial roles:
```bash
cd backend
npm run seed
```

### 4. Running Locally
You can run both servers simultaneously from the root directory:
```bash
npm run dev:backend   # Starts API at http://localhost:5000
npm run dev:frontend  # Starts React at http://localhost:5173
```

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
    - `ProtectedRoute` components wrap sensitive pages to redirect unauthorized users back to the dashboard.

---

## 📡 API Flow Explanation

Here is the lifecycle of a typical protected request (e.g., Creating an Article):

1. **Frontend**: User submits the form. The `api()` wrapper in `AuthContext` automatically attaches the JWT to the `Authorization` header.
2. **Backend (Middleware 1)**: `authenticate` validates the JWT and extracts the user's role.
3. **Backend (Middleware 2)**: `authorize(['admin', 'editor'])` checks if the role has "write" permissions.
4. **Backend (Controller)**: The request reaches the route handler, which saves the article to MongoDB.
5. **Database**: Mongoose saves the document with the `createdBy` field populated from `req.user.name`.

---

## 🧪 How to Test Each Role

Use the following test accounts to verify role-based behavior:

| Role | Permissions | Testing Instructions |
|------|-------------|----------------------|
| **Admin** | Full Access | Login as `admin@test.com`. You can manage users, change roles, and delete any article. |
| **Editor** | Write & Read | Login as `editor@test.com`. You can create new articles, but you cannot delete them or see the User Management page. |
| **Viewer** | Read Only | Login as `viewer@test.com`. You can only read articles. All "New", "Edit", and "Delete" actions are hidden. |

---

## 🚀 Walkthrough Guide & Assumptions

### Walkthrough
1. **Explore as Viewer**: Log in with the Viewer account. Notice how the "User Management" sidebar and "New Article" buttons are invisible.
2. **Promote a User**: Log in as Admin. Go to the "Users" page. Find a User and change their role to "Editor".
3. **Create Content**: Log in with that updated user (or the default Editor). Create an article and see it appear in the global feed.
4. **Delete Content**: Log in as Admin and delete the test article to see the restricted action in effect.

### Assumptions Made
- **Token Expiry**: JWTs are set to expire in 8 hours to balance security and convenience.
- **Role Hierarchy**: Roles are treated as discrete sets of permissions rather than a strict linear hierarchy (though Admin encompasses all).
- **Default Role**: Any new self-registered user is assigned the `viewer` role by default to prevent privilege escalation.
- **Frontend Security**: While UI elements are hidden, we assume the user understands that **true security is enforced on the backend** via middleware.

---

## 🌐 Hosting on Vercel

### 1. Deploy the Backend
- Set **Root Directory** to `backend`.
- Add Env: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.
- **Note**: The backend contains a `vercel.json` to handle serverless routing and a public `/` route for status checks.

### 2. Deploy the Frontend
- Set **Root Directory** to `frontend`.
- Add Env: `VITE_API_BASE_URL` (Pointing to your deployed backend URL **without** a trailing slash).
- Vite will automatically build the SPA; `vercel.json` ensures all routes redirect to `index.html`.
