# PROJECT_CONTEXT.md

## Project Name

AI-first WhatsApp-like real-time chat app

## Current Stack

- Frontend: React, Vite, Tailwind, DaisyUI, Zustand, Socket.IO client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- Auth: JWT in HTTP-only cookies
- Uploads: Cloudinary
- Security: Arcjet
- Email: Resend

## Current Features

- Signup / login / logout
- Cookie-based auth
- Profile picture upload
- Realtime 1:1 messaging
- Image messages
- Contacts list
- Chat partners list
- Online / offline presence

## Product Goal

Build a production-style AI-powered messaging platform inspired by WhatsApp.

## Planned Features

- message delivery states
- typing indicator
- replies
- delete message
- search
- group chats
- file sharing
- voice notes
- notifications
- AI rewrite
- AI smart replies
- AI summaries
- AI task extraction
- semantic search

## Code Principles

- Keep controllers thin
- Move business logic into services
- Use validators for all request payloads
- Use reusable socket events
- Avoid duplicated logic
- Prefer scalable schema design
- Keep frontend state predictable
- No giant files
- No placeholder fake code
- Always preserve current functionality while extending features

## Important Rules

- Never expose secrets
- Never store passwords in JWT
- Always use hashed passwords
- Always use HTTP-only cookies for auth
- Prefer incremental changes over huge rewrites
