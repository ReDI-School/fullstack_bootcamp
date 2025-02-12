# **Milestone 3 - SSH Basics & Command Line Essentials**

## **Introduction to SSH**

SSH (**Secure Shell**) is a cryptographic network protocol that enables secure communication between two systems over an unsecured network. It is widely used by developers and system administrators for:

- **Remote server access** 🖥️
- **Secure file transfer** 📂
- **Managing cloud-based applications** ☁️
- **Automating deployments and system maintenance** 🔧

SSH provides **encryption, authentication, and data integrity** to ensure secure remote access.

---

## **1️⃣ Why is SSH Important?**

### 🔐 **Security & Encryption**

- All data transmitted over SSH is **encrypted**, preventing unauthorized access.
- Uses **public-key cryptography** for authentication.

### 🌍 **Remote Access**

- Allows users to log into remote servers **securely**.
- Essential for managing **cloud servers (AWS, DigitalOcean, Linode, etc.)**.

### 🚀 **Automation & DevOps**

- Enables **secure script execution**, allowing automation of server maintenance.
- Used in **CI/CD pipelines** for automated deployment.

---

## **2️⃣ Installing & Using SSH**

SSH is built into **Linux** and **MacOS**, while **Windows** requires a terminal like:

- Windows **PowerShell** (`ssh` command included from Windows 10)
- **PuTTY** (third-party SSH client)
- **WSL (Windows Subsystem for Linux)**

### **🖥️ Checking if SSH is Installed**

Run the following command:

```sh
ssh -V
```

If SSH is installed, you will see version information.

---

## **3️⃣ Connecting to a Remote Server - optional**

### 🔗 **Basic SSH Command**

To connect to a server:

```sh
ssh username@server_ip_address
```

Example:

```sh
ssh user@192.168.1.1
```

- **username** → Your login username.
- **server_ip_address** → The server’s IP or domain.

If connecting for the first time, SSH will ask to confirm the connection:

```sh
The authenticity of host '192.168.1.1' can't be established.
Are you sure you want to continue connecting (yes/no)?
```

Type `yes`, then enter your **password**.

---

## **4️⃣ SSH Key Authentication**

Instead of using passwords, SSH allows **public-key authentication**, improving security.

### **🔑 Generating SSH Keys**

On your local machine:

```sh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

This will create two files:

- **`id_rsa`** → Private key (keep this secure!)
- **`id_rsa.pub`** → Public key (upload this to the server)

### **🚀 Adding Public Key to a Server**

Copy the public key to the remote server:

```sh
ssh-copy-id username@server_ip_address
```

Alternatively, manually append the key to `~/.ssh/authorized_keys` on the remote server.

Now you can log in **without entering a password**:

```sh
ssh username@server_ip_address
```

---

## **5️⃣ Common SSH Commands**

### 📂 **Secure Copy (SCP)**

Transfer files securely using SCP:

- Copy a file **from local to remote**:
  ```sh
  scp file.txt user@server_ip:/home/user/
  ```
- Copy a file **from remote to local**:
  ```sh
  scp user@server_ip:/home/user/file.txt .
  ```

### 🔄 **Remote File Transfer (SFTP) - optional**

SFTP (Secure File Transfer Protocol) allows file transfers over SSH:

```sh
sftp user@server_ip
```

Inside the SFTP session, use:

- `put localfile.txt` → Upload file to the server
- `get remotefile.txt` → Download file from the server

### 📜 **Running Remote Commands**

Run a command **on a remote server without logging in**:

```sh
ssh user@server_ip "ls -l /var/www"
```

---

## **6️⃣ Using SSH with Git & GitHub**

### 🔑 **Setting Up SSH for GitHub**

1️⃣ Generate SSH key (if not done already):

```sh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

2️⃣ Add the key to GitHub:

- Copy the public key:
  ```sh
  cat ~/.ssh/id_rsa.pub
  ```
- Go to **GitHub → Settings → SSH Keys** and add the copied key.

3️⃣ Test connection:

```sh
ssh -T git@github.com
```

### **Using SSH for Git Operations**

Instead of HTTPS, clone repositories with SSH:

```sh
git clone git@github.com:username/repository.git
```

This avoids entering your username and password each time.

---

## **7️⃣ SSH & Next.js + MongoDB**

SSH is crucial for **deploying Next.js applications** and **connecting to remote databases**.

### **🔗 Connecting to a MongoDB Database via SSH**

If your MongoDB database is on a remote server, use **SSH tunneling** to connect:

```sh
ssh -L 27017:localhost:27017 user@server_ip
```

- This forwards **port 27017** (MongoDB) from the server to your local machine.
- Now you can connect **locally** using:
  ```sh
  mongo --host localhost --port 27017
  ```

### **🚀 Deploying Next.js with SSH - optional**

1️⃣ Upload files via SSH:

```sh
scp -r my-nextjs-app user@server_ip:/var/www/
```

2️⃣ SSH into the server:

```sh
ssh user@server_ip
```

3️⃣ Start the application:

```sh
cd /var/www/my-nextjs-app
npm install
npm run build
npm start
```

---

## **8️⃣ SSH Best Practices**

🔒 **Security Tips**
✅ **Use key authentication instead of passwords**  
✅ **Disable root login (`PermitRootLogin no`)**  
✅ **Change the default SSH port (`Port 2222` in `sshd_config`)**  
✅ **Enable a firewall (e.g., UFW on Linux)**  
✅ **Monitor SSH logins (`/var/log/auth.log`)**

---

## **Conclusion**

### **Key Takeaways**

1️⃣ SSH allows **secure remote access** and **file transfers**.  
2️⃣ **SSH keys** improve security and eliminate the need for passwords.  
3️⃣ **SCP & SFTP** enable secure file transfers.  
4️⃣ **SSH with Git** simplifies authentication with GitHub & GitLab.  
5️⃣ **SSH tunneling** is useful for connecting to remote databases.  
6️⃣ **Deploying Next.js & MongoDB** often requires SSH for server management.

---

## **Next Steps**

📌 **Practice SSH connections & file transfers.**  
📌 **Set up SSH keys for GitHub authentication.**  
📌 **Deploy a Next.js project to a remote server using SSH.**  
📌 **Secure your server using SSH best practices.**

🚀 **Great job! Now you're ready to use SSH like a pro!**
