# Welcome to the Fullstack bootcamp - Milestone 0

### Learning Objectives

1. Development Environment Setup:
   - Setting up VS Code with essential extensions
   - Configuring Git and GitHub
2. Version Control:
   - Basic Git commands and workflow
   - GitHub repository management
   - Creating and managing branches
3. JavaScript Core Concepts:
   - Working with arrays and objects
   - DOM manipulation and event handling
   - Using localStorage for data persistence
   - Understanding modern JavaScript features

As a **project** we will be creating a task management application, where you will build features like adding tasks, marking them complete, and storing them locally.

---

# Development Environment

A development environment is a workspace where you write and manage your code. For our course, we will focus on the following:

### Code Editor

A code editor is a program that allows you to do just that, edit code. Some code editors include many additional functionalities, we usually call these IDEs (integrated development environments) because they allow you to do many stuff without leaving the editor, making your life easier!

For our courses, we use [Visual Studio Code](https://code.visualstudio.com/)

- It supports multiple programming languages
- Has a lot of great and useful plugins
- Integrates well with Git for version control (more about this later)

Do you have VS Code installed? if not, install it!

There are some helpful extensions that we recommend you to install

- Prettier
- ESlint

More in the future!

---

# Version Control

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

---

# Javascript Recap

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
button.onClick = function () {
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

In the next milestone, we'll dive into React and start building more complex applications. The JavaScript fundamentals you've learned here will be essential as we move forward.
