# Project 2: Twitter Clone with Next.js

Welcome to your second project in the Full Stack Bootcamp! Over the next three weeks, you'll build a Twitter Clone using Next.js with App Router. This project will help you master server-side rendering, dynamic routing, and modern UI development.

## 🎯 Project Overview

You'll create a Twitter Clone that includes:
- Dynamic feed of tweets with server-side rendering
- Individual tweet pages with dynamic routing
- Responsive design using Tailwind CSS
- Clean, maintainable code structure using Next.js App Router

## 📅 Project Milestones

### Milestone 1: Next.js Setup & Basic Features
- Set up Next.js project with App Router
- Create file-based routing structure
- Implement server-side data fetching
- Build basic tweet feed component

### Milestone 2: UI Enhancement with Tailwind
- Integrate Tailwind CSS
- Style tweet cards and layout
- Create responsive navigation
- Implement mobile-first design

### Milestone 3: Advanced Features
- Add dynamic routing for individual tweets
- Implement API integration
- Add authentication state management
- Create protected routes

## 🛠️ Technical Requirements

### Required Technologies
- Next.js with App Router
- Tailwind CSS
- Server Components
- Git & GitHub

### Development Environment
- VS Code (recommended)
- Node.js 18+
- npm or yarn

## 📂 Project Structure
```
twitter-clone/
├── app/
│   ├── layout.js        # Global layout
│   ├── page.js          # Homepage with feed
│   ├── tweet/
│   │   ├── [id]/        # Dynamic tweet routes
│   │   │   ├── page.js
├── components/          # Reusable components
│   ├── Header.js        
│   ├── TweetCard.js
│   ├── Sidebar.js
├── styles/             # Global styles
│   ├── globals.css
```

## 🎓 Learning Objectives

Through this project, you'll learn:
- Next.js App Router and file-based routing
- Server Components and data fetching
- Dynamic routing with Next.js
- Tailwind CSS for responsive design
- Authentication and protected routes

## 🚀 Getting Started

1. Create a new Next.js project:
   ```bash
   npx create-next-app@latest twitter-clone
   cd twitter-clone
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Project Requirements

### Required Features

#### Tweet Feed
- Server-side rendered feed of tweets
- Dynamic tweet cards with user info and content
- Proper loading and error states

#### Individual Tweet Pages
- Dynamic routing for each tweet (`/tweet/[id]`)
- Fetch and display individual tweet data
- Navigation between feed and tweet pages

#### UI/UX
- Responsive layout using Tailwind CSS
- Mobile-first design
- Loading states for data fetching
- Error handling for failed requests

## 💡 Implementation Steps

### Week 1: Next.js Fundamentals
- [x] Set up Next.js with App Router
- [x] Create basic page structure
- [x] Implement server-side data fetching
- [x] Build tweet feed component

### Week 2: Styling & UI
- [x] Set up Tailwind CSS
- [x] Style tweet cards
- [x] Create responsive layout
- [x] Add navigation components

### Week 3: Advanced Features
- [x] Implement dynamic routing
- [x] Add API integration
- [x] Create loading states
- [x] Handle errors gracefully

## 🧪 Testing Your Implementation

For each feature, verify:
- Does server-side rendering work correctly?
- Are dynamic routes functioning properly?
- Is the UI responsive on all devices?
- Are loading and error states handled appropriately?

## 📚 Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- Course materials in your student portal

## 🆘 Getting Help

- Use the project Slack channel for questions
- Attend weekly coaching sessions
- Check the course materials and documentation
- Ask your peers for code review

## ✅ Evaluation Criteria

Your project will be evaluated based on:
- Complete implementation of all required features from Milestones 1-3
- Proper use of Next.js App Router and Server Components
- Git commit history and documentation

## 💪 Tips for Success

1. **Master the Fundamentals**: Ensure you understand Next.js App Router basics before moving to advanced features
2. **Test Server-Side Rendering**: Verify your components render correctly on the server
3. **Mobile-First**: Design for mobile devices first, then enhance for larger screens
4. **Commit Regularly**: Make meaningful Git commits as you implement features
5. **Ask Questions**: Use coaching sessions to clarify Next.js concepts

Remember to focus on understanding Server Components and the Next.js App Router - these are key concepts for modern web development. Good luck! 🚀

## Example Tweet Data Structure

```javascript
{
  id: 1,
  user: {
    name: "John Doe",
    username: "@johndoe",
    avatar: "/avatar.jpg"
  },
  content: "Hello, Next.js!",
  timestamp: "2h ago",
  likes: 42,
  retweets: 7
}
```

This structure will help you understand how to organize your tweet components and data fetching. Stay focused and enjoy building! 💻✨