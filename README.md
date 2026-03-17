# Role Based Access System

A full-stack assignment project implementing JWT authentication and role based access control for article management.

## Tech Stack

- Backend: Node.js, Express
- Frontend: React (Vite)
- Auth: JWT
- Data: In-memory arrays (users and articles)

## Project Structure

- backend: Express API (login, articles, RBAC middleware)
- frontend: React client (login screen + role-aware dashboard)

## Setup Instructions

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

3. Start backend server:

```bash
cd ../backend
npm run dev
```

4. Start frontend app in another terminal:

```bash
cd ../frontend
npm run dev
```

5. Open the frontend URL shown by Vite (default: http://localhost:5173).

## Demo Credentials

All users use the password `password`.

- Admin: admin@test.com
- Editor: editor@test.com
- Viewer: viewer@test.com

## Architecture Overview

### Backend

- `POST /login`: validates credentials from in-memory users and returns JWT.
- `GET /articles`: accessible by admin, editor, viewer.
- `POST /articles`: accessible by admin, editor.
- `DELETE /articles/:id`: accessible by admin only.

Core backend modules:

- `authenticate` middleware:
  - reads `Authorization: Bearer <token>`
  - validates JWT
  - attaches decoded user payload to request
- `authorize` middleware:
  - checks if the authenticated user role is in the route's allowed role list
  - returns `403 Forbidden` when role is not allowed

### Frontend

- Login page sends credentials to `/login`.
- JWT token is stored in localStorage.
- Dashboard loads `/articles` with Bearer token.
- UI actions are hidden by role:
  - Admin: create + delete
  - Editor: create only
  - Viewer: view only

## API Flow Explanation

1. User submits login form.
2. API returns a JWT if credentials are valid.
3. Frontend stores token and requests articles with Bearer token.
4. Backend authenticates token, extracts role, then applies authorization rules per route.
5. Response is returned or denied with proper status codes.

## Walkthrough Guide

### How Authentication Works

- Users log in through `POST /login`.
- API signs a JWT containing user id, name, email, and role.
- Protected routes require `Authorization: Bearer <token>`.

### How Role Permissions Are Implemented

- Each protected route includes role constraints via `authorize([...roles])`.
- Unauthorized role access always returns `403 Forbidden`.

### How To Test Each Role

1. Login as `admin@test.com`:
   - confirm article list loads
   - create article succeeds
   - delete article button is visible and works
2. Login as `editor@test.com`:
   - confirm article list loads
   - create article succeeds
   - delete button is hidden
3. Login as `viewer@test.com`:
   - confirm article list loads
   - create form is hidden
   - delete button is hidden

## Assumptions

- Passwords are plain text because this is an assignment prototype.
- Data persistence is in-memory only; restarting backend resets articles.
- CORS is open for local frontend/backend communication.

## Hosted Application

This environment does not have direct deployment integration.
To complete submission requirements, deploy:

- backend (for example Render, Railway, Fly.io)
- frontend (for example Vercel, Netlify)

Then add the live URLs here before final submission.

## Useful Commands

From project root:

- `npm run dev:backend`
- `npm run dev:frontend`
- `npm run start:backend`
- `npm run build:frontend`
