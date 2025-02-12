# **Milestone 3 - Reference Guide**

## **SSH Basics & Shell Commands Reference**

This document provides a reference for SSH (Secure Shell), basic shell commands, and their application in our development workflow. 

---

## **1️⃣ What is SSH?**

**SSH (Secure Shell)** is a protocol used to securely connect to remote systems over a network. It allows developers and system administrators to interact with remote servers, execute commands, transfer files, and perform administrative tasks.

### **🔹 Why Use SSH?**
✅ Secure remote access to servers  
✅ Execute commands on remote machines  
✅ Transfer files securely using SCP or SFTP  
✅ Automate server management and deployment tasks  

### **🔹 Common SSH Commands**

| Command  | Description |
|----------|------------|
| `ssh user@server-ip` | Connect to a remote server via SSH |
| `ssh -p 2222 user@server-ip` | Connect to a server using a specific port (e.g., 2222) |
| `ssh-keygen -t rsa` | Generate SSH key pairs (public/private) |
| `ssh-copy-id user@server-ip` | Copy SSH key to a remote server for passwordless login |
| `scp file.txt user@server-ip:/remote/path` | Securely copy a file to a remote server |
| `rsync -avz folder/ user@server-ip:/remote/path` | Sync files between local and remote using rsync |

---

## **2️⃣ Essential Shell Commands**

Shell commands are used to interact with the operating system from the terminal.

### **🔹 File & Directory Management**
| Command | Description |
|---------|------------|
| `ls -l` | List files in the current directory |
| `cd directory-name` | Change to a specific directory |
| `pwd` | Display the current working directory |
| `mkdir new-folder` | Create a new directory |
| `rm file.txt` | Delete a file |
| `rm -r folder` | Delete a folder and its contents |

### **🔹 System Monitoring**
| Command | Description |
|---------|------------|
| `top` | Display running processes and system usage |
| `ps aux` | List all running processes |
| `df -h` | Show disk usage in human-readable format |
| `du -sh folder/` | Show the size of a folder |

### **🔹 Process Management**
| Command | Description |
|---------|------------|
| `kill PID` | Terminate a process by its PID |
| `pkill process-name` | Kill a process by its name |
| `nohup command &` | Run a command in the background |

---

## **3️⃣ Using SSH in Development with Next.js & MongoDB**

### **🔹 Deploying a Next.js App via SSH**

To deploy a **Next.js** app on a remote server:

```sh
ssh user@your-server-ip
cd /var/www/your-nextjs-app
git pull origin main
npm install
npm run build
pm2 restart next-app
```

### **🔹 Connecting to a Remote MongoDB Server**

If MongoDB is running on a remote server, you can access it via SSH:

```sh
ssh -L 27017:localhost:27017 user@server-ip
mongo
```

This sets up an SSH tunnel to the MongoDB server, allowing you to connect to it locally.

### **🔹 Running a Remote MongoDB Backup via SSH**

```sh
ssh user@server-ip "mongodump --db yourDatabase --archive" > backup.archive
```

This command remotely backs up the database and downloads the archive locally.

---

## **4️⃣ Additional SSH Tools & Tips**

### **🔹 Using `.ssh/config` for Easier Connections**
Instead of typing full SSH commands every time, configure SSH settings:

Edit the file `~/.ssh/config`:

```sh
Host myserver
    HostName your-server-ip
    User your-username
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

Now, simply run:

```sh
ssh myserver
```

### **🔹 Setting Up a Secure SSH Server**

To enhance SSH security, modify the SSH configuration:

1. Edit the SSH config file:

   ```sh
   sudo nano /etc/ssh/sshd_config
   ```

2. Change the SSH port (e.g., 2222):

   ```sh
   Port 2222
   PermitRootLogin no
   ```

3. Restart SSH:

   ```sh
   sudo systemctl restart ssh
   ```

---

## **5️⃣ Conclusion**

- **SSH** is a powerful tool for remote server management, essential for deploying and managing apps.  
- **Shell commands** streamline file management, system monitoring, and process handling.  
- **Using SSH with Next.js & MongoDB** allows secure remote access and database management.  

📌 **Next Steps**: In our final Milestone, we will **review all concepts and prepare for deployment & demo day!** 🎉

---

## **🔗 Resources**

- [SSH Manual](https://linux.die.net/man/1/ssh)
- [Linux Shell Command Cheat Sheet](https://www.linuxtrainingacademy.com/linux-commands-cheat-sheet/)
- [MongoDB Secure Connections](https://docs.mongodb.com/manual/administration/security/)  
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)  
- [Using PM2 for Next.js](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

🚀 **Great job! Keep practicing with SSH & shell commands to improve your skills!**
