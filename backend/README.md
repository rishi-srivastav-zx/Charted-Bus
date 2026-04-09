# Chartered Bus - Backend API

This is the backend server for the **Chartered Bus** booking system, powered by **Node.js**, **Express 5**, and **MongoDB**.

## 🚀 Features
- **Authentication**: Secure JWT-based authentication system.
- **RESTful API**: Standardized endpoints for buses, bookings, and users.
- **Security**: Hardened with Helmet, CORS, and Rate Limiting.
- **Validation**: Strict input validation using `express-validator`.
- **Media Storage**: Cloudinary integration for bus image management.
- **Email Service**: Automated notifications via Nodemailer.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT, Bcryptjs
- **Utilities**: Multer (Uploads), Nodemailer (Emails), Helmet (Security)

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Configure your environment using the [local.env](file:///c:/Users/ACER/Desktop/projects/charter-bus-project/Charted-Bus/local.env) file in the project root. Ensure it contains your MongoDB URI, JWT secrets, and SMTP/Cloudinary credentials.

### 3. Run Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```
The server will start on the port specified in your `.env` (default is 3001).

## 📁 API Structure
- `src/models`: Database schemas.
- `src/routes`: API endpoint definitions.
- `src/controllers`: Business logic for handling requests.
- `src/middlewares`: Auth checks and error handling.
- `src/utils`: Helper functions (email, cloudinary, etc.).
