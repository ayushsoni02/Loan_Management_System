# FullStack Loan Management System (LMS)

A robust, full-stack Loan Management System designed to handle end-to-end loan lifecycles. Built with a modern, high-contrast monochrome design (inspired by Cal.com) featuring full Dark/Light mode support.

## Features

### **Borrower Journey**
- **Authentication**: Secure JWT-based authentication using `httpOnly` cookies.
- **Eligibility Engine (BRE)**: Real-time Business Rule Engine to validate age and income requirements.
- **Document Upload**: Secure salary slip uploads (PDF/PNG/JPG) using `multer`.
- **Live Loan Configuration**: Interactive sliders for Principal and Tenure with live Simple Interest calculations.
- **Borrower Dashboard**: A personalized view for borrowers to track the real-time status of their active and past applications.

### **Operations Dashboard (Role-Based)**
The executive dashboard is strictly guarded by Role-Based Access Control (RBAC).
- **Sales Module (`sales`)**: View registered leads who have not yet applied for a loan.
- **Sanction Module (`sanction`)**: Review applied loans, view uploaded salary slips, and Approve/Reject applications.
- **Disbursement Module (`disbursement`)**: Transfer funds for sanctioned loans.
- **Collection Module (`collection`)**: Track active loan balances and record UTR payments (preventing duplicates and overpayments). Automatically closes loans when the outstanding balance hits ₹0.

## Tech Stack

### **Frontend**
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Theme**: `next-themes` (Dark/Light mode toggling)
- **Icons & UI**: Lucide React, React Hot Toast

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Security**: `bcryptjs` (password hashing), `jsonwebtoken` (auth)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone <repository-url>
cd FullStack_LMS
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```
Start the backend development server:
```bash
npm run dev
```
*The backend will run on `http://localhost:5001`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```
Start the frontend development server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:3000`.*

---

## Seed Accounts for Testing

The database will automatically seed administrative and executive accounts upon first connection. Use these to test the RBAC features:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@lms.com` | `Password@123` |
| **Sales** | `sales@lms.com` | `Password@123` |
| **Sanction** | `sanction@lms.com` | `Password@123` |
| **Disbursement** | `disbursement@lms.com` | `Password@123` |
| **Collection** | `collection@lms.com` | `Password@123` |

---

## System Architecture & State Machine

Loans strictly follow this state machine enforced by the backend API:
`applied` ➡️ `sanctioned` ➡️ `disbursed` ➡️ `closed`
*(or `applied` ➡️ `rejected`)*

Executive roles cannot bypass statuses (e.g., Disbursement cannot disburse a loan that hasn't been Sanctioned first).

---

## Theme Configuration
The application uses a custom monochrome design system. It defaults to Dark Mode via `next-themes` and relies on Tailwind's `dark:` variant classes to flip high-contrast elements smoothly without hydration flickering. 

