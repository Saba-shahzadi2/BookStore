# 📚 BookStore — Full-Stack MERN E-Commerce Application

A modern, full-stack **BookStore e-commerce web application** built with the MERN stack. The application provides a complete online bookstore experience where users can browse and search books, manage their cart and wishlist, place orders, and manage their profiles.

The project also includes a dedicated **admin dashboard** for managing books, users, orders, and store operations.

> 🚀 Built as a portfolio-quality full-stack application to demonstrate modern React development, REST API integration, authentication, MongoDB database management, and production-oriented project architecture.

---

## 🌐 Live Demo

### Frontend

**Live Application:**
https://zestful-amazement-production-b188.up.railway.app

### Backend API

**API:**
https://bookstore-production-a4c1.up.railway.app

### GitHub

**Repository:**
https://github.com/Saba-shahzadi2/BookStore

---

## 📸 Project Overview

BookStore is designed as a real-world e-commerce platform with separate frontend and backend applications.

The frontend provides a responsive shopping experience for customers, while the backend exposes secure REST APIs for authentication, books, carts, wishlists, orders, and administrative operations.

### User Experience

Users can:

* Create an account
* Log in securely
* Browse available books
* Search and filter books
* View detailed book information
* Add books to the shopping cart
* Manage cart quantities
* Add/remove books from wishlist
* Manage their profile
* Proceed through checkout
* Place orders
* View their orders

### Admin Experience

Administrators can:

* Access the admin dashboard
* Manage books
* Add new books
* Update book information
* Delete books
* Restore books
* Manage orders
* Manage users
* Review customer contact messages
* Monitor store-related information

---

## ✨ Key Features

### 👤 Authentication & User Management

* User registration
* User login
* JWT-based authentication
* Protected routes
* Persistent authentication state
* User profile management
* Role-based access control
* Admin authentication

### 📚 Book Management

* Browse books
* Search books
* View book details
* Book inventory management
* Create books
* Update books
* Delete books
* Restore deleted books
* Admin-only book management

### 🛒 Shopping Cart

* Add books to cart
* Update quantities
* Remove cart items
* Cart item count
* Cart persistence
* Protected cart operations

### ❤️ Wishlist

* Add books to wishlist
* Remove books from wishlist
* View saved books
* Protected wishlist operations

### 📦 Orders & Checkout

* Checkout workflow
* Shipping address handling
* Order creation
* Order history
* Order management
* Payment method support
* Admin order management

### 🛠️ Admin Dashboard

The admin area provides management functionality for:

* Books
* Orders
* Users
* Store data
* Customer messages

### 📩 Contact System

* Customer contact form
* Backend contact API
* Admin message management

### 🔐 Security

* JWT authentication
* Protected API routes
* Role-based authorization
* HTTP security headers
* CORS configuration
* Request rate limiting
* Environment variables for sensitive configuration
* Server-side validation
* Secure API architecture

---

## 🧑‍💻 Tech Stack

### Frontend

* **React.js**
* **Vite**
* **Tailwind CSS**
* **JavaScript (ES6+)**
* **React Router**
* **Axios**
* Context API
* Responsive UI
* Reusable components

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* REST APIs
* Express middleware
* Cookie handling
* Request validation
* Rate limiting

### Database

* **MongoDB**
* **MongoDB Atlas**
* Mongoose ODM

### Deployment

* **Railway**
* GitHub
* Environment-based configuration

---

## 🏗️ Project Architecture

The project follows a separate frontend/backend architecture:

```text
BookStore/
│
├── client/                         # React frontend
│   ├── src/
│   │   ├── api/                   # API services
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # Global state/context
│   │   ├── layouts/               # Application layouts
│   │   ├── pages/                 # User pages
│   │   ├── pages/admin/           # Admin pages
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Node.js backend
│   ├── config/                    # Database configuration
│   ├── controllers/               # Business logic
│   ├── middleware/                # Authentication/security middleware
│   ├── models/                    # Mongoose models
│   ├── routes/                    # REST API routes
│   ├── validators/                # Request validation
│   ├── server.js                  # Application entry point
│   └── package.json
│
├── .gitignore
├── BOOKSTORE_REVIEW.md
└── README.md
```

---

## 🔌 REST API Structure

The backend API is organized into resource-based routes.

### Authentication

```text
/api/auth
```

Handles:

* Registration
* Login
* User authentication
* User information

### Books

```text
/api/books
```

Handles:

* Book listing
* Book details
* Book creation
* Book updates
* Book deletion
* Book restoration
* Admin book management

### Cart

```text
/api/cart
```

Handles:

* Cart retrieval
* Adding items
* Updating quantities
* Removing items

### Wishlist

```text
/api/wishlist
```

Handles:

* Wishlist retrieval
* Adding books
* Removing books

### Orders

```text
/api/orders
```

Handles:

* Checkout
* Order creation
* Order retrieval
* Order management

### Admin

```text
/api/admin
```

Provides administrative functionality.

### Contact

```text
/api/contact
```

Handles customer contact requests.

---

## 🔐 Environment Variables

