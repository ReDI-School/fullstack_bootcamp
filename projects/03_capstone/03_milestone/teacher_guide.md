# **Milestone 3 - Teacher Guide: SSH Basics & Command Line Essentials**

## **Lesson Overview**

In this Milestone, students will learn the fundamentals of **SSH (Secure Shell)** and how it is used for remote server access, secure file transfer, and deployment. The focus will be on:

- **Understanding SSH and its importance**
- **Basic SSH commands and remote access**
- **Using SSH keys for authentication**
- **Secure file transfer with SCP and SFTP**
- **SSH tunneling for database connections**
- **Using SSH in Next.js deployments**
- **Best practices for securing SSH connections**

---

## **1️⃣ Key Learning Objectives**

✅ **Understand what SSH is and how it works**  
✅ **Establish SSH connections to remote servers**  
✅ **Generate and manage SSH keys for authentication**  
✅ **Use SCP and SFTP for secure file transfers**  
✅ **Configure SSH for GitHub authentication**  
✅ **Use SSH tunnels for database access and server deployments**

---

## **2️⃣ How to Teach This Topic**

### **🔹 Start with a Real-World Scenario**

Begin by asking students:

- _"How do we securely access a remote server or deploy a web application?"_
- _"What are the risks of using simple username-password authentication?"_

Explain that SSH **encrypts communication** between the client and the server, making remote access more secure.

### **🔹 Live Demonstration**

Encourage students to **open a terminal** and check for SSH installation:

```sh
ssh -V
```

Then, demonstrate connecting to a remote server:

```sh
ssh username@server_ip
```

Show them how SSH prevents **man-in-the-middle attacks** by prompting for host verification.

---

## **3️⃣ Key Concepts to Cover**

### **🔹 SSH Basics**

- What is SSH, and why is it important?
- How does SSH encryption work?
- Differences between **SSH, Telnet, and FTP**.

### **🔹 SSH Key Authentication**

- Why use SSH keys instead of passwords?
- Generating SSH keys:
  ```sh
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ```
- Copying the public key to the server:
  ```sh
  ssh-copy-id user@server_ip
  ```

### **🔹 Secure File Transfer**

- Using SCP to copy files between local and remote systems:
  ```sh
  scp file.txt user@server_ip:/home/user/
  ```
- Using SFTP for interactive file transfers:
  ```sh
  sftp user@server_ip
  ```

### **🔹 SSH Tunneling**

Explain how SSH tunneling works and its use cases:

```sh
ssh -L 27017:localhost:27017 user@server_ip
```

This is useful when connecting to a **MongoDB database on a remote server**.

### **🔹 SSH & GitHub Authentication**

- How to set up SSH authentication for GitHub
- Configuring `.ssh/config` for multiple GitHub accounts

### **🔹 Deploying Next.js with SSH**

1️⃣ Connect to the remote server:

```sh
ssh user@server_ip
```

2️⃣ Upload project files:

```sh
scp -r my-next-app user@server_ip:/var/www/
```

3️⃣ Start the Next.js application:

```sh
cd /var/www/my-next-app
npm install
npm run build
npm start
```

---

## **4️⃣ Common Issues & Debugging**

| Issue                               | Cause & Solution                                             |
| ----------------------------------- | ------------------------------------------------------------ |
| **Permission denied** 🔐            | Ensure correct file permissions (`chmod 600 ~/.ssh/id_rsa`). |
| **Host key verification failed** ❌ | Remove old keys from `~/.ssh/known_hosts`.                   |
| **Connection timeout** ⏳           | Check firewall settings on the remote server.                |

Encourage students to **troubleshoot step-by-step** and check logs:

```sh
tail -f /var/log/auth.log
```

---

## **5️⃣ Suggested Classroom Activities**

🎯 **Activity 1: Generate SSH Keys & Connect to a Test Server**  
✅ Students generate SSH keys and use them to connect to a cloud instance (AWS, DigitalOcean, etc.).

🎯 **Activity 2: File Transfer Challenge**  
✅ Students practice **uploading and downloading** files using SCP & SFTP.

🎯 **Activity 3: SSH Tunneling to MongoDB**  
✅ Students configure SSH tunneling and **connect a local MongoDB client** to a remote database.

🎯 **Activity 4: Deploying a Next.js Project**  
✅ Students **upload and run a Next.js application** on a remote Linux server.

---

## **6️⃣ Recap & Summary**

1️⃣ **SSH provides secure communication between a client and a remote server.**  
2️⃣ **Using SSH keys is more secure than using passwords.**  
3️⃣ **SCP & SFTP allow secure file transfers.**  
4️⃣ **SSH tunneling helps connect to remote databases securely.**  
5️⃣ **SSH is essential for deploying Next.js apps to production servers.**

---

## **7️⃣ Next Steps**

📌 Encourage students to **set up SSH authentication** for their personal projects.  
📌 Have students **deploy their Next.js projects** on a remote server using SSH.  
📌 Explore advanced SSH features like **port forwarding and automated scripts**.
