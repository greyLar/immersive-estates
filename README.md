# ImmersiveEstates — AI-Powered 360° Real Estate Photography

## Overview
ImmersiveEstates helps real estate agents sell properties faster by delivering professional 360° immersive photo tours. The system acts as a 24/7 sales assistant that automatically qualifies leads through an AI chat interface, books photography shoots, and manages the post-delivery follow-up process to generate repeat business.

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Backend Setup
```bash
cd backend
npm install
npm run setup   # Creates database tables and initializes schema
npm start       # Starts server on http://localhost:3001
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173 (proxies /api to backend)
```

Or to preview the production build:
```bash
cd frontend
npm run build && npm run preview -- --host 0.0.0.0
```

## Architecture
- **Frontend**: React application built with Vite and Tailwind CSS.
- **Backend**: Node.js Express server.
- **Database**: Turso/SQLite accessed via the `team-db` CLI for shared team state.

## API Documentation

### Leads
- `POST /api/leads` — Create a new lead.
  - `curl -X POST http://localhost:3001/api/leads -H "Content-Type: application/json" -d '{"name": "Jane Doe", "email": "jane@example.com", "monthly_listings": "15+"}'`
- `GET /api/leads?status=hot&source=website_widget` — List leads with filters.
  - `curl http://localhost:3001/api/leads?status=hot`
- `PUT /api/leads/:id` — Update lead details.
- `POST /api/leads/:id/qualify` — Manually trigger lead qualification logic.

### Chat
- `POST /api/chat/message` — Send a message to the AI assistant.
  - Flow: Greeting → Name → Brokerage → Listings → Website → Booking Pitch.
  - `curl -X POST http://localhost:3001/api/chat/message -H "Content-Type: application/json" -d '{"message": "Hello"}'`

### Bookings
- `POST /api/bookings` — Create a shoot booking.
  - `curl -X POST http://localhost:3001/api/bookings -H "Content-Type: application/json" -d '{"lead_id": 1, "property_address": "123 Main St"}'`
- `GET /api/bookings?status=pending` — List bookings with filters.
- `PUT /api/bookings/:id` — Update booking.
- `POST /api/bookings/:id/confirm` — Confirm a pending booking.
- `POST /api/bookings/:id/complete` — Mark as completed (triggers follow-up and review requests).

### Outreach
- `POST /api/outreach` — Log an outreach attempt.
- `GET /api/outreach/pending` — Get list of pending follow-ups.

### Reviews
- `POST /api/reviews/request` — Request a Google review manually.
- `POST /api/reviews/request/:lead_id` — Trigger auto-request for a specific lead.
- `GET /api/reviews/pending` — List pending review requests.

### Re-engagement
- `GET /api/re-engagement/pending` — List candidates for 30-day re-engagement.

### Metrics
- `GET /api/metrics` — Retrieve KPIs (total leads, conversion rate, hot leads, etc.).
  - `curl -s http://localhost:3001/api/metrics`

## Chat Flow Example
The AI assistant follows a specific state-machine logic:
1. **Greeting**: User opens chat → bot asks for name.
2. **Name**: User provides name → bot asks for brokerage.
3. **Brokerage**: User provides brokerage → bot asks for monthly listings (1-5, 6-15, 15+).
4. **Listings**: User provides listings → bot asks if they have a personal website.
5. **Website**: User responds → bot qualifies lead (15+ = **hot**, prioritized) → offers to book a shoot.
6. **Booking**: If user says yes → bot collects booking details.
7. **Wrap-up**: If no → bot provides a friendly closing.

## Environment Variables
- `VITE_API_URL` — Frontend API base URL (default: `http://localhost:3001/api`)
- `PORT` — Backend server port (default: `3001`)
- `GOOGLE_REVIEW_URL` — The Google review link sent to customers.

## Project Structure
```
immersive-estates/
├── backend/
│   ├── server.js       # Express API server
│   ├── setup.js        # Database initialization
│   ├── db.js           # Database utility (team-db wrapper)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── ChatWidget.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```
