# Full Stack Task Manager - Monorepo Guide

Welcome to the **Full Stack Task Manager** project! This guide will help you set up, run, and develop on this application. Also do note that this is a programming challenge for **CareLuLu**. This is also organized as a monorepo with two main directories: `backend/` and `frontend/`. 

> This guide is aimed for programmers with intermediate to advanced knowledge.

If you're a non-programmer and just wanted to test the app, you can preview it [here](https://carelulu-programming-challenge.vercel.app/)

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed:

- [**Node.js**](https://nodejs.org/en/download) >= 20.x
- **npm** >= 9.x (this will be also installed once you install NodeJs)
- **MySQL Database** — local or remote:
  - You can use a managed service like **AWS RDS**
  - Or run MySQL locally using:
    - [Prisma’s Guide](https://www.prisma.io/dataguide/mysql/setting-up-a-local-mysql-database)
    - [XAMPP](https://www.apachefriends.org/index.html) (a free Apache + MySQL + PHP stack)
    - [MAMP](https://www.mamp.info/en/mac/) (for macOS users)
    - **Docker** (if you're comfortable with containers)
- **Terminal** or command line tool (I recommend [GitBash](https://git-scm.com/downloads) for Windows users)
- **Git** (for cloning the repository. Git will be installed upon installing GitBash)

Optional but helpful tools:

- **Prisma CLI** (`npx prisma`) - comes with dev dependencies
- **VS Code** with recommended extensions (Prettier, ESLint)
- **Postman** or **Insomnia** (for API testing, if not using GraphQL Playground)

---

## 📁 Monorepo Structure

```
.
├── backend/     # Contains the backend server (GraphQL + Prisma + Express)
├── frontend/    # Contains the RemixJS client
├── README.md
└── ...
```

---

## 🚀 Getting Started

### 1. Clone the repository

Go to your working directory/folder, open your favorite programming terminal there (but I recommend GitBash for Windows) and paste the code below

```bash
git clone https://github.com/JoshMatthew/Programming-Challenge.git
cd Programming-Challenge
```

---
## ⚙️ Backend Setup (`/backend`)

### Install dependencies
In your terminal, paste or type:
```bash
cd backend
npm install
```
### Environment Variables

Create a `.env` file inside the `backend/` directory with the following content:

```env
DATABASE_URL="mysql://<your-db-user>:<your-db-password>@<your-db-host>:<your-db-port>/<your-db-name>"
JWT_SECRET="<your-secret-token>"
```

You can create the `.env` file by:

- Using your code editor (e.g., in **VS Code**, right-click inside the `backend/` folder and choose **"New File"**, then name it `.env`)

**OR**

- Running this command in your terminal from inside the `backend/` folder:

```bash
touch .env
```

Then paste the above content into the file and replace the placeholder values with your actual credentials.

### Setup Database

After updating your `.env` file with your own MySQL `DATABASE_URL`, run the following command to apply the database schema:

```bash
npm run migrate-dev
```

Your database should now be ready

### Common Scripts

| Command                  | Description                                      |
|--------------------------|--------------------------------------------------|
| `npm run dev`            | Starts the backend server in watch mode         |
| `npm run build`          | Builds the backend (TypeScript -> JavaScript)   |
| `npm start`              | Starts the backend (non-watch mode)             |
| `npm run start-server`   | Builds and runs the backend                     |
| `npm run migrate-dev`    | Runs Prisma dev migration (after schema change) |
| `npm run migrate-deploy` | Deploys migrations to production database       |
| `npm run test`           | Runs backend tests using Mocha                  |
| `npx prisma studio`      | Opens Prisma Studio GUI for database            |

Run the server in development mode by running this in your terminal:
```bash
npm run dev
```

### Notes

- Once the server is running, visit `http://localhost:3000` to access the **GraphQL Playground**.
- GraphQL server runs on port `3000` by default.
- After editing the Prisma schema (`prisma/schema.prisma`), run:

```bash
npm run migrate-dev
```

## 🎨 Frontend Setup (`/frontend`)

### Install dependencies

Open a **separate terminal but still inside the `Programming-Challenge/` folder** and paste or type these:

```bash
cd frontend
npm install
```

### Environment Config


Before running the frontend, we need to configure which backend it connects to.  
Create a `.env` file inside the `frontend/` directory and paste the following:

```env
API_URL=http://127.0.0.1:3000
```

> ⚠️ **Important:** If you are connecting to a local backend, use `http://127.0.0.1:3000` instead of `http://localhost:3000`.  
> Using `localhost` in `API_URL` may cause issues with Remix due to how it handles environment variables in different environments.

If no `.env` or `API_URL` is provided, it will **default to**:

```ts
http://127.0.0.1:3000
```

This means the backend must be running locally on port 3000.

You can find the logic that handles this connection in:

```ts
frontend/app/lib/graphql-client.ts
```

### Start the Remix Client
Start it by pasting or typing this in your terminal inside the `frontend/` directory:
```bash
npm run dev
```

This will start the RemixJS app powered by **Vite**.

---

## 🧪 Testing

### Backend Tests

Run unit and integration tests from the backend folder:

```bash
cd backend
npm test
```

---

## 🗄️ Database

The backend is connected to an **AWS RDS MySQL** database by default.

To use a **different MySQL** instance:

1. Update the `DATABASE_URL` in `backend/.env`
2. Run migration to sync your schema:

```bash
npm run migrate-dev
```

3. (Optional) View and edit database entries using:

```bash
npx prisma studio
```

---

## 🔐 Authentication

The app uses **JWT** for authentication. Define your secret key in the backend `.env`:

```env
JWT_SECRET="your_jwt_secret"
```

---

## ✅ Everything Working?

If everything is set up correctly:

1. Backend should be running at `http://localhost:3000`
2. GraphQL Playground should be accessible in the browser.
3. Frontend client should load and interact with the backend.
4. You should be able to perform full user/task flows via the client.

---

## 📌 Deployment Tips

- Always build both frontend and backend before deploying.
- Update `.env` with production database and JWT config.
- Use `npm run start-server` for starting the backend in production.

---

## 👨‍💻 Author

Josh Matthew Talplacido

---

Happy coding! 🚀
