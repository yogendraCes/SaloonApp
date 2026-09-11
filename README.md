# Zenyme — Luxury Salon & Independent Stylist SaaS Platform

> A modern, full-featured two-sided salon management and client booking platform built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Zustand state engine with real-time double-booking prevention.

![Zenyme Storefront & SaaS Dashboard](https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Highlights & Architecture

Zenyme bridges the gap between **high-end salon customers** who demand seamless online booking and **salon owners & independent booth-rent stylists** who need real-time appointment scheduling, revenue split accounting, and client CRM management.

### 1. ✂️ Client Booking Storefront (`/book`)
- **Luxury Service Showcase**: Scissor cuts, balayage color transformations, royal beard sculpting, and aromatherapy head spas with pricing & duration transparency.
- **Master Stylist Selector**: Browse master stylists, ratings, specialties, and bio details.
- **Anti-Collision Time Matrix**: Live double-booking protection ensuring time slots already booked by another customer or passed in the day are locked out dynamically.
- **1-Tap WhatsApp Concierge Confirmation**: Pre-formatted WhatsApp confirmation link auto-generated for instant client-to-salon communication.

### 2. 📊 Two-Sided Management Workspace (`/dashboard`, `/freelancer`)
- **Salon Owner Admin View**: High-level salon metrics (Total Customers, Appointments Today, Revenue Today, Growth trends), appointment manager, service catalog management, and staff roster.
- **Independent Stylist / Freelancer Portal**: Customized financial dashboard showing commission splits (e.g. 70/30 rate), daily booth rent deductions, personal earnings calculation, and daily schedule filter.
- **Interactive Role Switcher**: Instant top-bar toggle allowing portfolio reviewers and evaluators to swap between **Salon Owner**, **Freelance Stylist**, and **Client Booking Mode** on the fly.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components, Client Hydration)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Lucide Icons
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with `localStorage` persistent middleware
- **Deployment**: Vercel & Node.js

---

## 💡 Real vs. Mock Data Transparency

- **State & Storage**: Powered by a robust client-side Zustand state store persisted to browser `localStorage` (`zenyme-storage`).
- **Data Engine**: Pre-seeded with a realistic mock salon dataset (4 customers, 4 appointments, 4 master stylists, 5 service offerings).
- **Business Logic**: Real-time slot conflict matrix algorithms, dynamic revenue calculation, commission split computation, and full CRUD mutations run live in browser.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x installed
- `npm` or `yarn` or `pnpm`

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/yogendraCes/SaloonApp.git

# 2. Navigate to project directory
cd SaloonApp

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port outputted in shell) to experience the live application.

---

## 📸 Screenshots & Workflow

| Storefront & Lookbook | Client Booking Wizard | Freelancer Portal |
| :--- | :--- | :--- |
| Verified luxury styling options & reviews | 4-step anti-collision booking experience | Commission split & booth rent accounting |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