Sensitive configuration should **never be committed to GitHub**.

### Backend

Create:

```text
server/.env
```

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_secret

CLIENT_URL=http://localhost:5173

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

### Frontend

Create:

```text
client/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, use your deployed backend API URL:

```env
VITE_API_URL=https://bookstore-production-a4c1.up.railway.app/api
```

> ⚠️ Never commit `.env` files, database credentials, JWT secrets, email passwords, or admin passwords to the repository.

---

## ⚙️ Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Saba-shahzadi2/BookStore.git
```

Navigate into the project:

```bash
cd BookStore
```

---

## 🖥️ Frontend Setup

Open a terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

---

## ⚙️ Backend Setup

Open another terminal:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
server/.env
```

Configure your MongoDB and authentication environment variables.

Then start the backend:

```bash
npm start
```

The backend will run using the configured port.

---

## 🗄️ Database

This project uses **MongoDB** with **Mongoose**.

The application stores data such as:

* Users
* Books
* Cart items
* Wishlist items
* Orders
* Contact messages

MongoDB Atlas can be used as the cloud database for production deployment.

---

## 🚀 Production Deployment

The application is deployed using **Railway**.

### Frontend

The React/Vite application is deployed separately from the backend.

Production frontend:

```text
https://zestful-amazement-production-b188.up.railway.app
```

### Backend

The Node.js/Express API is deployed separately.

Production backend:

```text
https://bookstore-production-a4c1.up.railway.app
```

### Production API

```text
https://bookstore-production-a4c1.up.railway.app/api
```

The frontend communicates with the backend through the configured:

```env
VITE_API_URL
```

The backend uses:

```env
CLIENT_URL
```

to allow requests from the deployed frontend.

---

## 🔄 Application Flow

```text
                    ┌─────────────────────┐
                    │      User Browser   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │   Tailwind CSS      │
                    └──────────┬──────────┘
                               │
                          Axios / REST
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      REST API       │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             Authentication          Business Logic
             JWT / Middleware       Controllers
                    │                     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ MongoDB + Mongoose  │
                    └─────────────────────┘
```

---

## 🎯 Learning & Development Goals

This project was built to demonstrate practical full-stack development skills, including:

* Building a complete MERN application
* Designing reusable React components
* Creating RESTful APIs
* Connecting React with Express APIs
* Working with MongoDB and Mongoose
* Implementing JWT authentication
* Protecting frontend routes
* Protecting backend endpoints
* Implementing role-based authorization
* Managing application state with React Context
* Building an admin dashboard
* Handling e-commerce workflows
* Structuring scalable frontend and backend applications
* Deploying a full-stack application

---

## 🧪 Testing Checklist

Before production releases, the following areas should be tested:

### Authentication

* [ ] User registration
* [ ] User login
* [ ] Invalid credentials
* [ ] Protected routes
* [ ] Admin authorization
* [ ] Logout

### Books

* [ ] Book listing
* [ ] Book search
* [ ] Book details
* [ ] Admin create book
* [ ] Admin update book
* [ ] Admin delete book
* [ ] Admin restore book

### Cart

* [ ] Add item
* [ ] Update quantity
* [ ] Remove item
* [ ] Cart persistence

### Wishlist

* [ ] Add wishlist item
* [ ] Remove wishlist item
* [ ] Wishlist persistence

### Orders

* [ ] Checkout
* [ ] Shipping address
* [ ] Order creation
* [ ] Order history
* [ ] Admin order management

### Deployment

* [ ] Frontend production build
* [ ] Backend production start
* [ ] MongoDB connection
* [ ] CORS configuration
* [ ] Environment variables
* [ ] API connectivity

---

## 🔒 Security Practices

The application follows several security-oriented practices:

* JWT-based authentication
* Protected backend routes
* Admin authorization middleware
* Environment-based secrets
* Helmet security headers
* CORS configuration
* API rate limiting
* Server-side validation
* Limited request body sizes
* Separation of frontend and backend responsibilities

Production credentials should always be stored through the hosting provider's environment-variable system rather than committed to source control.

---

## 📈 Future Improvements

Potential future enhancements include:

* Online payment integration
* Product reviews and ratings
* Advanced filtering
* Book categories
* Pagination improvements
* Image upload/storage integration
* Email notifications
* Order status tracking
* Sales analytics
* Advanced admin reports
* Automated testing
* CI/CD workflow
* Improved accessibility
* Performance optimization

---

## 👩‍💻 Developer

**Saba Shahzadi**

MERN Stack Developer specializing in:

* React.js
* JavaScript
* Node.js
* Express.js
* MongoDB
* REST APIs
* Tailwind CSS
* Full-Stack Web Development

### Connect

* GitHub: https://github.com/Saba-shahzadi2
* LinkedIn: https://www.linkedin.com/in/sabashahzadi-mern

---

## 📄 License

This project is intended primarily as a portfolio and learning project.

If you plan to reuse, modify, or distribute the project, please review and add an appropriate license for your intended use.

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

**Built with ❤️ using React, Node.js, Express.js, MongoDB, and Tailwind CSS.**
