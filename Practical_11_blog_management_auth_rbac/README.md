# Practical 11: Create a Blog Management System implementing CRUD Operations, Authentication and Role-Based Access Control.

Create a blog API and React client. Users register as authors; a seed script creates an administrator. JWT authentication is required for publishing, and the API enforces ownership and admin permissions.

## Requirements
Node.js 20.19+ or 22.12+, npm, MongoDB Atlas, React, Express, Mongoose, JWT, bcryptjs, dotenv, CORS.

## Setup
```bash
cd Practical_11_Blog_Management
cd server && npm install
copy .env.example .env
# Edit server/.env; configure Atlas and a long secret
npm run seed:admin
npm run dev
# In another terminal, from project root:
cd client && npm install
npm run dev
```

## Workflow
Configure .env and seed an admin. Register author accounts in the UI. Public users can read posts; authenticated authors can create posts and manage their own posts; administrators can manage any post. Role and ownership checks happen on the server.

## Expected output
Passwords are bcrypt-hashed and JWTs authenticate write requests. Unauthorized requests return 401; ownership/role failures return 403. Posts are persisted in MongoDB.

> The PDF companion includes an illustrative output mockup, not a genuine execution screenshot. Run the project locally to capture your own verified screenshot.
