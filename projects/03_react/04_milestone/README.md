# Bonus Milestone: Rebuilding the Application with Next.js

### Objective:

Recreate your Twitter clone application using Next.js to leverage server-side rendering, static site generation, and advanced routing capabilities for enhanced performance and SEO.

### Requirements:

1. **Project Setup:**
    - Create a new Next.js project.
    - Install necessary dependencies including React.
    - Optionally, set up Tailwind CSS for styling.
2. **Pages and Routing:**
    - Use the Next.js file-based routing system to create pages.
    - Create pages for your main components such as the homepage, user profile, and tweet details.
3. **Server-Side Rendering (SSR) and Static Generation:**
    - Implement SSR for dynamic pages such as user profiles and tweet details.
    - Use static generation for more static pages like the homepage or about page.
4. **API Routes:**
    - Set up API routes in Next.js to handle backend logic.
    - Create endpoints for fetching tweets, adding new tweets, and managing user data.
5. **Component Refactoring:**
    - Refactor your existing React components to work within the Next.js framework.
    - Ensure that components are optimized for SSR and static generation where applicable.
6. **SEO Optimization:**
    - Use Next.js features such as the `Head` component to manage metadata for better SEO.
    - Implement proper meta tags, titles, and descriptions for each page.

### Step-by-Step Guide:

### 1. Project Setup

First, set up a new Next.js project by running:

```bash
npx create-next-app twitter-clone-next
cd twitter-clone-next
```

Optionally, install Tailwind CSS for styling:

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```

Configure Tailwind by adding the following to `tailwind.config.js`:

```
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind directives to your CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Pages and Routing

In Next.js, pages are created by adding files to the `pages` directory. For example, to create a homepage and a user profile page:

- Create a `pages/index.js` file for the homepage.
- Create a `pages/profile.js` file for the user profile page.

```jsx
// pages/index.js
import React from 'react';
import TweetInput from '../components/TweetInput';
import TweetList from '../components/TweetList';
import Head from 'next/head';

const HomePage = ({ tweets }) => {
  return (
    <div>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="A Twitter clone built with Next.js" />
      </Head>
      <h1 className="text-3xl font-bold">Twitter Clone</h1>
      <TweetInput />
      <TweetList tweets={tweets} />
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch('<https://api.example.com/tweets>');
  const tweets = await res.json();

  return {
    props: {
      tweets,
    },
  };
}

export default HomePage;

// pages/profile.js
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ProfilePage = ({ user }) => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <div>
      <Head>
        <title>Profile - {user.name}</title>
        <meta name="description" content={`Profile of ${user.name}`} />
      </Head>
      <h1 className="text-2xl font-bold">Profile Page</h1>
      <p>User ID: {userId}</p>
      <p>Name: {user.name}</p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { userId } = context.params;
  const res = await fetch(`https://api.example.com/users/${userId}`);
  const user = await res.json();

  return {
    props: {
      user,
    },
  };
}

export default ProfilePage;
```

### 3. Server-Side Rendering (SSR) and Static Generation

Use `getServerSideProps` for SSR and `getStaticProps` for static generation:

```jsx
// pages/index.js
export async function getStaticProps() {
  const res = await fetch('<https://api.example.com/tweets>');
  const tweets = await res.json();

  return {
    props: {
      tweets,
    },
  };
}

// pages/profile.js
export async function getServerSideProps(context) {
  const { userId } = context.params;
  const res = await fetch(`https://api.example.com/users/${userId}`);
  const user = await res.json();

  return {
    props: {
      user,
    },
  };
}
```

### 4. API Routes

Create API routes in the `pages/api` directory:

```jsx
// pages/api/tweets.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Handle GET request for fetching tweets
  } else if (req.method === 'POST') {
    // Handle POST request for adding a new tweet
  }
}

// pages/api/users/[userId].js
export default function handler(req, res) {
  const { userId } = req.query;
  if (req.method === 'GET') {
    // Handle GET request for fetching user data
  }
}
```

### 5. Component Refactoring

Refactor your React components to work with Next.js. Ensure that they support SSR and static generation where applicable.

```jsx
// components/TweetInput.js
import React, { useState } from 'react';

const TweetInput = () => {
  const [tweet, setTweet] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Post tweet data to API
    await fetch('/api/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: tweet }),
    });
    setTweet('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="What's happening?"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 mt-2">Tweet</button>
    </form>
  );
};

export default TweetInput;
```

### 6. SEO Optimization

Use the `Head` component from `next/head` to manage metadata for better SEO:

```jsx
// pages/index.js
import Head from 'next/head';

const HomePage = ({ tweets }) => {
  return (
    <div>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="A Twitter clone built with Next.js" />
      </Head>
      <h1 className="text-3xl font-bold">Twitter Clone</h1>
      <TweetInput />
      <TweetList tweets={tweets} />
    </div>
  );
};
```

### Submission:

- Complete the Next.js project setup and refactor your components.
- Ensure SSR, static generation, and API routes are implemented as described.
- Test the application to ensure it works seamlessly.
- Submit the final project files for review.

Good luck, and enjoy leveraging the power of Next.js to enhance your Twitter clone application!