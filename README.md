# Fostride Smart Waste Dashboard

A modern, role-based Smart Waste Management Dashboard built with the MERN stack. It empowers normal users to seamlessly log their waste contributions while allowing administrators to track and manage waste distribution analytics locally and globally.

## Features

### Role-Based Access Control

- **User Role:**
    - Securely sign up and log in.
    - Submit waste disposal entries with quantity and type (`dry`, `wet`, `recyclable`, `hazardous`).
    - Access a personal dashboard displaying total entries, waste distribution metrics, an interactive pie chart, and a table history of past submissions.
- **Admin Role:**
    - View aggregate data and totals composed from all users across the system.
    - Global waste distribution visualized with stunning Chart.js pie charts.
    - See an activity log mapping every submission back to its exact user.
    - Inspect individual users deeply to see their isolated submission history and personalize analytics breakdowns.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS v4, React-Router-Dom, Axios, Chart.js (`react-chartjs-2`), JWT-Decode.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT) for stateless authentication, bcrypt for password hashing.

## Quick Start (Running Locally)

### 1. Starting the Backend

Navigate to the `backend` folder, install the necessary dependencies, configure the environment, and spin up the Express server:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with the following variables:

```
JWTSECRET=your_jwt_secret
DBPASSWORD=your_mongodb_password
```

Start the API:

```bash
nodemon index.js
```

The backend server should now be running on `http://localhost:8080`.

### 2. Starting the Frontend

Navigate to the `frontend` folder and get the Vite dev-server running:

```bash
cd frontend
npm install
npm run dev
```

Open your browser to the URL Vite outputs (e.g. `http://localhost:5173/`).

## Dummy Data for Testing

If you would like to test the application quickly without registering, you can use the following mock credentials:

**For Admin Data Logging:**

- **Username:** Mihir Petkar
- **Password:** Mihir123

**For User Data Logging:**

- **Username:** Soham Kadam
- **Password:** Soham123
