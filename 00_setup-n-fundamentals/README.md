# Welcome to the Fullstack Bootcamp - Milestone 0

> you can also find supporting information, links, practical tools and JavaScript Foundations in the [gitbook](https://redi-school-1.gitbook.io/full-stack-bootcamp/) 

### Learning Objectives

1. Setup & Development Environment
   - Installing and configuring VS Code, Node.js, and Git
   - Setting up essential VS Code extensions
2. JavaScript Core Concepts
   - Working with arrays and objects
   - DOM manipulation and event handling
   - Using localStorage for data persistence
   - Understanding modern JavaScript features
3. TypeScript Basics
   - Introduction to TypeScript syntax and types
   - Why TypeScript matters for React and Next.js
4. Version Control & Workflow
   - Basic Git commands and branching
   - Commits, merging, and remote repositories
   - GitHub repository management

### How this milestone is structured

This milestone is spread across two weeks. Each week follows the same rhythm: a first theory session, a second theory/consolidation session, and a practical coaching session in breakout rooms.

| Week | Session | Focus |
|---|---|---|
| 1 | Session 1 (Thu) | Development Environment Setup + JS recap|
| 1 | Session 2 (Mon) | JavaScript Recap |
| 1 | Session 3 (Wed) | Coaching: Setup & JavaScript Practice |
| 2 | Session 1 (Thu) | TypeScript Basics |
| 2 | Session 2 (Mon) | Git & GitHub Workflow |
| 2 | Session 3 (Wed) | Coaching: Git & GitHub Practice |

---

# Week 1 · Session 1 — Development Environment Setup

A development environment is a workspace where you write and manage your code. For our course, we will focus on the following.

### Setup checklist

Before moving on, make sure you have the following installed:

- **Node.js** (needed to run JavaScript outside the browser, and for tooling later on)
- **VS Code** (our code editor)
- **Git** (we'll start using it in Week 2, but it's good to have it installed early)

### Code Editor

A code editor is a program that allows you to do just that, edit code. Some code editors include many additional functionalities, we usually call these IDEs (integrated development environments) because they allow you to do many stuff without leaving the editor, making your life easier!

For our courses, we use [Visual Studio Code](https://code.visualstudio.com/)

- It supports multiple programming languages
- Has a lot of great and useful plugins
- Integrates well with Git for version control (more about this in Week 2)

Do you have VS Code installed? if not, install it!

There are some helpful extensions that we recommend you to install

- Prettier
- ESlint

More in the future!

---

# Week 1 · Session 2 — JavaScript Recap

Ok now create the skeleton of a project. What do we need?

<details>
<summary>Solution</summary>
We need at least an html file, but also having a css and js would be good

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

Let's do a recap of some of javascript essentials.

What data types do we have in Javascript?

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

We can also combine using operators

```js
1 + 1;
3.14 * 10;
3 >= 5;
"hi" + " " + "class!";
```

How do we declare variables?

```js
// let for variables that can be reassigned
let counter = 0;

// const for values that won't change
const API_URL = "https://api.example.com";
```

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

### **Promises in JavaScript?**
  A Promise in JavaScript is a way to handle asynchronous operations.
  It represents the eventual completion (or failure) of a task and allows you to run code when that task is finished.  

- **Throughout this course we will use promises a lot.    
So it is really important to understand it well.**

- A good example of Promise is `fetch` method of javascript which is also returns a promise.
  https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch


- Promises use to handle time consuming tasks.
  - Fetching data from an API
  - Reading files
  - Performing delayed computations
  
```javascript
const myPromise = new Promise((resolve, reject) => {
  // Your async task or condition here
  if (/* success condition */) {
    resolve('Task succeeded!');
  } else {
    reject('Task failed.');
  }
});

//calling a promise
myPromise
  .then(result => console.log(result))
  .catch(error => console.log(error));

```


## DOM Manipulation

The Document Object Model (DOM) is how JavaScript interacts with HTML:

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

### Exercise

Now, using the stuff we talked about, you can take some time to implement a simple counter with:

- Increment
- Decrement
- Reset

---

What happens with the counter value when we refresh the page? How can we make it so that the value remains the same when you refresh?

### Adding persistence

Browser's localStorage provides a way to store data, so that when the user refreshes or re-opens the webpage, the data is still there!

Please note that this only works on the same browser on the same device, so if you try to open you webpage in a different browser, or on a different device, you won't see the same data. We will talk about how to solve this problem in the future 😉

```js
// save value in local storage
localStorage.setItem("username", "JohnDoe");

// get value from local storage
const username = localStorage.getItem("username");
// it is important to check that the value exists! otherwise we will get null
if (username !== null) {
  console.log(username); // Output: "JohnDoe"
} else {
  console.log("There is no value in local storage!");
}

// if we want to delete something, we can use the following
localStorage.removeItem("username");
```

Please note that `localStorage` can only store strings! if we want to save something that is not a string, we have to convert to and from a string. For that we use `JSON.stringify` and `JSON.parse`.

```js
const person = {
  name: "Alan",
  age: 20,
};

// convert to JSON before saving
localStorage.setItem("info", JSON.stringify(person));

// if we want to get the data, it will be a string
const personJSON = localStorage.getItem("info");
let person;
if (personJSON !== null) {
  person = JSON.parse(personJSON);
} else {
  // handle the case where the data is missing
  // you can decide what to do here!
  // maybe set some default value?
  console.log("No person found in local storage");
}
```

### Exercise

Ok now add persistence to your counter, so that the values are persisted when you refresh the page.

---

Ok, now we want to move towards our milestone project, creating a todo app. But for that, we want to introduce some functionalities.

### Exercise

Ok lets assume we have an array of objects

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

Now write a function that takes an array as a parameter, and returns all the people who are old enough to drive (you need be at least 18 years old to drive)

<details>
<summary>Solution</summary>

```js
function getPeopleWhoCanDrive(people) {
  const newArray = [];
  for (let i = 0; i < people.length; i++) {
    const person = people[i];
    if (person.age >= 18) {
      newArray.push(person);
    }
  }
  return newArray;
}

const friendsWhoCanDrive = getPeopleWhoCanDrive(myFriends);
console.log(friendsWhoCanDrive);
```

But actually, we don't need to write all of this code, javascript has some fancy array methods that we can use to achieve the same with less code!

</details>

## Array Methods

Modern JavaScript provides powerful array methods:

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

You can read more about these in the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#instance_methods)

### Modular JavaScript

Breaking code into modules improves maintainability, we can have separate files responsible for different pieces of functionality.

For example

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

---

# Week 1 · Session 3 — Coaching: Setup & JavaScript Practice

This session is for breakout rooms. Use the time to:

- Finish or revisit the counter exercise (with increment, decrement, reset)
- Make sure counter persistence with `localStorage` works correctly
- Work through the array methods exercise (`filter`, `map`, `find`, `some`) with your own data
- Ask questions about anything from the first two sessions before moving into TypeScript and Git next week

---

# Week 2 · Session 1 — TypeScript Basics

### What is TypeScript, and why use it?

TypeScript is a superset of JavaScript that adds **static types**. Any valid JavaScript is also valid TypeScript — but TypeScript lets you describe the *shape* of your data (what a variable, function, or object should look like), and it checks that shape while you're writing code, before you ever run it.

Why it matters for us specifically:

- It catches a whole category of bugs early (e.g. calling a function with the wrong kind of argument)
- It gives much better autocomplete and inline documentation in the editor
- Both **React** and **Next.js** are commonly used with TypeScript, and most real-world codebases you'll encounter use it

Browsers can't run TypeScript directly — it gets compiled ("transpiled") down to plain JavaScript. In React and Next.js projects, this happens automatically as part of the build tooling, so in practice you rarely run the compiler by hand.

### Basic types

```ts
let username: string = "JohnDoe";
let age: number = 25;
let isCompleted: boolean = false;

let scores: number[] = [10, 20, 30];
let names: string[] = ["Alice", "Bob"];
```

If you don't give TypeScript an explicit type, it will often figure it out on its own from the value you assign — this is called **type inference**:

```ts
let city = "Berlin"; // TypeScript infers this is a string
city = 5; // ❌ Error: Type 'number' is not assignable to type 'string'
```

### Typing functions

You can (and should) type both the parameters and the return value of a function:

```ts
function addNumbers(a: number, b: number): number {
  return a + b;
}

const greet = (name: string): string => {
  return `Hello, ${name}!`;
};
```

If a function doesn't return anything, its return type is `void`:

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

### Typing objects: `interface` and `type`

For objects — like the `person` or `task` objects from the JS recap — we describe their shape using an `interface` (or, equivalently, a `type` alias):

```ts
interface Person {
  name: string;
  age: number;
}

const alan: Person = {
  name: "Alan",
  age: 20,
};
```

```ts
type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const task: Task = {
  id: 1,
  title: "Learn TypeScript",
  completed: false,
};
```

`interface` and `type` do very similar jobs. For typing objects (like React component props, which you'll see very soon) `interface` is the more common convention, so that's what we'll mostly use going forward.

### Optional properties and union types

Sometimes a property might not always be present — mark it with a `?`:

```ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string; // optional
}
```

Sometimes a value could be one of a few specific types — this is a **union type**, written with `|`:

```ts
function printId(id: number | string) {
  console.log(`ID: ${id}`);
}

let status: "pending" | "completed" = "pending"; // only these two values are allowed
```

### Typing arrays of objects

Combining what we've seen so far, this is what typing a list of tasks looks like — very close to the `tasks` array from the JS recap:

```ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const tasks: Task[] = [
  { id: 1, title: "Learn TypeScript", completed: false },
  { id: 2, title: "Build Project", completed: true },
];

const incompleteTasks: Task[] = tasks.filter((task) => !task.completed);
```

Notice that `filter`, `map`, `find` and the other array methods from the JS recap work exactly the same way — TypeScript just makes sure `task` inside the callback is always treated as a `Task`, so your editor will warn you if you try to access a property that doesn't exist.

### A quick word on `any`

TypeScript has an escape hatch called `any`, which turns off type checking for that value entirely:

```ts
let data: any = "hello";
data = 5; // no error, but you've lost all the safety TypeScript gives you
```

It can be tempting to reach for `any` when you're not sure what type something is — try to avoid it where possible. It's fine to use occasionally while learning, but relying on it defeats the purpose of using TypeScript in the first place.

### Preview: TypeScript in React

You won't write React components until the next milestone, but this is the shape of what's coming, so the pattern isn't a surprise later — a component's props are typically typed with an `interface`:

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

This is really just the same `interface` + function-typing pattern from above, applied to a component's props instead of a plain object.

### Exercise

Take the `Task` interface above, and:

- Write a typed function `addTask(tasks: Task[], newTask: Task): Task[]` that returns a new array with the task added
- Write a typed function `toggleTask(tasks: Task[], id: number): Task[]` that returns a new array where the task matching `id` has its `completed` value flipped

<details>
<summary>Solution</summary>

```ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function addTask(tasks: Task[], newTask: Task): Task[] {
  return [...tasks, newTask];
}

function toggleTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}
```

</details>

### Exercise

Go back to the `getPeopleWhoCanDrive` function from the JS recap and rewrite it in TypeScript: define a `Person` interface (`name: string`, `age: number`) and add types to the function's parameter and return value.

<details>
<summary>Solution</summary>

```ts
interface Person {
  name: string;
  age: number;
}

function getPeopleWhoCanDrive(people: Person[]): Person[] {
  return people.filter((person) => person.age >= 18);
}
```

</details>

---

# Week 2 · Session 2 — Git & GitHub Workflow

When building projects, especially bigger ones, there are two essential pieces we need to keep in mind:

- Track the changes in our project over time: This allows us to easily understand all the changes being made to the code base, as well as going back to previous versions in case something goes wrong
- Collaborate with other developers: Everyone is working on their own machine with their own code, version control allows us to _merge_ these changes together!

The most popular version control tool is [Git](https://git-scm.com/downloads). Make sure it is installed because we are going to need it. It is possible to use git from inside of VS code.

(live example)

```sh
# initialize a folder to become a git repository
git init .

```

### Branches

Git branches allow you to create separate paths for your code changes, by default a git repository has a "main" or "master" branch. This is where the main code lives.

Then you can create branches where you can do your own changes, when you are finished with your changes, you can merge your changes back to main.

Useful commands:

```sh
# create a branch
git branch <branch-name>

# switch to your new branch
git checkout <branch-name>


# you can also go back to the main branch at any time
git checkout main
```

### Commits

Commits are a way to save snapshots of changes made in your code at different points during its development history.

After doing some changes to some files, you can "stage" them using `git add`

```sh
git add index.html
```

And then we can create a commit that describes the changes

```sh
git commit -m "Added the main entry html file"
```

And now we have our change saved in our new branch.

You can always go back and forth between branches, each branch has their commits, but we can merge branches so that the changes are adopted.

```sh
# go back to main
git checkout main
# merge my new branch into main
git merge <branch-name>
# now the commit is on the main branch!
```

You can achieve all of this from the VS code UI.


How can I push a branch to a remote repository?

```sh
# push your branch
git push origin <branch-name>
# after it is merged, you need to
git pull origin <branch-name>
```

---

# Week 2 · Session 3 — Coaching: Git & GitHub Practice

This session is for breakout rooms. Use the time to:

- Practice creating a branch, committing changes, and merging back to `main`
- Push a branch to a remote repository and open a pull request on GitHub
- Pair up and practice pulling a partner's changes
- Ask any remaining questions before moving on to React in the next milestone

---

# Project

As a project we will be creating a task management application, with the features:

- Adding tasks
- Removing tasks
- Marking them as complete

**Bonus**

- Add task categories or tags
- Implement task priority levels
- Add task filtering and sorting
- Create a task deadline countdown

# Additional Resources

1. [VS Code Documentation](https://code.visualstudio.com/docs)
2. [VS Code Tips and Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
3. [Git Basics Guide](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
4. [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
5. [Chrome DevTools Guide](https://developers.google.com/web/tools/chrome-devtools)
6. [JavaScript MDN Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
7. [Modern JavaScript Tutorial](https://javascript.info/)

# What's Next?

In the next milestone, we'll dive into React and start building more complex applications. The JavaScript and TypeScript fundamentals you've learned here will be essential as we move forward.
