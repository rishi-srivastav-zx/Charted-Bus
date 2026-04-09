# Chartered Bus - Frontend

This is the frontend of the **Chartered Bus** project, built with **Next.js 16** and **Tailwind CSS 4**. It provides a high-performance, interactive user interface for booking luxury charter buses.

## 🚀 Key Features
- **Dynamic Booking Form**: Real-time address suggestions using LocationIQ.
- **Admin Dashboard**: Visual insights with Recharts.
- **Smooth Animations**: Animated transitions with Framer Motion.
- **Responsive Layout**: Optimized for all device sizes.
- **Type Safety**: Prop-types for component validation.

## 🛠️ Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: [Axios](https://axios-http.com/)

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Use the shared [local.env](file:///c:/Users/ACER/Desktop/projects/charter-bus-project/Charted-Bus/local.env) file in the project root or create a local `.env.local` file with the required keys (API URL, LocationIQ, etc.).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Structure
- `src/app`: Page routes and layouts.
- `src/components`: UI components (Navbar, Footer, Booking Form, etc.).
- `src/services`: API communication logic.
- `src/hooks`: Global custom hooks.

## 📜 Development Notes
- Ensure the backend is running at the URL specified in `NEXT_PUBLIC_API_URL`.
- Use `lucide-react` for any additional icons.
- Follow the design system defined in `src/app/globals.css`.
