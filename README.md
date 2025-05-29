# Full Stack Task Manager - Monorepo Guide

Welcome to the **Full Stack Task Manager** project! This guide will help you set up, run, and develop on this application. Also do note that this is a programming challenge for **CareLuLu**. This is also organized as a monorepo with two main directories: `backend/` and `frontend/`.

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed:

- [**Node.js**](https://nodejs.org/en/download) >= 20.x
- **npm** >= 9.x (this will be also installed once you install NodeJs)
- **MySQL Database** (local or remote, e.g., AWS RDS. [Here](https://www.prisma.io/dataguide/mysql/setting-up-a-local-mysql-database) is a guide from Prisma on how to run MySQL locally)
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

```bash
git clone https://github.com/JoshMatthew/Carelulu-Programming-Challenge.git
cd Carelulu-Programming-Challenge
```

---
## ⚙️ Backend Setup (`/backend`)

### Install dependencies

```bash
cd backend
npm install
```
### Environment Variables

Create a `.env` file inside `backend/` with the following structure:

```env
DATABASE_URL="mysql://<your-db-user>:<your-db-password>@<your-db-host>:<your-db-port>/<your-db-name>"
JWT_SECRET="<your-secret-token>"
```

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

### Notes

- Once the server is running, visit `http://localhost:3000` to access the **GraphQL Playground**.
- GraphQL server runs on port `3000` by default.
- After editing the Prisma schema (`prisma/schema.prisma`), run:

```bash
npm run migrate-dev
```

## 🎨 Frontend Setup (`/frontend`)

### Install dependencies

Open a **separate terminal**:

```bash
cd frontend
npm install
```

### Start the Remix Client

```bash
npm run dev
```

This will start the RemixJS app powered by **Vite**.

### Environment Config

To connect the client to your local backend, update `client/app/lib/graphql-client.ts`:

```ts
const apiUrl = "http://localhost:3000"; // Change this to your desired server URL
```

> By default, it connects to the deployed EC2 server.

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
