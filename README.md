# Wanderlust 🌍✈️

Wanderlust is a full-featured, dynamic web application that allows users to list, explore, and review travel accommodations and destinations worldwide. Designed with a premium and interactive user interface, it provides standard CRUD functionalities, user authentication, review systems, and image uploads.

---

## 🚀 Features

- **Listing Management**: Users can create, view, edit, and delete travel listings with images, descriptions, prices, and locations.
- **Review System**: Registered users can write reviews and leave star ratings for individual listings.
- **Authentication & Authorization**: Secure signup, login, and session persistence using Passport.js.
- **Robust Image Uploads**: Integrates with Cloudinary to handle dynamic image uploads securely.
- **Session Management**: Production-ready MongoDB-backed session persistence.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, EJS (Embedded JavaScript), CSS3, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose ODM), MongoDB Atlas
- **Storage**: Cloudinary (via Multer)
- **Auth**: Passport.js with Local Strategy

---

## 💻 Local Setup & Installation

To run this project locally, follow these steps:

### 1. Clone the repository
Navigate to the directory in your terminal:
```bash
cd C:\SHIVANSH\Apna-College-Classroom\MAJORPROJECT
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env` in the root directory (already done locally) and add the following keys:
```env
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret_key
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open your browser and navigate to **http://localhost:3000** to view the app!

---

## ☁️ How to Deploy on Render (Step-by-Step)

Follow these simple steps to host Wanderlust on Render for free and add the link to your portfolio:

### Step 1: Push your project to GitHub
1. Make sure you have a GitHub repository created.
2. Initialize Git, add files, commit, and push to your GitHub:
   ```bash
   git init
   git add .
   git commit -m "Prepare Wanderlust for deployment"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### Step 2: Create a Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing the major project.

### Step 3: Configure Settings
Set the following options in your Web Service setup:
- **Name**: `wanderlust` (or any unique name)
- **Region**: Select the region closest to you
- **Branch**: `main`
- **Root Directory**: Leave blank (unless you placed it inside a subdirectory on GitHub)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node app.js` or `npm start`
- **Instance Type**: **Free**

### Step 4: Add Environment Variables
Scroll down to the **Environment** section, click **Add Environment Variable**, and insert the exact keys from your local `.env` file:
1. `NODE_ENV` ➔ `production`
2. `SECRET` ➔ `YOUR_SECRET_KEY`
3. `ATLASDB_URL` ➔ `YOUR_MONGODB_ATLAS_CONNECTION_STRING`
4. `CLOUD_NAME` ➔ `YOUR_CLOUDINARY_NAME`
5. `CLOUD_API_KEY` ➔ `YOUR_CLOUDINARY_API_KEY`
6. `CLOUD_API_SECRET` ➔ `YOUR_CLOUDINARY_API_SECRET`

### Step 5: Deploy!
Click **Create Web Service**. Render will build and deploy your app. Once deployed, Render will provide a public link (e.g., `https://wanderlust.onrender.com`).

Copy this link and update your portfolio under the "Projects" section so visitors can see it live!
