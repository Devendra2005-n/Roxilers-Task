# Neon Rated Store

![Neon Rated Store Banner](https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg)

A modern, cinematic store management and rating platform. The application provides role-based access for system administrators, store owners, and regular users to manage and rate stores dynamically.

## 🌟 Key Features

* **Role-Based Access Control (RBAC)**: Secure access using JWT authentication for Admin, Store Owner, and Normal User roles.
* **Cinematic UI/UX**: Built with React and Framer Motion, featuring glass-morphism panels and dynamic video backgrounds.
* **Store Management**: Admins and Store Owners can efficiently manage stores and users with real-time feedback.
* **Rating System**: Normal users can submit and view 1-5 star ratings for stores across the platform.

## 🛠 Tech Stack

**Frontend**: React, Vite, TypeScript, React Router, Framer Motion, Axios.
**Backend**: NestJS, TypeORM, PostgreSQL, JWT Authentication, Bcrypt.

---

## ⚙️ Workflow & How to Use

The application operates on a 3-tier user system:

1. **Platform Administrator**: Logs into the Admin Dashboard. Has full CRUD capabilities to manage all users, edit details, manage all stores, and assign specific store owners to stores.
2. **Store Owner**: Logs into the Owner Dashboard. Can view and manage the stores assigned to them, and review user ratings.
3. **Normal User**: Logs into the User Dashboard. Can browse the list of available stores, sort them, and submit ratings from 1 to 5.

---

## 🔐 Demo Credentials

The database is pre-seeded with the following accounts for testing:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@storerating.local` | `Admin@1234` |
| **Owner** | `owner@storerating.local` | `Owner@1234` |
| **Normal User** | `user@storerating.local` | `User@1234` |

---

## 🚀 Getting Started

### 1. Database Setup
Ensure you have PostgreSQL running. Create a database for the project (e.g., `store_rating_db`).

### 2. Backend Setup
Navigate to the `backend` directory, install dependencies, and setup your `.env` file based on `.env.example`.

```bash
cd backend
npm install
cp .env.example .env
```

*Update your `.env` file with your PostgreSQL connection string.*

To start the backend server in development mode:
```bash
npm run start:dev
```

*(Note: TypeORM will automatically synchronize your schema and seed the initial mock data).*

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory, install dependencies, and setup your environment file.

```bash
cd frontend
npm install
cp .env.example .env
```

To start the frontend development server:
```bash
npm run dev
```

The application will now be running at `http://localhost:5173`.

---

## 📸 Screenshots & Video Background
The project uses a high-quality cinematic video background on the Login page to elevate the user experience. You can easily customize this video by replacing `h2.mp4` in the `frontend/public/` folder, or by modifying the `<source src="/h2.mp4" />` tag inside `Login.tsx`.
