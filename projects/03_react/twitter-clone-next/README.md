# Twitter Clone

A simplified Twitter clone implementation using Next.js, Tailwind CSS, and React. This project demonstrates how to build a social media platform with modern web technologies while maintaining a clean and responsive design.

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

> Then open it: http://localhost:3000

## 🚀 Features

### Authentication

- Simple username-based authentication
- Persistent login state using localStorage
- Custom login/logout flow
- Protected features for authenticated users

### Tweet Functionality

- Create and publish tweets
- Real-time tweet input with expandable textarea
- Character limit validation
- Timeline view of all tweets
- User-specific tweet feeds
- Timestamp display for tweets

### User Interface

- Twitter-like dark theme
- Responsive design for all screen sizes
- Interactive hover states and transitions
- Split-screen login page
- Fixed navigation bar with blur effect
- Profile avatars (placeholders)
- Tweet interaction buttons (comment, retweet, like)

### Profile Pages

- User-specific profile pages
- Tweet count display
- Filtered tweet view by user
- Profile navigation

## 💻 Technical Implementation

### Frontend Technologies

- **Next.js**: React framework for production
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hooks**: For state management and side effects
- **CSS Variables**: For theme consistency
- **CSS Grid & Flexbox**: For responsive layouts

### Components Structure

- `Layout`: Main wrapper component with navigation
- `LoginForm`: Handles user authentication
- `TweetInput`: Tweet creation interface
- `TweetList`: Displays tweet feed
- `TweetItem`: Individual tweet display
- `Profile`: User profile page

### Styling Highlights with Tailwind

- Custom color scheme using CSS variables
- Responsive design using Tailwind breakpoints
- Dark mode implementation
- Custom button styles
- Interactive hover states
- Smooth transitions
- Blur effects for fixed navigation

### Pages

- Home page (`/`)
- Profile page (`/profile`)
- Tweet detail page (`/tweet`)

```

```
