<div align="center">

<br />

```
███████╗██████╗ ███████╗███████╗██╗      █████╗ ███╗   ██╗ ██████╗███████╗██████╗
██╔════╝██╔══██╗██╔════╝██╔════╝██║     ██╔══██╗████╗  ██║██╔════╝██╔════╝██╔══██╗
█████╗  ██████╔╝█████╗  █████╗  ██║     ███████║██╔██╗ ██║██║     █████╗  ██████╔╝
██╔══╝  ██╔══██╗██╔══╝  ██╔══╝  ██║     ██╔══██║██║╚██╗██║██║     ██╔══╝  ██╔══██╗
██║     ██║  ██║███████╗███████╗███████╗██║  ██║██║ ╚████║╚██████╗███████╗██║  ██║
╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═╝  ╚═╝
```

**The Future of Student Freelancing**

*Earn. Learn. Grow. — All in one platform.*

<br />

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

<br />

![GitHub stars](https://img.shields.io/github/stars/yourusername/freelancer?style=flat-square&color=a855f7)
![GitHub forks](https://img.shields.io/github/forks/yourusername/freelancer?style=flat-square&color=a855f7)
![License](https://img.shields.io/badge/license-MIT-a855f7?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-a855f7?style=flat-square)

<br />

[🚀 Live Demo](#) · [📖 Docs](#) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

<br />

## ✦ What is FreeLancer?

> FreeLancer is a **premium full-stack platform** built for students who refuse to wait until graduation to start their careers. It's a complete ecosystem — a freelance marketplace, a mentorship network, and an AI-powered technical assistant, all under one roof.

No fluff. No gatekeeping. Just a direct path from campus to career.

<br />

---

## ✦ Core Features

<br />

### `01` — Freelance Marketplace `/jobs`

Browse and apply for real projects tailored for students.

- 🔍 **Smart Filtering** — Search and filter jobs by skill, budget, and category
- 📬 **Seamless Applications** — One-click apply with profile-linked portfolios
- 🔐 **Escrow Payments** — Secure, protected payments so you always get paid

<br />

### `02` — Mentor Booking System `/mentors`

Direct access to engineers from top tech companies.

- 🧠 **Expert Directory** — Browse verified mentors from FAANG and beyond
- 📅 **1-on-1 Sessions** — Book time for career advice, code reviews, or mock interviews
- 💬 **Direct Messaging** — Real-time conversations via the built-in messenger

<br />

### `03` — AI Assistant `/ai-assistant`

Your on-demand technical co-pilot, powered by Gemini.

- ⚡ **Real-time Answers** — Instant help with code, architecture, and concepts
- 🧩 **Context-Aware** — Powered by Google's Gemini Flash for sharp, relevant responses
- 🎨 **Sleek Interface** — A modern chat UI built for productivity, not distraction

<br />

---

## ✦ Tech Stack

<br />

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Animations** | Framer Motion + Three.js + Spline |
| **Database** | MongoDB via Mongoose |
| **Auth** | Clerk (OAuth + OTP) |
| **AI** | Google Gemini API |
| **Email** | Resend + Nodemailer |
| **Payments** | Stripe Payment Intents |

<br />

---

## ✦ Project Structure

```
freelancer/
│
├── app/                        # Next.js App Router
│   ├── ai-assistant/           # Gemini-powered chat interface
│   ├── jobs/                   # Job listings & applications
│   ├── mentors/                # Mentor directory & booking
│   ├── dashboard/              # User profile & management
│   └── api/                   # All backend endpoints
│       ├── chat/               # AI chat (Gemini)
│       ├── ai/analyze/         # Code syntax analyzer
│       ├── jobs/               # Job CRUD
│       ├── applications/       # Application management
│       ├── mentors/            # Mentor profiles
│       ├── bookings/           # Session booking
│       ├── conversations/      # Messaging system
│       ├── profile/            # User profile
│       └── create-payment-intent/  # Stripe payments
│
├── components/                 # Reusable UI components (Radix + Shadcn)
├── hooks/                      # Custom React hooks
├── lib/                        # DB connection, AI config, utilities
├── models/                     # Mongoose schemas (User, Job, Mentor)
├── public/                     # Static assets
└── config/                     # Project configuration
```

<br />

---

## ✦ API Reference

```
# Jobs
GET     /api/jobs                          List all jobs
POST    /api/jobs                          Create a job

# Applications
GET     /api/applications                  List applications
POST    /api/applications                  Submit application
PATCH   /api/applications/[id]             Update application status

# Mentors
GET     /api/mentors                       List mentors
GET     /api/mentors/[id]                  Get mentor profile

# Bookings
POST    /api/bookings                      Book a session
GET     /api/mentor/bookings               Get mentor's bookings

# Messaging
GET     /api/conversations                 List conversations
POST    /api/conversations                 Create conversation
GET     /api/conversations/[id]/messages   Get messages
POST    /api/conversations/[id]/messages   Send message

# AI
POST    /api/chat                          Gemini chat
POST    /api/ai/analyze                    Syntax checker

# User
GET     /api/profile                       Get profile
PATCH   /api/profile                       Update profile

# Payments
POST    /api/create-payment-intent         Stripe intent
```

<br />

---

## ✦ Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB URI (Atlas or local)
- Clerk account
- Google AI Studio key (for Gemini)
- Resend account (for emails)

<br />

### 1 · Clone the repo

```bash
git clone https://github.com/yourusername/freelancer.git
cd freelancer
```

### 2 · Install dependencies

```bash
npm install
```

### 3 · Configure environment variables

Create a `.env.local` file in the root:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication — Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# AI — Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Email — Resend
RESEND_API_KEY=your_resend_api_key

# Payments — Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4 · Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're live. ✦

<br />

---

## ✦ Design System

FreeLancer runs on a **Modern Dark Aesthetic** with glassmorphism layering and violet/purple accents.

```
Background     →  #0a0a0f  (near-black)
Surface        →  rgba(255,255,255,0.04)  (glass cards)
Accent         →  #a855f7  (violet-500)
Accent glow    →  #7c3aed  (violet-600)
Text primary   →  #f4f4f5
Text muted     →  #71717a
```

**Motion principles:**
- Page transitions via Framer Motion `AnimatePresence`
- Staggered card reveals on scroll
- Subtle hover states that breathe, not bounce
- 3D hero elements built with Spline + Three.js

<br />

---

## ✦ Contributing

Contributions are what make this community thrive. Any contribution you make is **greatly appreciated**.

1. Fork the project
2. Create your feature branch — `git checkout -b feature/AmazingFeature`
3. Commit your changes — `git commit -m 'Add AmazingFeature'`
4. Push to the branch — `git push origin feature/AmazingFeature`
5. Open a Pull Request

<br />

---

<div align="center">

Built with 💜 for students who ship.

<br />

*If this project helped you, consider giving it a ⭐ — it means a lot.*

</div>
