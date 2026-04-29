# ⚡ FreeLancer.com — The Student Builder Protocol

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)

**FreeLancer** is a high-fidelity, professional infrastructure designed exclusively for student builders. It bridges the gap between academic theory and industry reality by providing a high-speed project buffer, mentor nodes, and integrated AI assistance.

---

## 🚀 Key Modules

### 💼 Job_Buffer (`/jobs`)
A specialized marketplace for high-speed technical projects.
- **Vetted Gigs**: Only student-friendly, legitimate projects from founders and startups.
- **Skill-Based Identity**: Build your profile on code commits and real-world results.
- **Smart Escrow**: Payments are locked and secured before you write a single line of code.

### 🧠 Mentor_Nodes (`/mentors`)
Direct uplink to industry veterans and experienced professionals.
- **1-on-1 Uplink**: Book dedicated sessions for code reviews, architecture guidance, or mock interviews.
- **Expert Directory**: Access a network of mentors from top tech institutes and companies.

### 🤖 AI_Core (`/ai-assistant`)
A dedicated technical companion powered by **Google Gemini 2.0 Flash**.
- **Real-time Debugging**: Get instant help with complex logic or architectural hurdles.
- **Context-Aware Support**: Designed to be beginner-friendly yet technically precise.
- **Embedded Everywhere**: AI assistance is integrated across the entire platform lifecycle.

---

## 🛠 Tech Architecture

FreeLancer is built on a state-of-the-art stack focused on speed, aesthetics, and security:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) with [TypeScript](https://www.typescriptlang.org/)
- **Aesthetics**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (High-speed transitions & glassmorphism)
- **Visuals**: [Spline](https://spline.design/) & [Three.js](https://threejs.org/) (Interactive 3D Hero nodes)
- **Identity**: [Clerk](https://clerk.com/) (Secure auth protocol)
- **Persistence**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Infrastructure**: [Stripe](https://stripe.com/) (Escrow flows) & [Resend](https://resend.com/) (Communication protocol)

---

## 📦 Protocol Setup

### 1. Initialize Node
```bash
git clone https://github.com/princeyuviii/FreeLancer.com.git
cd FreeLancer.com
npm install
```

### 2. Configure Environment
Create a `.env.local` file with your credentials:
```env
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
RESEND_API_KEY=your_resend_key
```

### 3. Launch System
```bash
npm run dev
```

---

## 🎨 Design Philosophy
The platform utilizes a **Cyber-Dark Aesthetic** with a focus on:
- **Terminal Minimalism**: Mono-fonts and high-speed data labels.
- **Glassmorphism**: Backdrop blurs and subtle white borders for a premium depth.
- **Responsive Fluidity**: Seamlessly transitions from high-resolution desktops to mobile buffers.

---

## 👤 Architect
Built with passion by **[Yuviii](https://github.com/princeyuviii)**.
Connect with me on **[LinkedIn](https://www.linkedin.com/in/princeyuvi/)** or check out my **[Resume](https://github.com/princeyuviii/FreeLancer.com/blob/main/public/Resume.pdf)**.

---

## 📄 Documentation
For the full technical manifesto, visit [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

---
© 2026 FreeLancer Protocol // Latency: 14ms // Status: Operational
