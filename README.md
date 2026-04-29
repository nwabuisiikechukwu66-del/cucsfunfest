# CUCS FunFest 2026
## Caritas University Computer Science Departmental Week

> Code. Culture. Community.

---

## Project Structure

```
funfest/
├── frontend/          # React (Vite) app
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/   # Hero, About, Schedule, Tickets, Features, Contact
│   │   │   ├── ui/         # Navbar, Footer
│   │   │   └── chat/       # HackerChat AI bot
│   │   ├── pages/          # HomePage, AdminPage, ScannerPage, TicketVerifyPage
│   │   └── lib/            # utils, finalYearData
│   └── .env.example
└── convex/            # Convex backend
    ├── schema.js
    ├── attendees.js
    └── auth.js
```

---

## Setup Instructions

### 1. Convex Backend

```bash
cd convex
npm install
npx convex dev
```

Copy the deployment URL from the output — you'll need it for the frontend.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Fill in `.env.local`:
- `VITE_CONVEX_URL` — from step 1
- `VITE_PAYSTACK_PUBLIC_KEY` — from paystack.com
- `VITE_GROQ_API_KEY` — from console.groq.com

```bash
npm run dev
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main public website |
| `/admin` | Admin dashboard (password: blablablaCSC2026) |
| `/admin/scanner` | Gate QR scanner |
| `/ticket/:code` | Ticket QR landing page |

---

## Payment Flow

1. User fills registration form
2. System checks reg number against final year list (silent)
3. Appropriate price shown (₦5,000 or ₦10,000)
4. Paystack popup → instant ticket on success
5. OR bank transfer → admin verifies → ticket released
6. Email confirmation sent with QR code ticket

## Admin Dashboard

- Real-time attendee list with search & filters
- Approve/reject pending transfers
- Export CSV
- Stats: revenue, headcount, scanned count

## Gate Scanner

- Camera-based QR scan
- Manual code entry fallback
- Visual result: ✅ VALID / ❌ INVALID / ⚠️ ALREADY SCANNED

---

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Convex (real-time, serverless)
- **Payments**: Paystack
- **AI Chat**: Groq (llama-3.1-8b-instant)
- **Icons**: Phosphor Icons
- **QR Code**: qrcode.react + html5-qrcode

---

Built by [frankdotdev](https://frankoge.com) — Hackverse Software Solutions
