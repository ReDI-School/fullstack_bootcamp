# **Milestone 3 - Glossary of Terms**

## **1️⃣ SSH (Secure Shell)**
A secure protocol for remotely accessing and managing servers over an encrypted connection.

- **Key Concepts:**
  - Encrypts data between the client and the server.
  - Used to manage servers securely.
  - Commonly used for remote login and command execution.

- **Example Usage:**
  ```sh
  ssh user@remote_server
  ```

---

## **2️⃣ Public and Private Keys (SSH Key Pair)**
SSH authentication method using a key pair for secure login.

- **Key Concepts:**
  - Public key is stored on the server.
  - Private key remains secure on the local machine.
  - Enhances security over password-based authentication.

- **Generating SSH Keys:**
  ```sh
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ```

---

## **3️⃣ Shell Commands (Linux & Mac)**
Basic terminal commands for navigating and managing a system.

- **Common Commands:**
  - `ls` → Lists files in a directory.
  - `cd <directory>` → Changes the current directory.
  - `pwd` → Shows the current directory path.
  - `mkdir <folder>` → Creates a new folder.
  - `rm <file>` → Deletes a file.

---

## **4️⃣ PowerShell & CMD (Windows)**
Windows-based shell environments for executing system commands.

- **PowerShell Commands:**
  - `ls` → Lists files (same as Linux).
  - `cd <directory>` → Navigate folders.
  - `mkdir <folder>` → Create a new folder.
  - `Remove-Item <file>` → Deletes a file.

- **Command Prompt (CMD) Basics:**
  - `dir` → List files.
  - `cd` → Navigate directories.
  - `del <file>` → Delete a file.

---

## **5️⃣ SCP (Secure Copy Protocol)**
Used to securely copy files between local and remote machines.

- **Basic Usage:**
  ```sh
  scp file.txt user@remote_server:/path/to/destination
  ```

---

## **6️⃣ SSH & GitHub**
Using SSH keys to authenticate with GitHub repositories.

- **Setting Up SSH for GitHub:**
  ```sh
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ssh-add ~/.ssh/id_rsa
  ```

- **Adding SSH Key to GitHub:**
  1. Copy your public key:
     ```sh
     cat ~/.ssh/id_rsa.pub
     ```
  2. Paste it into GitHub SSH settings.

- **Cloning a Repository with SSH:**
  ```sh
  git clone git@github.com:username/repository.git
  ```

---

## **7️⃣ SSH & Next.js Deployment**
Using SSH for deploying Next.js applications.

- **Connecting to a Remote Server:**
  ```sh
  ssh user@your_server_ip
  ```

- **Transferring Files to the Server:**
  ```sh
  scp -r ./nextjs-app user@your_server_ip:/var/www/
  ```

- **Starting the Next.js App on the Server:**
  ```sh
  npm install
  npm run build
  npm start
  ```

---

## **8️⃣ MongoDB & SSH**
Connecting securely to a MongoDB database over SSH.

- **Port Forwarding for MongoDB Access:**
  ```sh
  ssh -L 27017:localhost:27017 user@remote_server
  ```

- **Connecting to MongoDB via SSH Tunnel:**
  ```sh
  mongo --host localhost --port 27017
  ```

---

## **Conclusion**
Mastering SSH is essential for managing remote servers, deploying applications, and securing communication between systems. With SSH, we can safely interact with GitHub, deploy Next.js apps, and manage MongoDB databases.

🚀 **Next Steps:** Understanding how to automate SSH tasks with scripts and Ansible for infrastructure management.
