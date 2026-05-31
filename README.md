# <img src="public/favicon.svg" width="32" height="32" valign="middle" /> Dopzy

> **One Tap, Task Done** — Vetted, trusted local helpers at your fingertips.

Dopzy is a premium, state-of-the-art service marketplace connecting clients with local helpers ("Co-Taskers") for instant tasks. Designed with a sleek, responsive design system based on a Petrol and Gold color scheme, Dopzy offers a premium user experience from task creation to job completion and moderation.

---

## 🚀 Key Features

* **Unified Workspace**: Seamless transitions between **Client** and **Co-Tasker** dashboards depending on user roles.
* **Instant Task Posting & Editing**: Clients can post tasks with flexible budgets, descriptions, images, and specific requirements. Any updates automatically trigger status resets to `'pending'` for secure moderation.
* **Co-Tasker Applications**: Users can submit applications with detailed bios, skills, desired rates, and portfolios to become verified helpers.
* **Smart Offers & Bidding**: Co-Taskers can place bids and custom messages on open tasks. Clients can review, accept, or decline offers.
* **Interactive Messaging & Inquiries**: Support for pre-bid chat requests (direct inquiries) and private message streams between participants.
* **Escrow Wallet Tracking**: Transparent transaction logging for payment reservations and release milestones.
* **Comprehensive Admin Moderation Panel**: Dedicated dashboard for administrators to approve/reject tasks, review Co-Tasker applications, and enable/disable user accounts in real time.

---

## 🛠️ Tech Stack & Integrations

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD627" alt="Vite" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Supabase-1C1C1C?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
  <img src="https://img.shields.io/badge/Posthog-000000?style=for-the-badge&logo=posthog&logoColor=white" alt="PostHog" />
  <img src="https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white" alt="Sentry" />
  <img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare" />
</p>

* **Core**: React 19, TypeScript, Vite.
* **Styling**: Premium Vanilla CSS system with variables, responsive layout matrices, custom form outlines, and rounded borders.
* **Database & Auth (Supabase)**:
  * Full integration with Supabase Auth for secure logins, sign-ups, and session management.
  * Real-time sync of user profiles and states via PostgreSQL schemas, custom types, indexes, and automated triggers.
  * Row Level Security (RLS) policies protecting database read/write actions.
* **Product Analytics (PostHog)**:
  * Live user identification and custom event tracking.
  * Captures core funnel flows (e.g. posting tasks, placing offers, task completions) for insight analysis.
* **Error Tracking (Sentry)**:
  * Real-time exception capture and error boundary fallbacks.
  * Automated source maps upload configured for production build releases.

---

## ⚙️ Setup & Development

### 1. Prerequisites
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_POSTHOG_KEY=your-posthog-project-token
VITE_POSTHOG_HOST=https://us.i.posthog.com # or https://eu.i.posthog.com
VITE_SENTRY_DSN=your-sentry-dsn-url
```

### 2. Database Seeding
Copy the schema and triggers from [`supabase/migration.sql`](supabase/migration.sql) and the mock seeds from [`supabase/seed.sql`](supabase/seed.sql) into your Supabase SQL Editor and execute them.

### 3. Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## ☁️ Deployment (Cloudflare Pages)

Dopzy is configured to build and deploy automatically on **Cloudflare Pages**. 

To ensure the production build connects to your backend services successfully, add the following variables under **Settings > Variables and Secrets** in your Cloudflare project dashboard:

| Environment Variable | Description | Type |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase Project API URL | Text |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anonymous Public API Key | Text |
| `VITE_POSTHOG_KEY` | Your PostHog Project token | Text |
| `VITE_POSTHOG_HOST` | Your PostHog Host API endpoint | Text |
| `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` | Backup variable for PostHog Token | Text |
| `VITE_PUBLIC_POSTHOG_HOST` | Backup variable for PostHog Host | Text |
| `SENTRY_AUTH_TOKEN` | Sentry integration authorization token | Secret |

---

## 🎨 Branding & Assets

The official Dopzy checkmark logo utilizes the following design specifications:
* **Background Petrol**: `#004352`
* **Accent Gold**: `#FFE600`
* **Font Headline**: Outfit / Outfit Bold

Vector logo files are available in [`public/favicon.svg`](public/favicon.svg) and custom components.
