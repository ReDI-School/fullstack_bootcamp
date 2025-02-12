# **Milestone 0: JavaScript Fundamentals – Milestone Guide**

## **Overview**
In Milestone 0, you will refresh your **JavaScript** knowledge and set up your development environment for the Full Stack Bootcamp. You will build a task management application that helps you practice core JavaScript concepts while getting familiar with VS Code, Git, and GitHub.

This milestone is a **task management application**, where you will build features like **adding tasks, marking them complete, and storing them locally**.

---

## **Learning Objectives**
1. **Development Environment Setup**:
   - Setting up VS Code with essential extensions
   - Configuring Git and GitHub
   - Understanding project structure and organization

2. **JavaScript Core Concepts**:
   - Working with arrays and objects
   - DOM manipulation and event handling
   - Using localStorage for data persistence
   - Understanding modern JavaScript features

3. **Version Control**:
   - Basic Git commands and workflow
   - GitHub repository management
   - Creating and managing branches

4. **Project Structure**:
   - Organizing JavaScript code
   - File and folder organization
   - Code documentation and commenting

---

## **Example from Milestone 0 Project: TaskFlow App**

### **Project Setup**

First, set up your development environment:

```sh
# Create project directory and initialize Git
mkdir taskflow-app
cd taskflow-app
git init

# Create project structure
touch index.html
mkdir css js
touch css/style.css js/app.js
touch README.md
```

### **Project Structure**

📂 **Project Structure**
```
/taskflow-app
 ├── index.html
 ├── /css
 │   └── style.css
 ├── /js
 │   └── app.js
 └── README.md
```

### **Task Management Implementation**

The `app.js` file implements core task management functionality:

```javascript
// Task structure
class Task {
  constructor(title, dueDate) {
    this.id = Date.now();
    this.title = title;
    this.completed = false;
    this.dueDate = dueDate;
  }
}

// Task management
class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }

  addTask(title, dueDate) {
    const task = new Task(title, dueDate);
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
```

### **DOM Manipulation Example**

Handle UI updates and user interactions:

```javascript
class TaskUI {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.taskList = document.querySelector('#taskList');
    this.form = document.querySelector('#taskForm');
    
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.renderTasks();
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = document.querySelector('#taskTitle').value;
    const dueDate = document.querySelector('#taskDue').value;
    
    const task = this.taskManager.addTask(title, dueDate);
    this.renderTask(task);
    this.form.reset();
  }

  renderTask(task) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
      <span>${task.dueDate}</span>
      <button onclick="toggleTask(${task.id})">Toggle</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    this.taskList.appendChild(li);
  }
}
```

### **HTML Structure**

Basic HTML structure in `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h1>TaskFlow</h1>
        <form id="taskForm">
            <input type="text" id="taskTitle" placeholder="Task title" required>
            <input type="date" id="taskDue" required>
            <button type="submit">Add Task</button>
        </form>
        <ul id="taskList"></ul>
    </div>
    <script src="js/app.js"></script>
</body>
</html>
```

---

## **Expected Outcome**
By the end of Milestone 0, you should have:
✅ A configured development environment with VS Code, Git, and GitHub  
✅ A working task management application with core features  
✅ Understanding of JavaScript fundamentals and DOM manipulation  
✅ Experience with Git workflow and GitHub  

---

## **Bonus Challenge**
- Add task categories or tags  
- Implement task priority levels  
- Add task filtering and sorting  
- Create a task deadline countdown  

---

## **Resources**
1. [VS Code Download](https://code.visualstudio.com/)
2. [Git Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. [GitHub Getting Started](https://docs.github.com/en/get-started)
4. [JavaScript MDN Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

---

📌 **Next Step → Milestone 1: Introduction to React**