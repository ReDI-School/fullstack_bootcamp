# Welcome to the Fullstack bootcamp - JS Recap Week

## Learning Goals

1. Core JavaScript fundamentals.
   - Expressions, operators, statements
   - Data types, variables, arrays, functions
   - Array methods and basic control flow
2. JavaScript for web apps.
   - Callbacks and promises
   - Fetch and asynchronous programming
   - DOM manipulation and event handling
   - localStorage for persistence
3. A bridge toward React.
   - Thinking in state and render cycles
   - Building small interactive apps

As a **project** we will be building small JavaScript-based applications, especially a task manager or todo-style app, where students can practice adding items, updating state, manipulating the DOM, and storing data locally.

This file is a teacher-facing recap. It stays close to [the original Milestone 0 README](README.md) so the material remains recognizable and easy to teach from.

---

## Table of contents

- [JavaScript basics](#javascript-basics)
- [Functions](#functions)
- [Arrays and array methods](#arrays-and-array-methods)
- [Callbacks and promises](#callbacks-and-promises)
- [Fetch](#fetch)
- [DOM manipulation](#dom-manipulation)
- [localStorage](#localstorage)
- [Modular JavaScript](#modular-javascript)
- [Project framing](#project-framing)
- [READ THE DOCS! 🤓](#read-the-docs)

---

# JavaScript basics

## Project skeleton

<!-- **From original README** -->

Let's create the skeleton of a project. What do we need?

<details>
<summary>Solution</summary>
We need at least an HTML file, but also having CSS and JS would be good.

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

</details>

[Back to top](#table-of-contents)

---

## Data types

<!-- **From original README** -->

Let's do a recap of some JavaScript essentials.

What data types do we have in JavaScript?

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

[Back to top](#table-of-contents)

---

## Operators

<!-- **From original README** -->

We can also combine values using operators.

```js
1 + 1;
3.14 * 10;
3 >= 5;
"hi" + " " + "class!";
```

[Back to top](#table-of-contents)

---

## Variables

<!-- **From original README** -->

How do we declare variables?

```js
// let for variables that can be reassigned
let counter = 0;

// const for values that won't change
const API_URL = "https://api.example.com";
```

[Back to top](#table-of-contents)

---

## Functions

<!-- **From original README** -->

Modern JavaScript provides multiple ways to create functions:

```js
// Function Declaration
function addNumbers(a, b) {
  return a + b;
}

// Method in an object
const calculator = {
  add: function (a, b) {
    return a + b;
  },
};

// Arrow Function, shorter way to create functions
const add = (a, b) => a + b;
```

Teacher note: this is a useful place to explain the different ways to define functions and when each form appears in real code.

[Back to top](#table-of-contents)

---

## Arrays

<!-- **From original README** -->

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

[Back to top](#table-of-contents)

---

## Array methods

<!-- **From original README** -->

```js
const tasks = [
  { id: 1, title: "Learn JavaScript", completed: false },
  { id: 2, title: "Build Project", completed: true },
  { id: 3, title: "Write Tests", completed: false },
];

// Filter: Get incomplete tasks
const incompleteTasks = tasks.filter((task) => !task.completed);

// Map: Get all titles
const titles = tasks.map((task) => task.title);

// Find: Get specific task
const task = tasks.find((task) => task.id === 2);

// Some: Check if any task is completed
const hasCompleted = tasks.some((task) => task.completed);
```

You can read more about these in the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#instance_methods).

[Back to top](#table-of-contents)

---

## Basic control flow

<!-- **[additional code]** -->

```js
const age = 17;

if (age >= 18) {
  console.log("Can drive!");
} else if (age >= 16) {
  console.log("Can get learner's permit");
} else {
  console.log("Too young");
}

for (let i = 0; i < 3; i++) {
  console.log(i);
}

for (const student of ["Anna", "Lucas", "Mina"]) {
  console.log(student);
}
```

[Back to top](#table-of-contents)

---

# JavaScript for web apps

## Callbacks

<!-- **From original README** -->

> A callback is a function passed as an argument to another function.

The function receiving the callback can execute it later.

```js
function myFunction(action) {
  console.log("Hello");
  action();
}

myFunction(function () {
  console.log("World");
});
// Hello
// World
```

- `myFunction` takes a callback as an argument.
- It logs "Hello" and then calls the callback function.
- The callback here is anonymous, meaning it has no name.

Anonymous functions are very common in JavaScript:

- Event listeners (`addEventListener()`)
- Promises, for example with `fetch()` (`.then()`)
- Array methods (`forEach()`, `map()`, `filter()`)

[Back to top](#table-of-contents)

---

## Promises

<!-- **From original README** -->

A Promise object represents the eventual completion or failure of an asynchronous operation and its resulting value.

Promises provide a way to handle asynchronous operations in JavaScript.
A Promise represents a value that may not be available yet when it’s created.

### Promise states

- **Pending** – initial state, neither fulfilled nor rejected
- **Fulfilled** – operation completed successfully
- **Rejected** – operation failed

### Pseudocode example

```text
pending → waiting...
    ↓
fulfilled ✅ → .then()
or
rejected ❌ → .catch()
```

### Code example

```js
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Why Promises?

JavaScript is single-threaded — long-running tasks can block all other code.

> Promises prevent blocking of the main thread.

- The main thread executes your JavaScript code.
- Blocking happens when a long task prevents other code from running.

We want our program to stay responsive while waiting for a Promise to complete.

> Advantage: JS stays smooth and responsive while fetch runs in the background.

[Back to top](#table-of-contents)

---

## Fetch

<!-- **From original README** -->

A good example of Promise is the `fetch` method of JavaScript, which also returns a Promise.

- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch

Promises are used to handle time-consuming tasks:

- Fetching data from an API
- Reading files
- Performing delayed computations

[Back to top](#table-of-contents)

---

## DOM manipulation

<!-- **From original README** -->

The Document Object Model (DOM) is how JavaScript interacts with HTML.

```js
// Selecting elements
const button = document.getElementById("myButton");
const items = document.querySelectorAll(".item");

// Creating elements
const newDiv = document.createElement("div");
newDiv.textContent = "Hello, World!";
document.body.appendChild(newDiv);

// Event handling
button.onclick = function () {
  console.log("Button clicked!");
};
```

Teacher note: explain DOM manipulation as the way JavaScript reads and changes the page.

[Back to top](#table-of-contents)

---

## localStorage

<!-- **Comparable to original - improved** -->

Browser localStorage provides a way to store data so that when the user refreshes or re-opens the webpage, the data is still there.

Important notes:

- It only works on the same browser on the same device.
- If you open the page in another browser or on another device, you will not see the same data.

```js
// save value in local storage
localStorage.setItem("username", "JohnDoe");

// get value from local storage
const username = localStorage.getItem("username");
if (username !== null) {
  console.log(username);
} else {
  console.log("There is no value in local storage!");
}

// delete something
localStorage.removeItem("username");
```

localStorage can only store strings.
If we want to save objects or arrays, we must convert to and from a string using `JSON.stringify` and `JSON.parse`.

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

Teacher note: this is the persistence building block for the counter and todo app.

[Back to top](#table-of-contents)

---

## Counter exercise

<!-- **Comparable to original / reworked for teaching flow** -->

Using what we just discussed, implement a simple counter with:

- Increment
- Decrement
- Reset

Suggested HTML:

```html
<p id="value">0</p>
<button id="inc">Increment</button>
<button id="dec">Decrement</button>
<button id="reset">Reset</button>
```

Suggested JS:

```js
const valueElement = document.getElementById("value");
const incButton = document.getElementById("inc");
const decButton = document.getElementById("dec");
const resetButton = document.getElementById("reset");

let count = 0;

function render() {
  valueElement.textContent = count;
}

incButton.onclick = () => {
  count++;
  render();
};

decButton.onclick = () => {
  count--;
  render();
};

resetButton.onclick = () => {
  count = 0;
  render();
};

render();
```

Question for discussion:
What happens to the counter value when we refresh the page?
How can we make it stay the same after a refresh?

[Back to top](#table-of-contents)

---

## Persistent counter

<!-- **Comparable to original - improved** -->

Extend the counter so the value survives a page refresh.

```js
const savedCount = localStorage.getItem("count");
let count = savedCount !== null ? Number(savedCount) : 0;

function saveCounter() {
  localStorage.setItem("count", String(count));
}

function render() {
  valueElement.textContent = count;
}

incButton.onclick = () => {
  count++;
  render();
  saveCounter();
};

decButton.onclick = () => {
  count--;
  render();
  saveCounter();
};

resetButton.onclick = () => {
  count = 0;
  render();
  localStorage.removeItem("count");
};

render();
```

[Back to top](#table-of-contents)

---

## Modular JavaScript

<!-- **From original README** -->

Breaking code into modules improves maintainability. We can have separate files responsible for different pieces of functionality.

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

This helps us make the code more isolated, coherent, and easy to change.

[Back to top](#table-of-contents)

---

## Project framing

<!-- **From original README** -->

As a project we will be creating a task management application, with the features:

- Adding tasks
- Removing tasks
- Marking them as complete

**Bonus**

- Add task categories or tags
- Implement task priority levels
- Add task filtering and sorting
- Create a task deadline countdown

[Back to top](#table-of-contents)

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

[Back to top](#table-of-contents)

---


