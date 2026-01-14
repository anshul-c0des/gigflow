# 🚀 GigFlow - Full Stack Freelance Marketplace
GigFlow is a mini-freelance marketplace platform that allows clients to post jobs (Gigs) and freelancers to bid on them. It provides a simple yet powerful system for managing gigs, bids, and hiring, allowing users to seamlessly interact within the platform.

## 🌟 Key Features:
- User authentication (sign-up, login, and session management using JWT tokens).
- Role-based access for Owners/Clients and Freelancers.
- Gig management with CRUD operations.
- Freelancers can place bids on gigs and clients can hire them.
- Real-time notifications for hired freelancers.

## ⚙️ Tech Stack
- Frontend: Next.js, Tailwind CSS, Shadcn UI, React Context API, Axios, TypeScript.
- Backend: Node.js, Express.js, JWT (JSON Web Tokens) for authentication, Mongoose (MongoDB ODM), Zod.
- Database: MongoDB (via Mongoose).
- Real-time Updates: Socket.io for real-time hire notifications.

## 🏗️ Core Features
### User Authentication
- Sign-up and Login: Secure user authentication using JWTs and HttpOnly cookies.
- Role Management: Users can act as either Clients (posting jobs) or Freelancers (bidding on jobs).

### Gig Management
- Browse Gigs: Display all available jobs (Gigs).
- Search and Filter: Users can search gigs by title or description.
- Job Posting: Clients can post new jobs with the title, description, and budget.

### Hiring Logic
- Bidding: Freelancers can place bids on gigs with a message and a proposed price.
- Reviewing Bids: Clients can view a list of all bids for their posted gig.
- Hiring: Clients can hire a freelancer by clicking the "Hire" button.
- Atomic Update Logic: The Gig status changes from "open" to "assigned".
- Bid Status: The chosen Bid's status becomes "hired", and all other bids for the same gig are automatically marked as "rejected".

## 📝 API Endpoints
| Category  | Method | Endpoint                       | Description                                      |
|-----------|--------|--------------------------------|--------------------------------------------------|
| **Auth**  | POST   | /api/auth/register             | Register a new user                             |
| **Auth**  | POST   | /api/auth/login                | Login user & set HttpOnly cookie                |
| **Bid**   | GET    | /api/bids/my-bids              | Get all bids placed by the current user (protected) |
| **Bid**   | POST   | /api/bids                       | Create a new bid for a gig (freelancer)         |
| **Bid**   | GET    | /api/bids/gig/:gigId           | Get all bids for a specific gig (owner-only)    |
| **Gig**   | GET    | /api/gigs/my-gigs              | Get all gigs posted by the current user (protected) |
| **Gig**   | GET    | /api/gigs                       | Get all open gigs                               |
| **Gig**   | GET    | /api/gigs/:id                  | Get details of a specific gig (owner-only)      |
| **Gig**   | POST   | /api/gigs                       | Create a new gig post  |
| **Gig**   | PATCH  | /api/gigs/:id                  | Update details of a specific gig (protected, owner only) |
| **Gig**   | POST   | /api/gigs/:gigId/hire          | Hire a freelancer for a specific gig (atomic update) |



## 🗃️ Database Schema
### User Schema
```ts
interface User {
  name: string;
  email: string;
  password: string; // hashed password
  role: 'owner' | 'client';
}
```

### Gig Schema
```ts
interface Gig {
  title: string;
  description: string;
  budget: number;
  owner: string; // refrence to user
  status: 'open' | 'assigned';
}
```

### Bid Schema
```ts
interface Bid {
  gigId: string; // reference to Gig
  freelancer: string; // refrence to freelancer
  amount: number;
  message: string;
  status: 'pending' | 'hired' | 'rejected';
}
```

## Bonus Features
### Real-time Notifications
- Using Socket.io, a real-time notification system has been implemented. When a Client hires a Freelancer, the Freelancer is instantly notified without needing to refresh the page. The notifications are stored per session.

## 🛠️ Setup Instructions
### Frontend
1. Clone the repository:
```bash
git clone <repository_link>
cd gigflow-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000.

### Backend

1. Clone the repository:
```bash
git clone <repository_link>
cd gigflow-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file (refer to .env) and set the necessary environment variables.

4. Run the backend:
```bash
npm run dev
```

The backend API will be available at http://localhost:5000.

### Environment Variables

Create the following .env files for both the frontend and backend.

- Frontend .env:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```
- Backend .env:
```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gigflow
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## 🌍 Live Deployment:

Check out the live demo:

- Backend - Cold Start: [Render](https://gigflow-fi8v.onrender.com)
- Frontend: [Vercel](https://gigflow-sepia.vercel.app)
