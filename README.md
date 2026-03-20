# ⚡ TaskFlow

**TaskFlow** is a high-fidelity, modern Task Management Progressive Web App (PWA) designed to look, feel, and perform like a native Android application. It features a dark-themed, animated UI with a focus on speed, accessibility, and smooth micro-interactions.

---

## ✨ Key Features

- **🚀 3-Second Task Entry**: Add tasks instantly using a floating action button (FAB) and an animated bottom sheet with auto-focus.
- **🎨 Modern Dark UI**: Beautiful deep navy backgrounds with vibrant electric blue and purple gradients.
- **✨ Smooth Animations**: 200–300ms transitions, spring-based drawer movements, and celebration effects using Framer Motion and Canvas-Confetti.
- **📱 Native Android Experience**: Installable as a standalone app on Android via Chrome's "Add to Home Screen."
- **👆 Gesture Controls**: 
  - Swipe **Right** to mark a task as complete.
  - Swipe **Left** to delete a task.
- **📊 Progress Tracking**: Real-time daily progress bar and completion percentage.
- **📴 Offline-First**: Fully functional without an internet connection using IndexedDB (Dexie) for local-only persistent storage.
- **🔔 Smart Reminders**: Built-in browser notification system for task alerts.

---

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (PostCSS + @theme)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/)
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **PWA Capabilities**: [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
1. Clone or open the project folder:
   ```bash
   cd taskflow-pwa
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173/`.

---

## 📱 How to Install on Android

1. Host the project online (e.g., using [Vercel](https://vercel.com) or [Netlify](https://netlify.com)).
2. Open the live URL in **Chrome** on your Android device.
3. Tap the **three dots (⋮)** in the top right corner.
4. Select **"Install app"** or **"Add to Home screen"**.
5. Launch **TaskFlow** from your app drawer!

---

## 📂 Project Structure

- `src/db.ts`: IndexedDB schema and database initialization.
- `src/store.ts`: Zustand global state for task CRUD operations.
- `src/App.tsx`: Main UI with Framer Motion animations and task sections.
- `src/index.css`: Tailwind CSS v4 custom theme and global styles.
- `vite.config.ts`: PWA manifest and service worker configuration.

---

## 🔒 Privacy & Data
All data is stored **locally on the device**. No task data is sent to a server, ensuring 100% privacy and lightning-fast performance even without an internet connection.
