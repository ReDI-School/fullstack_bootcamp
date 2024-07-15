# 2. Milestone - Implementing Hooks and Completing Components

### Objective:

Enhance the functionality of your Twitter clone by implementing additional React hooks and completing all necessary components for user interactions.

### Requirements:

1. **Additional Hooks:**
    - Implement `useEffect` to handle side effects, like fetching data from server.
    - Utilize `useRef` for managing focus and other DOM manipulations if necessary.
2. **Completing Components:**
    - Refine existing components and add new ones as needed:
        - `TweetInteractions`: A component to handle likes, retweets, and replies for each tweet.
        - `Profile`: A component to display user profile information.
        - `Sidebar`: A component for navigation and additional features.
        - `Header`: A component for the app’s header including search functionality.
3. **State Management and Context:**
    - Introduce a Context API to manage global state for user data and theme settings.
    - Implement a context provider to wrap the main application and provide state to all components.
4. **Functional Enhancements:**
    - Add functionality to like, retweet, and reply to tweets.
    - Implement a basic search feature to filter tweets based on keywords.
    - Ensure all interactions update the state and reflect immediately in the UI.

### Additional Guidelines:

- Maintain clean and reusable code by breaking down components further if needed.
- Ensure that the new components are well-integrated with the existing ones.
- Test the application thoroughly to ensure all interactions work as expected.

```jsx
// App component: App.jsx
import React, { useState, useEffect, createContext } from 'react';
import TweetInput from './TweetInput';
import TweetList from './TweetList';
import Sidebar from './Sidebar';
import Header from './Header';
import Profile from './Profile';
import './App.css';

export const AppContext = createContext();

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [user, setUser] = useState({ name: 'User', profilePicture: 'user.jpg' });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Fetch initial data from remote server, ex. https://jsonplaceholder.org/posts
    // ...
  }, []);

  const addTweet = (tweet) => {
    setTweets([tweet, ...tweets]);
  };

  return (
    <AppContext.Provider value={{ user, theme, setTheme }}>
      <div className={`app ${theme}`}>
        <Header />
        <Sidebar />
        <main>
          <Profile />
          <TweetInput addTweet={addTweet} />
          <TweetList tweets={tweets} />
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;

// TweetInput component: TweetInput.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from './App';

const TweetInput = ({ addTweet }) => {
  const [tweet, setTweet] = useState('');
  const { user } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTweet({ content: tweet, author: user.name, date: new Date() });
    setTweet('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="What's happening?"
      />
      <button type="submit">Tweet</button>
    </form>
  );
};

export default TweetInput;

// TweetList component: TweetList.jsx
import React from 'react';
import Tweet from './Tweet';

const TweetList = ({ tweets }) => {
  return (
    <ul>
      {tweets.map((tweet, index) => (
        <Tweet key={index} tweet={tweet} />
      ))}
    </ul>
  );
};

export default TweetList;

// Tweet component: Tweet.jsx
import React, { useState } from 'react';
import TweetInteractions from './TweetInteractions';

const Tweet = ({ tweet }) => {
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <li>
      <p>{tweet.content}</p>
      <small>By {tweet.author} on {tweet.date.toString()}</small>
      <TweetInteractions likes={likes} onLike={handleLike} />
    </li>
  );
};

export default Tweet;

// TweetInteractions component: TweetInteractions.jsx
import React from 'react';

const TweetInteractions = ({ likes, onLike }) => {
  return (
    <div>
      <button onClick={onLike}>Like {likes}</button>
      <button>Retweet</button>
      <button>Reply</button>
    </div>
  );
};

export default TweetInteractions;

// Profile component: Profile.jsx
import React, { useContext } from 'react';
import { AppContext } from './App';

const Profile = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="profile">
      <img src={user.profilePicture} alt={user.name} />
      <h2>{user.name}</h2>
    </div>
  );
};

export default Profile;

// Sidebar component: Sidebar.jsx
import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li>Home</li>
          <li>Explore</li>
          <li>Notifications</li>
          <li>Messages</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

// Header component: Header.jsx
import React, { useContext } from 'react';
import { AppContext } from './App';

const Header = () => {
  const { theme, setTheme } = useContext(AppContext);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header>
      <h1>Twitter Clone</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </header>
  );
};

export default Header;

// CSS file: App.css
.app {
  text-align: center;
}

.app.dark {
  background-color: #121212;
  color: white;
}

.profile img {
  border-radius: 50%;
}

.sidebar {
  float: left;
  width: 20%;
}

main {
  margin-left: 20%;
  padding: 20px;
}

form {
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  background: #f9f9f9;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

```

### Submission:

- Complete the React components and enhance the functionality as described.
- Test all interactions, such as liking, retweeting, and replying to tweets, to ensure they work correctly.
- Submit the final project files for review.

Good luck, and enjoy developing your Twitter clone application with enhanced features!