# FreeLancer - The Future of Student Freelancing

FreeLancer is a comprehensive, premium platform designed to empower students in their professional journey. It combines a freelance marketplace with expert mentorship and AI-driven support, creating a holistic ecosystem for learning, earning, and growing.

## 🌟 Core Mission
The primary goal is to provide students with a platform where they can:
1. **Earn while they learn**: Access freelancing opportunities tailored for students.
2. **Upskill through Mentorship**: Connect with industry experts to bridge the gap between academia and industry.
3. **Solve Doubts Instantly**: Utilize a dedicated AI (Gemini-powered) assistant for real-time technical help.

---

## 🚀 Key Features

### 1. Freelance Marketplace (`/jobs`)
A hub for students to find and apply for work.
- **Browse Jobs**: Filter and search through various technical and creative projects.
- **Apply with Ease**: Seamless application process for students to showcase their skills.
- **Payment Protection**: Secure escrow payments to ensure students get paid for their hard work.

### 2. Mentor Booking System (`/mentors`)
Direct access to experienced professionals.
- **Expert Directory**: Browse profiles of mentors from top tech companies.
- **1-on-1 Sessions**: Book dedicated time for career guidance, code reviews, or mock interviews.
- **Direct Contact**: Integrated system to contact mentors for specific needs.

### 3. AI Assistant (Gemini Core) (`/ai-assistant`)
A dedicated space for technical inquiries.
- **Real-time Help**: Ask questions about code, architecture, or general technical concepts.
- **Context-Aware**: Powered by Google's Gemini Flash model to provide accurate and helpful responses.
- **Interactive Interface**: A modern, sleek chat interface designed for productivity.

---

## 🛠 Technical Architecture

### Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Frontend Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [Three.js](https://threejs.org/), & [Spline](https://spline.design/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **Email Service**: [Resend](https://resend.com/) & [Nodemailer](https://nodemailer.com/)

### Project Structure
```text
├── app/                  # Next.js App Router (Pages & API)
│   ├── ai-assistant/     # GPT Chat Interface
│   ├── api/              # Backend Endpoints (Auth, Jobs, Mentors, etc.)
│   ├── dashboard/        # User Profile & Management
│   ├── jobs/             # Job Listing & Applications
│   └── mentors/          # Mentor Directory & Booking
├── components/           # Reusable UI Components (Radix, Shadcn)
├── hooks/                # Custom React Hooks
├── lib/                  # Shared Utilities (Database connection, AI config)
├── models/               # Mongoose Schema Definitions (User, Job, Mentor)
├── public/               # Static Assets (Images, Icons)
└── config/               # Project Configuration
```

---

## 📡 API Endpoints Summary

- **Jobs**: `GET /api/jobs`, `POST /api/jobs`
- **Applications**: `GET /api/applications`, `POST /api/applications`, `PATCH /api/applications/[id]`
- **Conversations**: `GET /api/conversations`, `POST /api/conversations`
- **Messages**: `GET /api/conversations/[id]/messages`, `POST /api/conversations/[id]/messages`
- **Mentors**: `GET /api/mentors`, `GET /api/mentors/[id]`
- **Bookings**: `POST /api/bookings`, `GET /api/mentor/bookings`
- **AI Chat**: `POST /api/chat` (Gemini), `POST /api/ai/analyze` (Syntax check)
- **Profile**: `GET/PATCH /api/profile`
- **Payments**: `POST /api/create-payment-intent`

---

## 🔧 Setup & Development

1. **Environment Variables**: Create a `.env.local` file with:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `GEMINI_API_KEY`: For the AI assistant.
   - `CLERK_SECRET_KEY` & `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: For authentication.
   - `RESEND_API_KEY`: For email notifications.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```

---

## 🎨 Design Philosophy
The platform utilizes a **Modern Dark Aesthetic** (Glassmorphism) with vibrant violet/purple accents. It features:
- **Interactive 3D Elements**: Using Spline and Three.js for a premium feel.
- **Micro-animations**: Smooth transitions using Framer Motion.
- **Responsive Layout**: Optimized for both mobile and desktop users.
