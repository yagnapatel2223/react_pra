# Practical 10: Develop a complete MERN application integrating React Frontend, Express Backend and MongoDB Database.

Build a full-stack task tracker. React communicates with Express REST endpoints; Express uses Mongoose to persist tasks in MongoDB.

## Requirements
Node.js 20.19+ or 22.12+, npm, MongoDB Atlas, React, Vite, Express, Mongoose, dotenv and CORS.

## Setup
```bash
cd Practical_10_MERN_Task_Manager
cd server && npm install
copy .env.example .env
# Edit server/.env with your Atlas URI
npm run dev
# In a second terminal, from the project root:
cd client && npm install
npm run dev
```

## Workflow
Configure MongoDB URI in server/.env; run the API on port 4000; run the Vite client on port 5173 in a second terminal; add, complete and delete tasks from the UI.

## Expected output
New tasks are sent as JSON to Express and stored by Mongoose. Task completion and deletion call PATCH and DELETE endpoints; records persist in MongoDB.

> The PDF companion includes an illustrative output mockup, not a genuine execution screenshot. Run the project locally to capture your own verified screenshot.
