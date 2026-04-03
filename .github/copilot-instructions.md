# Copilot Instructions

You are assisting on a production-style AI-first real-time chat app built with MERN.

## Tech Stack

- React + Vite
- Zustand for state management
- Tailwind + DaisyUI
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- Cloudinary
- Arcjet
- JWT auth with HTTP-only cookies

## Core App Purpose

This project is evolving from a simple 1:1 chat app into a WhatsApp-like AI messaging platform.

## Development Principles

- Keep backend code modular and scalable
- Controllers should remain thin
- Move business logic into services
- Use validators for request payloads
- Prefer reusable helpers over duplicate logic
- Preserve existing functionality unless explicitly changing it
- Never introduce breaking schema changes without migration awareness
- Keep socket event names centralized and consistent
- Avoid monolithic files
- Prefer maintainable code over clever code

## Backend Rules

- Do not place heavy logic directly in controllers
- Use async/await consistently
- Validate all incoming request payloads
- Handle errors consistently
- Avoid leaking sensitive internal errors to clients
- Never expose secrets
- Use indexes where relevant
- Write code with future support for groups, AI, and message lifecycle features

## Frontend Rules

- Keep components focused and reusable
- Avoid bloated Zustand stores
- Prefer derived state over duplicated state
- Handle loading and optimistic UI carefully
- Preserve current UI theme unless asked to redesign
- Keep chat interactions smooth and responsive

## Realtime Rules

- Socket events should be clearly named and scoped
- Always consider reconnect, duplicate events, and cleanup
- Design socket flows for future support of typing, delivery, seen, and group messaging

## AI Feature Rules

When implementing AI features:

- Keep AI endpoints isolated in their own route/controller/service flow
- Do not tightly couple AI logic with message sending logic
- Design AI features as optional enhancements, not blockers to core messaging

## Output Style

When suggesting changes:

1. explain the architectural reason briefly
2. then implement file-by-file
3. avoid rewriting unrelated files unless necessary
