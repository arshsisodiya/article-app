# Role-Based Access Control (RBAC) System

A modern, full-stack web application demonstrating secure authentication and Role-Based Access Control (RBAC). Built with Node.js, Express, MongoDB, and React.

## 🚀 Project Overview

This system provides a secure platform where users can signup, login, and manage articles based on their assigned roles (**Admin**, **Editor**, **Viewer**). It features a dark glassmorphic UI, persistent cloud storage via MongoDB Atlas, and is fully mobile-responsive.

---

## 🛠️ Project Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A MongoDB Atlas account (free tier)

### 1. Clone & Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_secret
PORT=5000
```

### 3. Seed the Database
Populate your MongoDB with the default roles and demo users:
```bash
cd backend
npm run seed
```
## Hosting on Vercel

Since this project follows a monorepo structure (backend and frontend in separate folders), the best way to host on Vercel is to create two separate projects that point to the same repository but use different **Root Directories**.

### 1. Deploy the Backend

- Log in to your Vercel Dashboard and click **Add New > Project**.
- Import this repository.
- Give it a clear name (e.g., `rbac-backend`).
- Set the **Root Directory** to `backend`.
- **Environment Variables**: Add the following:
  - `MONGODB_URI`: Your MongoDB connection string.
  - `JWT_SECRET`: A secure random string for signing JWTs.
  - `NODE_ENV`: Set to `production`.
- Click **Deploy**.
- **Copy the deployment URL** (e.g., `https://rbac-backend.vercel.app`).

### 2. Deploy the Frontend

- Import the repository again as a new Vercel project.
- Give it a name (e.g., `rbac-frontend`).
- Set the **Root Directory** to `frontend`.
- Vercel should automatically detect the **Framework Preset** as **Vite**.
- **Environment Variables**: Add:
  - `VITE_API_BASE_URL`: **Paste the Backend URL** you copied in the previous step.
- Click **Deploy**.

### Manual Verification

Once both are deployed, navigate to your frontend URL. Test the registration and login functionality to ensure there is a clear communication channel between the React app and the serverless backend.

### 4. Run Locally
You can run both from the root directory:
```bash
# In the root folder
npm run dev:backend   # API starts at http://localhost:5000
npm run dev:frontend  # React starts at http://localhost:5173
```

---

## 🏗️ Architecture Overview

The project follows a **Client-Server Architecture** with a clear separation of concerns:

- **Frontend (React)**: Component-based UI using `React Context` for global state (Auth) and `React Router` for navigation.
- **Backend (Node/Express)**: Modular API with specialized middleware for security and validation.
- **Database (MongoDB)**: Document-based cloud storage using **Mongoose** for schema modeling.
- **Security**: JWT-based stateless authentication and **bcryptjs** for industry-standard password hashing.

---

## 🔐 Authentication & RBAC Logic

### How Authentication Works
1. **Login**: User submits credentials to `POST /login`.
2. **JWT Generation**: Backend validates the user (via `bcrypt.compare`) and signs a JSON Web Token containing the user's `id`, `name`, and `role`.
3. **Storage**: The frontend stores this JWT in `localStorage`.
4. **Verification**: Every subsequent API request includes the token in the `Authorization: Bearer <token>` header. The `authenticate.js` middleware verifies this token before allowing the request to proceed.

### How Role-Based Permissions are Implemented
- **Backend Enforcement**: A custom `authorize(allowedRoles)` middleware factory checks the user's role from the decoded JWT. If the role isn't in the allowed list, it immediately returns a `403 Forbidden` response.
- **Frontend Enforcement**: The `useAuth` hook provides boolean flags (`isAdmin`, `canCreate`, `canDelete`). We use these to conditionally hide or disable UI elements (like the "Delete" button or "User Management" link) for users without permission.

---

## 🧪 How to Test Each Role

The easiest way to test is to use the **Quick Login** buttons on the login page:

| Role | Permissions | Testing Instructions |
|------|-------------|----------------------|
| **Admin** | Create, View, Delete, Manage Users | Log in as `admin@test.com`. You will see "User Management" in the sidebar and delete buttons on all articles. |
| **Editor** | Create, View | Log in as `editor@test.com`. You can create articles and view them, but the "Delete" buttons and "User Management" link will be hidden. |
| **Viewer** | View Only | Log in as `viewer@test.com`. You can only read articles. All "New Article" and "Delete" buttons are hidden. |

---

## 🛠️ API Flow Explanation

1. **User Signup**: `POST /signup` -> Validates name/email/password -> Hashes password -> Saves to MongoDB.
2. **Article Dashboard**: `GET /articles` -> `authenticate` middleware -> Fetch from MongoDB -> Return formatted JSON.
3. **Article Creation**: `POST /articles` -> `authenticate` -> `authorize(['admin', 'editor'])` -> `Article.create()`.
4. **User Management**: `GET /users` -> `authenticate` -> `authorize(['admin'])` -> Returns all user profiles (excluding passwords).

---

## 📝 Key Assumptions

- **Statelessness**: We assume a stateless JWT approach is sufficient for this assignment (no session revocation).
- **In-App Navigation**: We assume users should be redirected to the Dashboard if they try to access a page they don't have permission for (instead of showing a blank screen).
- **Default Role**: Any new user signing up via the `/signup` page is automatically assigned the `viewer` role for security reasons.
