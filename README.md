# Dev Events 🎯
A Full-Stack Developer Events Discovery & Booking Platform

## 📌 Overview
Dev Events is a full-stack web application built to help developers discover tech events such as hackathons, meetups, and conferences, and register for them seamlessly. The platform focuses on clean architecture, performance optimization, and real-world product concerns like caching, analytics, and maintainability.

This project was built end-to-end using modern web engineering practices and reflects a production-oriented approach rather than a demo or tutorial project.

---

## ✨ Features
- 🔍 **Event Discovery** – Browse a curated list of developer events
- 🧭 **Dynamic Event Pages** – SEO-friendly, slug-based event detail pages
- 📩 **Email-Based Registration** – Simple and fast event booking flow
- ⚡ **Performance Optimization** – Server-side caching and controlled revalidation
- 📊 **Analytics & Observability** – Track meaningful user interactions
- 🧩 **Modular Architecture** – Clean separation of UI, backend logic, and data models

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Next.js API Routes**
- **Server Actions**
- **MongoDB & Mongoose**

### Analytics & Tooling
- **PostHog** (user interaction tracking)
- **Server-side caching & revalidation**
- **Shadcn/UI configuration**

---

## 🏗️ Architecture Highlights
- Uses **App Router** with server-first rendering patterns
- Implements **server actions** to reduce client-server overhead
- Employs **hour-level caching** to improve performance and reduce database load
- Separates concerns across components, routes, actions, and models
- Designed for easy extension (authentication, event creation, admin flows)

---

## 📊 Analytics Events Tracked
The application tracks **10+ meaningful user interactions**, including:
- Event card clicks
- Event registrations
- Navigation interactions
- CTA button usage
- Error and failure cases

This enables better understanding of user behavior and supports data-driven iteration.

---

## 🧠 Key Learnings
- Designing end-to-end systems instead of isolated features
- Making performance-conscious decisions early (caching, revalidation)
- Structuring scalable backend workflows with server actions
- Instrumenting analytics to observe real user behavior
- Writing clean, maintainable code aligned with production standards

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or cloud)
- npm / yarn / pnpm

### Installation
```bash
git clone https://github.com/your-username/dev-events.git
cd dev-events
npm install
````
### Environment Variables
***Create a .env.local file and add:***
```bash
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
````
***Run Locally***
```bash
npm run dev
````

## To see how it'll look click on ->
```bash 
    https://dev-event-cde27rhx5-khushis-projects-ea0259c2.vercel.app/
```
