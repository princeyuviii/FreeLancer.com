# FreeLancer - Student Freelancing Platform

FreeLancer is a premium, all-in-one platform designed to help students jumpstart their professional careers. It bridges the gap between learning and earning by providing a marketplace for freelance work, expert mentorship, and AI-powered assistance.

## 📖 Project Overview

### Main Goals
- **Student Empowerment**: Providing a safe and professional space for students to take on real-world projects.
- **Expert Guidance**: Connecting students with industry veterans to accelerate their growth.
- **AI-Powered Learning**: Leveraging state-of-the-art AI to help students solve technical hurdles instantly.

---

## ✨ Features

- **💼 Freelance Marketplace**: A curated list of technical and creative jobs specifically for student skill levels.
- **🎓 Mentor Booking**: Browse and book 1-on-1 sessions with experts from top companies like Google, Meta, and more.
- **🤖 AI Assistant (GPT)**: A dedicated technical assistant to answer coding questions, debug issues, and explain concepts.
- **📊 User Dashboard**: Track job applications, upcoming mentor sessions, and earnings in one place.

---

## 💻 Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, Spline, Three.js
- **Backend**: Next.js API Routes, Clerk (Auth)
- **Database**: MongoDB (Mongoose)
- **AI/Communication**: Google Gemini API, Resend, Nodemailer
- **UI Components**: Shadcn UI, Radix UI, Lucide React

---

## 📂 Project Structure

```text
├── app/                  # Application pages and API routes
├── components/           # Reusable UI components
├── models/               # MongoDB schema models
├── lib/                  # Utility functions and library configs
├── config/               # Project configuration
└── public/               # Static assets
```

---

## 🛠 Setup Instructions

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up Environment Variables**: Copy `.env.example` (or create `.env.local`) with your keys:
   - `MONGODB_URI`
   - `OPENAI_API_KEY`
   - `CLERK_SECRET_KEY`
   - `RESEND_API_KEY`
4. **Run development server**: `npm run dev`

---

## 📄 Full Documentation
For a more detailed breakdown of the architecture, API endpoints, and design philosophy, please refer to [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).
