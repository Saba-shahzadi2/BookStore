# BookStore — React Client

A production-style React + Vite frontend for a MERN bookstore.

## Features
- Authentication and protected routes
- Book browsing, search and category filtering
- Cart and wishlist state via reusable Context providers
- Checkout and order tracking
- Password reset with OTP
- Admin dashboard, books and order management
- Responsive Tailwind CSS UI
- Centralized Axios API client
- Reusable UI components for loading, errors, empty states, buttons, book images and status badges

## Setup
1. Install dependencies: `npm install`
2. Create `.env` with:
   `VITE_API_URL=http://localhost:5000/api`
3. Run: `npm run dev`
4. Production build: `npm run build`

## Architecture
`pages/` contains route-level screens, `components/` contains reusable UI, `context/` contains shared application state, and `api/` contains backend service functions.
