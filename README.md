# Charted Bus - Luxury Charter Bus Booking System

A full-stack, enterprise-grade charter bus booking platform built with **Next.js 16**, **Node.js/Express 5**, and **MongoDB**. This project provides a seamless experience for users to search, book, and manage luxury bus charters, complete with a powerful admin dashboard.

---

## 🚀 Features

### Frontend (Next.js)
- **Dynamic Bus Search**: Real-time filtering and search for available buses.
- **Interactive Booking Flow**: Multi-step booking process with form validation.
- **Modern UI/UX**: Built with React 19, Tailwind CSS 4, and Framer Motion for smooth animations.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **SEO Optimized**: Dynamic metadata, sitemaps, and robots.txt for search engine visibility.
- **Admin Dashboard**: Comprehensive stats and management interfaces using Recharts.

### Backend (Express)
- **Robust API**: RESTful architecture with secure endpoints.
- **User Authentication**: JWT-based auth with refresh token logic and role-based access control.
- **Security**: Implementation of Helmet, Rate Limiting, and Bcrypt for data protection.
- **File Management**: Integrated with Cloudinary for handling bus and profile image uploads.
- **Automated Emails**: SMTP integration via Nodemailer for booking confirmations and alerts.
- **Database**: Schemas built with Mongoose for robust data modeling.

---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4, Lucide React (Icons)
- **Animations:** Framer Motion
- **State/Data:** Axios, React Select, Recharts
- **Feedback:** React Hot Toast

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, Bcryptjs
- **Service Integrations:** Cloudinary (Storage), Nodemailer (SMTP)
- **Middleware:** Helmet, CORS, Express-Validator, Express-Rate-Limit

---

## 📂 Project Structure

```bash
Charted-Bus/
├── frontend/          # Next.js Application
│   ├── src/
│   │   ├── app/       # App Router (Pages & API)
│   │   ├── components/ # Reusable UI Components
│   │   ├── services/   # API Handlers
│   │   └── hooks/      # Custom React Hooks
├── backend/           # Express Server
│   ├── src/
│   │   ├── models/     # Mongoose Schemas
│   │   ├── controllers/# Route Logic
│   │   ├── routes/     # API Endpoints
│   │   └── middlewares/# Auth & validation
└── README.md          # Project Documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB (Atlas or Local)
- Cloudinary Account
- SMTP Service (Gmail or other)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Charted-Bus
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder (refer to `.env.example`) and add your credentials.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend` folder (refer to `.env.example`) and add your API URL and keys.

---

## 🚦 Running the Project

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 📄 License
This project is private. Unauthorized copying or distribution is prohibited.
