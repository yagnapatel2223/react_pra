# Practical 12: Develop a Real-Time Chat Application using Socket.IO, React and Node.js.

Build a simple multi-user chat room. Socket.IO delivers new messages to connected browsers in real time; this demo does not persist chat history.

## Requirements
Node.js 20.19+ or 22.12+, npm, React, Socket.IO server/client, Express and two browser windows.

## Setup
```bash
cd Practical_12_SocketIO_Chat
cd server && npm install && npm run dev
# In a second terminal from project root:
cd client && npm install && npm run dev
```

## Workflow
Run the Socket.IO server and Vite client in separate terminals. Open the client in two browser tabs/windows, enter different display names and send messages.

## Expected output
Socket.IO emits chat:message to all connected clients. The backend trims message length and ignores empty text. Chat history is held in client memory only.

> The PDF companion includes an illustrative output mockup, not a genuine execution screenshot. Run the project locally to capture your own verified screenshot.
