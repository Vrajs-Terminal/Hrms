# GitHub Deployment & Cloud Hosting Guide

You have asked two very important questions about how your MineHR system works when you turn off your laptop, and how GitHub Pages comes into play. 

There is a **very critical concept** you must understand about how Full-Stack (Database) applications work on the internet.

---

## 1. How to Commit and Push your Code to GitHub
To back up all the amazing work we have done to your GitHub repository, you run these three simple commands in your VS Code terminal (make sure to stop the running `npm start` server first by pressing `Ctrl + C`):

```bash
git add .
git commit -m "Integrated Backend, Database, and Login System"
git push
```
*This officially saves your code to the cloud on GitHub.com so you never lose it.*

To update your live website on GitHub Pages with your new React code, you run:
```bash
npm run deploy
```

---

## 2. The Big Question: Does my Database work when my laptop is off?

**NO.** Right now, your system **will completely break** if you turn off your laptop and try to check your website from another computer. 

Here is exactly why, and what GitHub Pages actually does:

### ❌ What GitHub Pages DOES:
GitHub Pages is entirely free, but it **only hosts static files** (HTML, CSS, JavaScript, and React screens). 
When you deploy to GitHub Pages, you are *only* uploading the visual "Frontend" of your website.

### ❌ What GitHub Pages CANNOT DO:
GitHub Pages **cannot** run a Node.js Backend Server (`localhost:5001`), and it **cannot** run a MySQL Database. 
Right now, your MySQL Database is literally installed directly on the hard drive of your specific Mac laptop.

### 🚨 The Problem:
If you deploy your React site to GitHub Pages right now, and you open it on your mobile phone, the website will load beautifully. BUT, the moment you type in `admin@minehr.com` to log in, your phone will try to talk to `localhost:5001` (your phone's internal engine). Because your phone doesn't have the database running on it, the login will instantly fail.

---

## 3. How do we make the Database run 24/7 on the Internet?

To make your HRMS system function properly for everyone in the world, even when your personal laptop is turned off, we have to move your Backend and Database out of your laptop and into **The Cloud**.

Here is the 3-step modern architecture we need to set up:

### Step A: A Cloud Database (The Brain 🧠)
Instead of running MySQL on your laptop, we rent a small, free MySQL Database from a cloud provider (like Aiven, AWS, or PlanetScale). This database runs globally 24/7 on powerful servers.

### Step B: A Cloud Backend Server (The Engine ⚙️)
We take your Node.js/Express backend code (the `/api` folder) and upload it to a free backend hosting provider (like **Render.com** or **Vercel**). 
This provider runs a computer 24/7 that connects directly to the Cloud Database.
Instead of being at `http://localhost:5001`, your backend will get a real URL like:
`https://minehr-backend.onrender.com`

### Step C: Your React Frontend (The Face 🧑‍💻)
Your GitHub Pages React Website stays exactly where it is. But, instead of telling React to talk to `localhost` (your laptop), we update your `axios.ts` file to talk to the new Cloud Backend URL. 

### The Final Result:
1. An employee opens your GitHub Pages website on their iPad at night while your laptop is closed.
2. They click "Sign In".
3. GitHub Pages securely sends their password to your Cloud Backend (Render.com).
4. Render.com checks your Cloud Database (Aiven) 24/7 to verify the password.
5. Render tells the iPad "Login Successful!".

**If you want to set this up, our next project together will be migrating your local MySQL database to a free Cloud Database provider so your app can go truly live!**
