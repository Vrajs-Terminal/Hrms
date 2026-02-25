# 🚀 The Ultimate Guide: Deploying MineHR to the Cloud (24/7)

To make your system accessible worldwide, even when your Mac is turned off, we need to move the three moving pieces (Frontend, Backend, Database) into the Cloud. Here is the exact industry-standard architecture we will use to deploy your project for **free**.

## The 3-Part Cloud Architecture
1. **The Database (MySQL)** ➔ **TiDB Cloud** or **Aiven** (Free 24/7 Cloud MySQL)
2. **The Backend (Node.js)** ➔ **Vercel** (Free 24/7 Backend Hosting)
3. **The Frontend (React)** ➔ **Vercel** or **GitHub Pages** (Free Frontend Hosting)

---

### Step 1: Moving MySQL to the Cloud (The Brain)
Right now, your Database URL in your `.env` file is `mysql://root:root@localhost:3306/hrms`. "Localhost" means your laptop.

1. Go to **TiDB Serverless** (tidbcloud.com) or **Aiven** (aiven.io) and create a free account.
2. Click **"Create MySQL Database"**.
3. They will provide you with a global Connection URL. It will look something like this:
   `mysql://admin:SecurePass123@gateway01.prod.aws.tidbcloud.com:4000/minehr`
4. You simply paste this new URL into your `backend/.env` file.
5. In your terminal, you run `npx prisma db push`. This command will instantly build all your company, employee, and branch tables on the Cloud Database!

### Step 2: Deploying the Backend to Vercel (The Engine)
Vercel is the easiest place to host a Node.js API. 

1. Inside your `backend` folder, we will create a tiny file called `vercel.json`. This file tells Vercel how to start your Express server.
2. We push your code to GitHub.
3. Go to **Vercel.com**, log in with your GitHub account, and click **"Add New Project"**.
4. Select your `hrms-master` repository.
5. Set the **Root Directory** setting to `backend`.
6. Go to **Environment Variables** and paste in your `DATABASE_URL` (the Cloud one you got in Step 1) and your `JWT_SECRET`.
7. Click **Deploy**. 
8. Vercel will give you a live API URL! Example: `https://minehr-api.vercel.app`

### Step 3: Deploying the Frontend to Vercel (The Face)
Now that your API lives on the internet, we must tell your React website to talk to it.

1. In your code (`src/lib/axios.ts`), we change the `baseURL` from `http://localhost:5001/api` to your new live backend URL: `https://minehr-api.vercel.app/api`.
2. Push your code to GitHub.
3. Go back to Vercel and click **"Add New Project"** again. Select the `hrms-master` repository a second time.
4. Leave the Root Directory as default (since the React app is in the main folder).
5. Click **Deploy**. 
6. Vercel will give you your final, live website URL! Example: `https://minehr.vercel.app`

### 🎉 Result
You can now close your laptop. An employee opens `https://minehr.vercel.app` on their phone. They log in safely, the frontend passes it to the Vercel Backend, the Backend checks the TiDB Cloud Database, and lets them in. 

*Let me know when you are ready to create your free Cloud Database account, and we can start Step 1!*
