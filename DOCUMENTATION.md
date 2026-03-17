# 📋 Detailed App Documentation

This document provides a deep dive into the architecture, data flow, and file-by-file implementation of the Role-Based Access Control (RBAC) System.

---

## 📁 Project File Structure

### 🌐 Backend (`/backend`)
The backend is a Node.js Express application following a modular architecture.

- **`api/index.js`**: Vercel Serverless Entry Point. Connects to MongoDB and exports the Express app to be handled as a serverless function.
- **`src/`**
  - **`config/db.js`**: MongoDB Connection Manager. Implements a connection caching pattern specifically for serverless environments to prevent multiple connections from exhausting database resources.
  - **`middleware/`**
    - **`authenticate.js`**: JWT Authenticator. Verifies the `Authorization: Bearer <token>` header, decodes the payload, and attaches `req.user` to the request object.
    - **`authorize.js`**: Role-Based Authorization. A higher-order function that takes a list of `allowedRoles` and checks if the authenticated user's role matches. Returns `403 Forbidden` if denied.
  - **`models/`**
    - **`User.js`**: User Schema. Defines name, email (unique), password (hashed), and role (`admin`, `editor`, `viewer`). Includes a **Mongoose pre-save hook** to automatically hash passwords using **bcryptjs**.
    - **`Article.js`**: Article Schema. Defines title, content, and the name of the creator (`createdBy`).
  - **`routes/`**
    - **`authRoutes.js`**: Authentication Endpoints. Handles user signup (defaulting to `viewer` role) and user login (generating the JWT).
    - **`articleRoutes.js`**: Articles API. Implements CRUD logic with role-based checks. 
    - **`userRoutes.js`**: User Management API. Admin-only routes for listing, deleting, or updating user roles.
  - **`scripts/seed.js`**: Database Seeder. A utility script to quickly populate MongoDB with standard demo account data.
  - **`utils/validation.js`**: Validation Helpers. Contains regex and rules for email format and password strength checks.
  - **`server.js`**: Main Express Application. Sets up middleware (CORS, JSON parsing), mounts routes, and sets up health checks.
- **`vercel.json`**: Deployment configuration to map all incoming requests to the serverless function handler.

### 🍱 Frontend (`/frontend`)
The frontend is a modern React application built with Vite.

- **`src/`**
  - **`context/AuthContext.jsx`**: Global State Management. Handles login/logout logic, persists JWT to `localStorage`, and provides permission flags (`isAdmin`, `canCreate`) to the entire app.
  - **`components/`**
    - **`DashboardLayout.jsx`**: Main UI Shell. Provides the sidebar, hamburger menu, and navbar with responsive logic.
    - **`ProtectedRoute.jsx`**: Client-side Guard. Wraps routes to prevent non-authenticated users from entering, and redirects users to the dashboard if their role doesn't match the route's requirements.
  - **`pages/`**
    - **`LoginPage.jsx` / `SignupPage.jsx`**: Authentication UI with glassmorphic styling and demo-login shortcuts.
    - **`ArticlesPage.jsx`**: Responsive article grid and search. Includes the **Article Modal** for detailed full-screen viewing.
    - **`CreateArticlePage.jsx`**: Protected form for drafting and saving new articles to the cloud.
    - **`UsersPage.jsx`**: Admin dashboard for managing user accounts and promoting roles.
  - **`App.jsx`**: Main routing configuration using `react-router-dom`.
- **`vercel.json`**: SPA routing config to ensure `index.html` handles all client-side paths.

---

## 🔄 Data Architecture & Flow

### ✍️ How Articles are Written (Data Flow)
1. **Frontend Initiation**: An Admin or Editor fills out the "Create Article" form.
2. **API Request**: On submit, the app sends a `POST` request to `/articles` with the title and content. The browser automatically includes the **JWT token** in the headers.
3. **Backend Middleware Chain**:
    - `authenticate`: Checks if the token is valid.
    - `authorize(['admin', 'editor'])`: Specifically checks if the user has permission to write.
4. **Database Operation**: If authorized, `Article.create()` saves the data to MongoDB.
5. **UI Update**: Success response is returned, and the user is redirected back to the articles list.

### 💾 How Data is Stored in MongoDB
We use **Mongoose** to enforce a schema on MongoDB's flexible document structure.

- **Users Collection**: Stores permanent user documents.
    - *Example*: `{ name: "Admin", email: "admin@test.com", password: "$2b$10$hashed...", role: "admin" }`
- **Articles Collection**: Stores all generated content.
    - *Example*: `{ title: "My First Article", content: "...", createdBy: "Admin" }`

---

## 📡 API Endpoint Details

### Authentication APIs
| Method | Endpoint | Description | Payload |
|:--- |:--- |:--- |:--- |
| `POST` | `/signup` | Creates a new user | `{ name, email, password }` |
| `POST` | `/login` | Authenticates & returns JWT | `{ email, password }` |

### Article APIs
| Method | Endpoint | Description | Access Level |
|:--- |:--- |:--- |:--- |
| `GET` | `/articles` | Get list of all articles | All Auth Users |
| `POST` | `/articles` | Create a new article | Admin / Editor |
| `DELETE` | `/articles/:id` | Remove an article | Admin Only |

### User Management APIs (Admin Only)
| Method | Endpoint | Description | Payload |
|:--- |:--- |:--- |:--- |
| `GET` | `/users` | List all system users | None |
| `DELETE` | `/users/:id` | Delete a specific user | None |
| `PUT` | `/users/:id/role`| Update user permission | `{ role: 'admin \| editor \| viewer' }` |

---

## 🔒 Security Summary
1. **Passwords**: Never stored as plain text. Every password on signup or seed is transformed via **bcrypt salted hashing**.
2. **Stateless Auth**: Every server interaction is validated via JWT signatures to ensure data integrity without server-side sessions.
3. **RBAC**: Multi-layered permission checks on both the API layer (backend) and the UI layer (frontend).
