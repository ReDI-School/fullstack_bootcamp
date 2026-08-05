# JavaScript Recap Week Handout

## Back to top
- [JavaScript Recap Week Handout](#javascript-recap-week-handout)
  - [Back to top](#back-to-top)
  - [Topics](#topics)
  - [JavaScript basics](#javascript-basics)
    - [Project skeleton](#project-skeleton)
    - [Data types](#data-types)
    - [Operators](#operators)
    - [Variables](#variables)
    - [Functions](#functions)
  - [Functions](#functions-1)
  - [Arrays and array methods](#arrays-and-array-methods)
    - [Arrays](#arrays)
    - [Array methods](#array-methods)
  - [Callbacks and promises](#callbacks-and-promises)
    - [Callbacks](#callbacks)
    - [Promise states](#promise-states)
    - [Promise example](#promise-example)
    - [Promise chain example](#promise-chain-example)
  - [Fetch](#fetch)
  - [DOM manipulation](#dom-manipulation)
    - [Visual DOM example](#visual-dom-example)
  - [localStorage](#localstorage)
    - [Persistent counter](#persistent-counter)
  - [Modular JavaScript](#modular-javascript)
  - [Project framing](#project-framing)
  - [READ THE DOCS! 🤓](#read-the-docs-)
    - [JavaScript references](#javascript-references)
    - [Storage and DOM](#storage-and-dom)
    - [Cheat sheets and quick references](#cheat-sheets-and-quick-references)
    - [Tutorials and videos](#tutorials-and-videos)

---

## Topics

This handout covers the JavaScript recap week for Project 00 / Milestone 0.

- JavaScript fundamentals
- Functions and arrays
- Callbacks and promises
- Fetch and asynchronous programming
- DOM manipulation
- localStorage and persistence
- Array methods
- Modular JavaScript
- Task manager project framing

[Back to top](#back-to-top)

---

## JavaScript basics

### Project skeleton

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="css/styles.css" />
  </head>
  <body>
    <h1>Hello</h1>
    <script src="js/app.js"></script>
  </body>
</html>
```

```css
h1 {
  color: gray;
}
```

```js
console.log("Hello World!");
```

[Back to top](#back-to-top)

### Data types

```js
// numbers
3.14

// strings
"Hi!"

// boolean
true

// undefined & null
undefined
null

// arrays
[1, 2, 3]

// objects
{
  firstName: "Alan",
  lastName: "Turing"
}
```

[Back to top](#back-to-top)

### Operators

```js
1 + 1;
3.14 * 10;
3 >= 5;
"hi" + " " + "class!";
```

[Back to top](#back-to-top)

### Variables

```js
let counter = 0;
const API_URL = "https://api.example.com";
```

[Back to top](#back-to-top)

### Functions

```js
function addNumbers(a, b) {
  return a + b;
}

const calculator = {
  add: function (a, b) {
    return a + b;
  },
};

const add = (a, b) => a + b;
```

[Back to top](#back-to-top)

## Functions

```js
function greet(name) {
  return `Hello, ${name}! 👋`;
}

console.log(greet("Anna"));
console.log(greet("Lucas"));
```

[Back to top](#back-to-top)

## Arrays and array methods

### Arrays

```js
const myFriends = [
  {
    name: "Alice",
    age: 20,
  },
  {
    name: "Bob",
    age: 25,
  },
  {
    name: "Caro",
    age: 15,
  },
];
```

### Array methods

```js
const tasks = [
  { id: 1, title: "Learn JavaScript", completed: false },
  { id: 2, title: "Build Project", completed: true },
  { id: 3, title: "Write Tests", completed: false },
];

const incompleteTasks = tasks.filter((task) => !task.completed);
const titles = tasks.map((task) => task.title);
const task = tasks.find((task) => task.id === 2);
const hasCompleted = tasks.some((task) => task.completed);
```

[Back to top](#back-to-top)

## Callbacks and promises

### Callbacks

```js
function myFunction(action) {
  console.log("Hello");
  action();
}

myFunction(function () {
  console.log("World");
});
```

### Promise states

- **Pending**
- **Fulfilled**
- **Rejected**

### Promise example

```js
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Promise chain example

```js
function fetchStudentData(studentName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${studentName} logged in at ${new Date().toLocaleTimeString()}`);
    }, 1000);
  });
}

fetchStudentData("Anna")
  .then((data) => {
    console.log(data);
    return fetchStudentData("Lucas");
  })
  .then((data) => {
    console.log(data);
    return fetchStudentData("Mina");
  })
  .catch((err) => console.error("Login failed:", err));
```

[Back to top](#back-to-top)

## Fetch

```js
async function fetchUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const users = await response.json();
    console.log(`${users.length} users loaded!`);
    console.log(users[0]);
    return users;
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

fetchUsers();
```

```js
async function createTodo(title) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        completed: false,
      }),
    });

    const newTodo = await response.json();
    console.log('New todo created:', newTodo);
    return newTodo;
  } catch (error) {
    console.error('Create failed:', error);
  }
}

createTodo('Learn fetch API! 🚀');
```

[Back to top](#back-to-top)

## DOM manipulation

```js
const button = document.getElementById("myButton");
const items = document.querySelectorAll(".item");

const newDiv = document.createElement("div");
newDiv.textContent = "Hello, World!";
document.body.appendChild(newDiv);

button.onclick = function () {
  console.log("Button clicked!");
};
```

### Visual DOM example

```js
const redP = document.createElement("p");
redP.textContent = "Hey I'm red!";
redP.style.color = "red";
document.body.append(redP);

const blueH3 = document.createElement("h3");
blueH3.textContent = "I'm a blue h3!";
blueH3.style.color = "blue";
document.body.append(blueH3);

const pinkDiv = document.createElement("div");
pinkDiv.style.backgroundColor = "pink";
pinkDiv.style.border = "1px black solid";

const h1InDiv = document.createElement("h1");
h1InDiv.textContent = "I'm in a div";
pinkDiv.append(h1InDiv);

const pInDiv = document.createElement("p");
pInDiv.textContent = "ME TOO!";
pinkDiv.append(pInDiv);

document.body.append(pinkDiv);
```

[Back to top](#back-to-top)

## localStorage

```js
localStorage.setItem("username", "JohnDoe");

const username = localStorage.getItem("username");
if (username !== null) {
  console.log(username);
} else {
  console.log("There is no value in local storage!");
}

localStorage.removeItem("username");
```

```js
const person = {
  name: "Alan",
  age: 20,
};

localStorage.setItem("info", JSON.stringify(person));

const personJSON = localStorage.getItem("info");
let savedPerson;
if (personJSON !== null) {
  savedPerson = JSON.parse(personJSON);
} else {
  console.log("No person found in local storage");
}
```

### Persistent counter

```js
const savedCount = localStorage.getItem("count");
let count = savedCount !== null ? Number(savedCount) : 0;

function saveCounter() {
  localStorage.setItem("count", String(count));
}
```

[Back to top](#back-to-top)

## Modular JavaScript

```js
// counter.js
export const counter = {
  increment: function () {
    // some code
  },
};

// app.js
import { counter } from "./counter.js";
counter.increment();
```

[Back to top](#back-to-top)

## Project framing

```js
const myFriends = [
  {
    name: "Alice",
    age: 20,
  },
  {
    name: "Bob",
    age: 25,
  },
  {
    name: "Caro",
    age: 15,
  },
];

function getDrivers(friendsArray) {
  return friendsArray.filter((friend) => friend.age >= 18);
}

const drivers = getDrivers(myFriends);
console.log(drivers);
```

[Back to top](#back-to-top)

---

## READ THE DOCS! 🤓

### JavaScript references
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#instance_methods)
- [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)

### Storage and DOM
- [MDN Client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage)
- [MDN DOM scripting introduction](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting)

### Cheat sheets and quick references
- [Git cheat sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [JavaScript.info](https://javascript.info/)

### Tutorials and videos
- [Fetch API tutorial](https://www.youtube.com/watch?v=cz_hsCTQZ-Y)
- [Promises and Fetch API](https://www.youtube.com/watch?v=ddsh9CVb_Nw)
- [DOM, Events, Promises, Async Await, Fetch API](https://www.youtube.com/watch?v=elr_L-BICN4)

[Back to top](#back-to-top)
