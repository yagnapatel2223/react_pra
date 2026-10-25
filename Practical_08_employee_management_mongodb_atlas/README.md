# Practical 08: Develop an Employee Management API integrating Express.js with MongoDB Atlas.

Create employee CRUD endpoints backed by MongoDB through Mongoose. Configure Atlas credentials in an environment file.

## Requirements
Node.js 18+, npm, MongoDB Atlas account, Express, Mongoose, dotenv, CORS and Postman.

## Setup
```bash
cd Practical_08_Employee_Management_API
npm install
copy .env.example .env
# Edit .env and replace MONGODB_URI with your Atlas URI
npm run dev
```

## Workflow
Create a free Atlas cluster, database user and network access rule for your current IP; copy .env.example to .env; provide the private URI; install packages; test POST and GET employee routes.

## Expected output
Employee records are persisted in MongoDB. Mongoose validates required name, email, department and non-negative salary; duplicate email returns HTTP 409.

> The PDF companion includes an illustrative output mockup, not a genuine execution screenshot. Run the project locally to capture your own verified screenshot.
