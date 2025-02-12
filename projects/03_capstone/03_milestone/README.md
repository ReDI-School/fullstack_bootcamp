# **Milestone 3: SSH Basics & Deployment**

## **Overview**

In Milestone 3, we explore **SSH (Secure Shell)**, essential shell commands, and how to **deploy a Next.js & MongoDB application** securely using SSH. By the end of this Milestone, you will be able to:

✅ Connect to remote servers using SSH.  
✅ Execute commands and manage files via the terminal.  
✅ Deploy a Next.js & MongoDB application to a production environment.

---

## **1. Understanding SSH**

### **What is SSH?**

SSH (**Secure Shell**) is a **cryptographic network protocol** that allows secure access to remote servers. It is widely used for:

- Managing cloud servers.
- Deploying web applications.
- Executing remote commands securely.

### **How SSH Works**

SSH works using **public-key cryptography**, which involves:

1. **Private Key (id_rsa)** - Stored on your **local machine**.
2. **Public Key (id_rsa.pub)** - Stored on the **remote server** for authentication.

---

## **2. Setting Up SSH for Deployment**

### **Step 1: Generate an SSH Key (if you don't have one)**

Run the following command in your terminal:

```sh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

This will create two files inside `~/.ssh/`:

- `id_rsa` (private key) – **Keep this secure!**
- `id_rsa.pub` (public key) – Add this to your remote server.

### **Step 2: Add Your SSH Key to a Remote Server**

Use this command to copy your SSH key to the server:

```sh
ssh-copy-id user@server-ip
```

If `ssh-copy-id` is not available, manually copy your public key:

```sh
cat ~/.ssh/id_rsa.pub | ssh user@server-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### **Step 3: Connect to the Server**

Once the key is added, you can connect securely:

```sh
ssh user@server-ip
```

---

## **3. Common Shell Commands (Linux/Mac/Windows)**

| **Command**      | **Description**                       |
| ---------------- | ------------------------------------- |
| `ls`             | List files in a directory             |
| `cd`             | Change directory                      |
| `pwd`            | Show current directory                |
| `cp`             | Copy files                            |
| `mv`             | Move or rename files                  |
| `rm`             | Remove files or directories           |
| `mkdir`          | Create a new directory                |
| `rmdir`          | Remove an empty directory             |
| `nano`, `vim`    | Edit files                            |
| `chmod`, `chown` | Change file permissions and ownership |

---

## **4. Deploying a Next.js & MongoDB Application**

### **Step 1: Connect to Your Server**

Use SSH to access your cloud server (e.g., DigitalOcean, AWS, Vercel, Railway):

```sh
ssh user@server-ip
```

### **Step 2: Install Node.js & MongoDB (if not installed)**

```sh
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb
```

### **Step 3: Clone Your Project**

```sh
git clone https://github.com/yourusername/yourproject.git
cd yourproject
npm install
```

### **Step 4: Set Up Environment Variables**

Create a `.env.local` file and configure it:

```
MONGODB_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/myDatabase?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=https://yourserver.com/api
```

### **Step 5: Build and Start the Application**

```sh
npm run build
npm start
```

---

## **5. Keeping the App Running with PM2**

PM2 is a process manager that ensures the app keeps running even if the server restarts.

### **Install PM2**

```sh
npm install -g pm2
```

### **Run Next.js with PM2**

```sh
pm2 start "npm start" --name my-next-app
pm2 save
pm2 startup
```

### **Monitor Logs**

```sh
pm2 logs my-next-app
```

---

## **6. Automating Deployment with GitHub Actions (CI/CD) - optional **

Instead of manually deploying, we can **automate** the process using **GitHub Actions**.

### **Example: GitHub Actions Deployment Script**

```yaml
name: Deploy Next.js App

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Install SSH Key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

      - name: Deploy to Server
        run: |
          ssh -o StrictHostKeyChecking=no user@server-ip "
            cd yourproject &&
            git pull origin main &&
            npm install &&
            npm run build &&
            pm2 restart my-next-app
          "
```

---

## **7. Summary & Takeaways**

- **SSH** enables secure remote access and file management.
- **Shell commands** are essential for navigating and configuring servers.
- **Next.js Deployment** involves setting up a server, cloning the project, configuring environment variables, and running the app.
- **PM2** helps keep the Next.js app running in production.
- **GitHub Actions** can be used for **automated CI/CD deployment**.

✅ **Next Step:** **Final Recap & Project Presentation in Milestone 4!** 🚀

---

## **Resources**

1. [SSH Basics](https://www.ssh.com/academy/ssh)
2. [PM2 Process Manager](https://pm2.keymetrics.io/)
3. [GitHub Actions](https://docs.github.com/en/actions)
4. [Next.js Deployment](https://nextjs.org/docs/deployment)
