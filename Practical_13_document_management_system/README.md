# Practical 13 - MERN Document Management System

A learning starter for authenticated document upload, metadata, search, download and deletion. React is the frontend; Express and Multer handle the API and file uploads; Mongoose persists user and document metadata in MongoDB.

## Setup
1. From `server`, run `npm install`, copy `.env.example` to `.env`, and set the MongoDB URI, long JWT secret and admin credentials.
2. Run `npm run seed:admin` once to create/update the configured administrator account.
3. Run `npm run dev` in the server directory.
4. In a second terminal, enter `client`, run `npm install`, then `npm run dev`. Open the Vite URL.

Regular registrations become `user` accounts. The seed script is the controlled way to assign the `admin` role. Files are stored on disk in `server/uploads`; the database stores their metadata. Do not use this teaching starter for sensitive production documents without additional security, malware scanning, storage controls, backups and audit logging.
