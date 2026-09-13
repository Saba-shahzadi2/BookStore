# BookStore — Node/Express API

REST API for the MERN BookStore application.

## Features
- JWT authentication and role-based admin authorization
- Secure password hashing with bcrypt
- OTP password reset through Nodemailer
- Book CRUD with soft delete/restore
- Persistent cart and wishlist
- Transaction-safe checkout and stock updates
- Order cancellation and controlled status transitions
- Admin dashboard statistics and order/user management
- MongoDB/Mongoose data models and validation

## Environment
Copy `.env.example` to `.env` and provide real values for MongoDB, JWT and email credentials.

Never commit `.env` or production secrets.

## Run
- Development: `npm run dev`
- Production: `npm start`
