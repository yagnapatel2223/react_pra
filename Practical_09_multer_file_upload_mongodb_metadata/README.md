# Practical 09: Create a file upload module using Multer and store file metadata in MongoDB.

Provide an HTML upload form backed by Express, Multer disk storage and a MongoDB FileRecord model. The server limits size and accepts selected document/image formats.

## Requirements
Node.js 18+, npm, MongoDB Atlas, Express, Multer, Mongoose and a browser.

## Setup
```bash
cd Practical_09_Multer_File_Upload
npm install
copy .env.example .env
# Set MONGODB_URI in .env
npm run dev
```

## Workflow
Set up MongoDB Atlas; create uploads storage; configure Multer limits and file filter; save metadata after a successful upload; list metadata and serve controlled download routes.

## Expected output
The actual file is saved under uploads/ with a generated filename; MongoDB stores the original name, MIME type, size and generated filename. Unsupported types and oversized files are rejected.

> The PDF companion includes an illustrative output mockup, not a genuine execution screenshot. Run the project locally to capture your own verified screenshot.
