# MineHR - Today's Progress Report & Commit Log

**Date:** February 25, 2026
**Major Milestone:** Converted the static React UI into a fully dynamic Full-Stack Application.

## 🏗️ 1. Database & Backend Architecture
*   **Initialized Prisma ORM:** Configured Prisma to communicate with a local MySQL database instance.
*   **Database Schema Design (`schema.prisma`):** Created relational SQL tables for:
    *   `User` (Authentication and Role mapping)
    *   `Company` (Global business settings)
    *   `Branch` (Office locations)
    *   `Department` (Linked strictly to respective Branches)
*   **Node.js Express API:** Built robust backend API endpoints handling GET, POST, PUT, and DELETE operations running on Port `5001`.

## 🔐 2. Integrated Security & Authentication
*   **JWT System:** Implemented JSON Web Tokens so API endpoints reject unauthorized traffic.
*   **Bcrypt Password Hashing:** User passwords are now scrambled before hitting the database, securing against breaches.
*   **Login Flow (`Login.tsx` & `useAuthStore.ts`):** 
    *   Connected the React login form sequentially to the `/api/auth/login` Node endpoint.
    *   Built an interactive **"Create First Admin Account"** form directly into the Login UI.
    *   Removed hardcoded username logic; the Header now safely displays the actively authenticated user's name from live state.
    *   Fixed a critical React Router Boundary exception causing the application to render a blank white screen upon hook failures.

## 🏢 3. Dynamic Company Structure System
*   **Company Settings (`CompanySetup.tsx`):** UI is now wired to `GET /api/company` on load, and `PUT /api/company` on save.
*   **Branch Management (`Branches.tsx`):** 
    *   Wiped out hardcoded arrays.
    *   Added `POST /api/branches` to save new physical locations dynamically.
    *   Added absolute SQL deletion using `DELETE /api/branches/:id`.
*   **Department Management (`Departments.tsx`):**
    *   Departments now correctly query their parent Branches preventing rogue data.
    *   Enabled multi-batch department insertions into the database.

## 📊 4. Live Dashboard Analytics
*   **Backend Aggregation:** Created `/api/dashboard/stats` which queries deep counts across all SQL tables.
*   **Frontend Data Mapping:** Mapped the Total Employees, Present Today, Active Branches, and Active Departments overview cards to the live MySQL metrics.
*   **Recent Activity Feed:** The Recent Activity log accurately dynamically reflects historical payloads mapped via the backend.

## 📦 5. Next Steps Ready
*   Constructed guides (`LOGIN_GUIDE.md`, `HOW_TO_RUN.md`, `VERCEL_DEPLOYMENT_GUIDE.md`) to map out the application's operational layout, deployment constraints, and future Cloud hosting architectural plans.
