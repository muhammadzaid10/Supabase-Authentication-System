# Aurora — A Premium Supabase Auth Experience

> A production-grade SaaS authentication system + dashboard built with React, Supabase, Tailwind CSS, and Framer Motion. Designed to feel calm, fast, and unmistakably crafted.

![Stack](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![Framer](https://img.shields.io/badge/Framer%20Motion-11-EF4F4F?logo=framer)

---

## ✨ Highlights

- **Full auth flow** — email + password, Google OAuth, forgot-password email link, password reset, secure session persistence, auto-refresh JWT, protected routes.
- **Premium dashboard** — analytics tiles, activity feed, sign-in chart (Recharts), profile card, security checklist.
- **Sidebar + topbar** — collapsible sidebar with active-route indicator, mobile drawer, search field, notifications dropdown, profile menu.
- **Settings panel** — change password, theme switcher (dark / light), notification toggles, danger zone.
- **Aurora aesthetic** — glass surfaces, hairline gradient borders, animated aurora blobs, Geist + Instrument Serif typography.
- **Animations everywhere** — page transitions, staggered card reveals, layoutId active-nav highlight, focus rings, toast styling, loading skeletons.

## 🧱 Stack

| Layer | Choice |
| --- | --- |
| Framework | React 18 + Vite 5 |
| Auth & DB | Supabase JS v2 |
| Styling | Tailwind CSS 3 (custom design tokens) |
| Animation | Framer Motion 11 |
| Routing | React Router DOM 6 |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Charts | recharts |

## 🚀 Getting started

### 1. Install

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → API** and copy your `Project URL` and `anon` public key.
3. (Optional, for Google OAuth) Go to **Authentication → Providers → Google** and follow the wizard to add a Google OAuth client.
4. Under **Authentication → URL Configuration**, add `http://localhost:5173/auth/callback` and `http://localhost:5173/reset-password` to the allow-list.
5. Copy the env file:

```bash
cp .env.example .env
```

Then fill in:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=ey...
```

### 3. Run

```bash
npm run dev
```

The app opens at <http://localhost:5173>.

## 📁 Project structure

```
src/
├── components/        # Reusable UI primitives
│   ├── AuroraBackground.jsx
│   ├── ActivityChart.jsx
│   ├── FormField.jsx
│   ├── LoadingScreen.jsx
│   ├── Logo.jsx
│   ├── ProfileCard.jsx
│   ├── RouteGuards.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── ThemeToggle.jsx
│   └── Topbar.jsx
├── context/           # React context providers
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── layouts/           # Page shells
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── lib/
│   └── supabaseClient.js
├── pages/             # Route components
│   ├── AuthCallback.jsx
│   ├── Dashboard.jsx
│   ├── ForgotPassword.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   ├── ResetPassword.jsx
│   ├── Security.jsx
│   └── Settings.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## 🔐 App flow

```
Open app → AuthProvider hydrates session
       │
       ├── No session ─→ /login (or /register, /forgot-password)
       │                  ↓
       │              signIn / signUp / OAuth
       │                  ↓
       └── Session ────→ /dashboard (protected)
                            ├── /profile
                            ├── /settings   (theme, notifications)
                            └── /security   (password, 2FA, sessions)
```

## 🎨 Design system

The design system lives in `tailwind.config.js` and `src/index.css`.

| Token | Value |
| --- | --- |
| Display font | `Instrument Serif` (italic accent) |
| UI font | `Geist Sans` |
| Mono | `Geist Mono` |
| Accent gradient | `#22D3EE → #3B82F6 → #8B5CF6` |
| Surface | Glass (white at ~3% over `#08080B`) |
| Radius | 16–24px (`rounded-2xl`, `rounded-3xl`) |

Reusable utility classes: `.glass`, `.glass-strong`, `.border-gradient`, `.btn-aurora`, `.btn-ghost`, `.field`, `.text-aurora`, `.skeleton`.

## 🧪 Things to try

- Hover any **stat card** to see the gradient hairline border solidify and a colored glow blob fade in.
- Toggle the sidebar — note how the active nav pill animates with `layoutId`.
- Switch to **light mode** from `Settings` — every glass surface re-tints automatically through CSS variables.
- Open the **notifications** bell in the topbar — it uses the same dropdown pattern as the profile menu, both close on outside-click.
- Type a **password during registration** — the strength meter fills with a gradient at full strength.

## 📦 Build for production

```bash
npm run build
npm run preview
```

The output goes to `dist/` and is ready for any static host (Vercel, Netlify, Cloudflare Pages, S3).

## 🛡️ Security notes

- The `anon` key is safe to ship to the browser — it's gated by Supabase Row Level Security on your tables.
- Sessions are stored in `localStorage` by default (`autoRefreshToken: true`).
- Reset-password and OAuth flows redirect through `/reset-password` and `/auth/callback` respectively. Add these URLs to **Supabase → Authentication → URL Configuration** before going live.

## 📄 License

MIT — use this freely as a starter or portfolio piece.

---

Designed and built with care. The italic word in every heading is intentional.
