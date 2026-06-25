# Todo Application — Full-Stack Assignment

A complete, production-ready full-stack Todo application built with a React frontend and a Node.js/Express backend.

## 🚀 Features

### Frontend (React + Vite)
- **Multi-page Architecture**: Uses React Router for clean navigation instead of a Single Page Application approach for separate views.
- **Todo List Page**:
  - View all todos with active/completed filtering and sorting.
  - Add new todos via a responsive modal.
  - Edit existing todos.
  - Delete todos with confirmation.
  - Toggle completion status with optimistic UI updates.
- **Todo Detail Page**:
  - Fetches and displays details for a specific todo via URL query parameters (`/todo?id=xyz`).
- **Modern UI/UX**:
  - Clean, responsive design.
  - Loading states, error handling, and empty states.
  - Client-side form validation with character limits.

### Backend (Node.js + Express)
- **RESTful API**: Standard CRUD operations (`GET`, `POST`, `PUT`, `DELETE`).
- **Data Persistence**: Stores data in a JSON file (`backend/data/todos.json`).
- **Validation**: Server-side validation for all incoming data.
- **Error Handling**: Comprehensive error catching and semantic HTTP status codes (400, 404, 500).
- **CORS Enabled**: Configured to accept requests from the local React dev server.

---

## 📁 Folder Structure

```
ziptrrip-fullstack-assignment/
├── backend/                  # Node.js + Express API
│   ├── data/
│   │   └── todos.json        # JSON data store
│   ├── routes/
│   │   └── todos.js          # RESTful route handlers
│   ├── package.json
│   └── server.js             # Express entry point
│
├── frontend/                 # React + Vite Application
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── todos.js      # Axios API abstraction
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Top navigation
│   │   │   ├── TodoForm.jsx  # Add/Edit modal form
│   │   │   └── TodoItem.jsx  # Individual list item
│   │   ├── pages/
│   │   │   ├── TodoList.jsx  # Main list page
│   │   │   ├── TodoDetail.jsx# Single detail page
│   │   │   └── NotFound.jsx  # 404 fallback
│   │   ├── App.jsx           # Root component & Routing
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Global styles & variables
│   │   └── App.css           # Component styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js        # Vite config with proxy
│
└── README.md                 # Project documentation
```

---

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a **new** terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/todos`

| Method | Endpoint | Description | Body / Params |
|--------|----------|-------------|---------------|
| `GET` | `/todos` | Retrieve all todos | `?completed=true|false` (optional) |
| `GET` | `/todos/:id` | Retrieve a single todo | — |
| `POST` | `/todos` | Create a new todo | `{ title: string, description?: string }` |
| `PUT` | `/todos/:id` | Update a todo | `{ title?: string, description?: string, completed?: boolean }` |
| `DELETE` | `/todos/:id` | Delete a todo | — |

---

## 💭 Assumptions Made

1. **Persistence**: A simple JSON file (`todos.json`) is used as a local database to keep the setup simple and zero-configuration, as per the assignment description ("JSON file or database").
2. **Proxying**: The Vite development server is configured to proxy `/todos` requests to the Express backend on port 5000, avoiding complex CORS issues during development.
3. **Styling**: Vanilla CSS with CSS Variables is used to provide a lightweight, custom design system without relying on heavy external UI frameworks.
4. **Validation Limits**: Title is limited to 200 characters and description to 1000 characters to prevent malicious large payloads.

---
*Developed by Ruthwik Thotapelli for the Ziptrrip Fullstack Assignment.*
