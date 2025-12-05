# Twitter Clone - Next.js Project

A modern Twitter clone built with Next.js, MongoDB, and Tailwind CSS.

## Features

- 📝 Display tweets in a responsive grid layout
- 🔐 **User authentication with NextAuth.js**
- 👥 **User registration with bcrypt password hashing**
- 💾 MongoDB database integration with Mongoose ORM
- 🐳 Docker Compose setup for local development
- 🎨 Tailwind CSS styling with dark mode support
- 🔄 Automatic fallback (mock users when DB is not configured)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Docker Desktop installed (for MongoDB)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start MongoDB with Docker

Run MongoDB and Mongo Express (web UI) in Docker:

```bash
npm run docker:dev
```

This will start:
- **MongoDB** on `localhost:27017`
- **Mongo Express** (web UI) on `http://localhost:8081`

To stop the containers: Press `Ctrl+C` in the terminal

To run in background:
```bash
npm run docker:dev:bg
```

To stop background containers:
```bash
npm run docker:down
```

To clean up (remove volumes and data):
```bash
npm run docker:clean
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

The project uses `.env.local` for configuration:

```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/twitter-clone?authSource=admin
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── tweets/
│   │       └── route.js       # API endpoints for tweets
│   ├── tweet/
│   │   └── [id]/
│   │       └── page.jsx       # Individual tweet page
│   ├── layout.jsx             # Root layout
│   └── page.jsx               # Home page
├── components/
│   ├── Header.jsx             # Navigation header
│   ├── Footer.jsx             # Footer with links
│   └── TweetCard.jsx          # Tweet display component
├── lib/
│   └── db.js                  # Database connection utility
├── models/
│   ├── Tweet.js               # Mongoose Tweet schema
│   ├── User.js                # Mongoose User schema
│   ├── Comment.js             # Mongoose Comment schema
│   └── Reaction.js            # Mongoose Reaction schema
├── docker-compose.yml         # Docker services configuration
└── .env.local                 # Environment variables
```

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user (requires database).

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST `/api/auth/[...nextauth]`
NextAuth.js authentication endpoint. Handles login/logout with credentials.

**Demo Users (mock mode):**
- Username: `john` / Password: `password123`
- Username: `jane` / Password: `password123`
- Username: `demo` / Password: `demo`

**Database mode:** Users are authenticated against MongoDB with bcrypt-hashed passwords.

### Tweets

#### GET `/api/tweets`
Fetches tweets from database. If empty, fetches from external API and saves to DB.

### POST `/api/tweets`
Creates a new tweet.

```json
{
  "title": "My tweet title",
  "body": "Tweet content here",
  "tags": ["nextjs", "mongodb"],
  "userId": 1
}
```

### DELETE `/api/tweets`
Deletes all tweets (useful for testing).

## MongoDB Management

Access Mongo Express at `http://localhost:8081` to:
- View collections
- Browse tweet documents
- Run queries
- Manage the database

## Technologies Used

- **Next.js 16** - React framework with App Router
- **NextAuth.js** - Authentication for Next.js
- **MongoDB 8** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Docker** - Containerization for MongoDB

## Authentication System

This project implements a **dual-mode authentication system**:

### Without Database (Demo Mode)
- Uses hardcoded mock users
- Plain text password comparison
- Perfect for testing without MongoDB

### With Database (Production Mode)
- User data stored in MongoDB
- Passwords hashed with bcrypt (10 salt rounds)
- Secure authentication with NextAuth.js
- User registration via `/register` page

### Security Features
- ✅ Passwords never stored in plain text
- ✅ bcrypt hashing with salt rounds
- ✅ Mongoose schema validation
- ✅ Unique username and email constraints
- ✅ Password minimum length (6 characters)
- ✅ Session management with JWT tokens

### Testing Registration

1. Start MongoDB: `npm run docker:dev`
2. Seed database: `npm run db:seed`
3. Visit `/register` to create a new account
4. Login with your new credentials at `/login`

**Note:** The seed script creates 3 demo users with hashed passwords (john, jane, demo).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
