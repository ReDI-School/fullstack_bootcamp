# 1. Milestone: Application Setup and Basic Component Creation

### Objective:

Set up the initial structure of your Twitter clone application using React with Vite. Create basic components and manage state using `useState`.

### Requirements:

1. **Project Setup:**
    - Create a new React project using Vite.
    - Ensure that your project is properly set up with all necessary dependencies.
2. **Basic Components:**
    - Create the following basic components:
        - `App`: The main component that will hold the structure of your application.
        - `TweetInput`: A component for the tweet input form.
        - `TweetList`: A component to display the list of tweets.
        - `Tweet`: A component to represent a single tweet.
3. **State Management:**
    - Use the `useState` hook to manage the state of the tweet input and the list of tweets.
    - Implement functionality to add a new tweet to the list.

### Additional Guidelines:

- Ensure that the components are created using functional components and hooks.
- Use semantic HTML tags where appropriate within your JSX.
- Test the application in the browser to ensure that the tweet input and list functionalities work correctly.

```jsx
// Main file: main.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

// App component: App.jsx
import React, { useState } from 'react';
import TweetInput from './TweetInput';
import TweetList from './TweetList';

const App = () => {
  const [tweets, setTweets] = useState([]);

  const addTweet = (tweet) => {
    setTweets([tweet, ...tweets]);
  };

  return (
    <div>
      <h1>Twitter Clone</h1>
      <TweetInput addTweet={addTweet} />
      <TweetList tweets={tweets} />
    </div>
  );
};

export default App;

// TweetInput component: TweetInput.jsx
import React, { useState } from 'react';

const TweetInput = ({ addTweet }) => {
  const [tweet, setTweet] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTweet(tweet);
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
        <Tweet key={index} content={tweet} />
      ))}
    </ul>
  );
};

export default TweetList;

// Tweet component: Tweet.jsx
import React from 'react';

const Tweet = ({ content }) => {
  return (
    <li>
      <p>{content}</p>
    </li>
  );
};

export default Tweet;

// CSS file: index.css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

div {
  text-align: center;
}

form {
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

```

### Submission:

- Complete the React components and set up the project as described.
- Test the tweet input and list functionalities in the browser to ensure they are working correctly.
- Submit the final project files for review.

Good luck, and have fun developing your Twitter clone application with React and Vite!