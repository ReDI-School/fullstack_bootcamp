# Twitter Clone - Next.js Project

A modern Twitter clone built with Next.js, MongoDB, and Tailwind CSS.
FOr REDI-SCHOOL Learning and Understanding only !

## Features

- 📝 Display tweets in a responsive grid layout
- 💾 MongoDB database integration with Mongoose ORM
- 🐳 Docker Compose setup for local development
- 🎨 Tailwind CSS styling with dark mode support
- 🔄 Automatic API fallback (fetch from external API if DB is empty)

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
│   └── Tweet.js               # Mongoose Tweet schema
├── docker-compose.yml         # Docker services configuration
└── .env.local                 # Environment variables
```

## API Endpoints

### GET `/api/tweets`
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
- **MongoDB 8** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Tailwind CSS 4** - Utility-first CSS framework
- **Docker** - Containerization for MongoDB

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
