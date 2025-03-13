# **Milestone 0: Teacher Guide – JavaScript Fundamentals**

## **Introduction**

This guide helps instructors teach JavaScript fundamentals and development environment setup. The focus is on helping students build a strong foundation before moving into React. By the end of this milestone, students should be comfortable with modern JavaScript concepts and have a properly configured development environment.

---

## **Teaching Objectives**

1. **Development Environment Setup**:
   - Guide students through VS Code installation and configuration
   - Teach basic Git commands and workflow
   - Demonstrate proper project structure and organization

2. **JavaScript Fundamentals**:
   - Review modern JavaScript syntax and features
   - Teach DOM manipulation and event handling
   - Demonstrate data persistence with localStorage

3. **Project Setup**:
   - Help students initialize their first project
   - Show proper file organization
   - Introduce basic debugging techniques

---

## **Classroom Flow**

### **1. Development Environment Setup**

#### **Key Points**:
- Importance of a consistent development environment
- VS Code features that help with JavaScript development
- Basic Git workflow for project management

#### **Demo**:
```bash
# Show Git workflow
git init
git add .
git commit -m "Initial commit"
git branch feature/task-creation
git checkout feature/task-creation
```

#### **Common Issues to Watch For**:
- Git not installed or not configured
- Missing VS Code extensions
- Incorrect Git configuration

#### **Discussion Prompts**:
- Why do we use version control?
- How does VS Code help with JavaScript development?
- What makes a good project structure?

---

### **2. JavaScript Fundamentals**

#### **Key Points**:
- Modern JavaScript features (let/const, arrow functions, destructuring)
- DOM manipulation best practices
- Event handling and bubbling

#### **Live Coding Demo**:
```javascript
// Show modern JavaScript features
const taskManager = {
  tasks: [],

  addTask(title) {
    const task = {
      id: Date.now(),
      title,
      completed: false
    };
    this.tasks.push(task);
    this.saveTasks();
  },

  toggleTask(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  },

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
};
```

#### **Interactive Exercise**:
Have students build a simple counter with:
- Increment/decrement buttons
- Reset functionality
- localStorage persistence

```javascript
// Starter code for students
const counter = {
  value: 0,

  increment() {
    // TODO: Implement increment
  },

  decrement() {
    // TODO: Implement decrement
  }
};
```

---

### **3. DOM Manipulation and Events**

#### **Key Points**:
- Modern DOM selection methods
- Event delegation
- Form handling

#### **Demo**:
```javascript
// Show DOM manipulation and event handling
function setupTaskForm() {
  const form = document.querySelector('#taskForm');
  const taskList = document.querySelector('#taskList');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = form.querySelector('input').value;
    addTask(title);
    form.reset();
  });

  taskList.addEventListener('click', (e) => {
    if (e.target.matches('.toggle-task')) {
      const taskId = parseInt(e.target.dataset.taskId);
      toggleTask(taskId);
    }
  });
}
```

#### **Exercise for Students**:
Build a simple todo list that:
1. Adds tasks to a list
2. Marks tasks as complete
3. Deletes tasks
4. Persists data in localStorage

---

## **Common Mistakes to Address**

1. **JavaScript Basics**:
   - Using var instead of let/const
   - Not understanding scope
   - Incorrect use of this keyword

2. **DOM Manipulation**:
   - Direct manipulation instead of state-based updates
   - Not preventing form default behavior
   - Inefficient event handling

3. **Development Environment**:
   - Unorganized project structure
   - Inconsistent Git commits
   - Not using developer tools for debugging

---

## **Practical Exercises**

### **Exercise 1: Counter Application**
Have students build a counter that:
- Uses event delegation
- Stores state in localStorage
- Has increment/decrement/reset functions

### **Exercise 2: Form Validation**
Create a form that:
- Validates input in real-time
- Shows error messages
- Only enables submit when valid

### **Exercise 3: Task Filter**
Add filtering to the task list:
- Filter by status (all/active/completed)
- Search by task name
- Sort by date/alphabetically

---

## **Debugging Tips**

1. **Common Issues**:
   - Show how to use console.log effectively
   - Demonstrate browser developer tools
   - Explain common error messages

2. **Best Practices**:
   - Write small, testable functions
   - Use descriptive variable names
   - Comment complex logic

---

## **Assessment Criteria**

Students should be able to:
1. Set up a new project with proper structure
2. Use Git for version control
3. Implement basic JavaScript functionality
4. Manipulate the DOM effectively
5. Handle events and form data
6. Store and retrieve data from localStorage
