# 🪙 Coin Exchange

A full-stack web application for coin exchange with user authentication and algorithm utilities, featuring a modern animated frontend served directly by the Node.js backend.

---

## 🚀 Tech Stack

### Backend

| Technology                  | Purpose                         |
| --------------------------- | ------------------------------- |
| **Node.js**                 | Server runtime                  |
| **Express.js v5**           | Web framework & API routing     |
| **MongoDB** (Atlas / Local) | Database                        |
| **Mongoose**                | MongoDB ODM                     |
| **bcryptjs**                | Password hashing                |
| **jsonwebtoken (JWT)**      | Authentication tokens           |
| **dotenv**                  | Environment variable management |
| **cors**                    | Cross-origin request handling   |
| **nodemon**                 | Dev auto-restart                |

### Frontend

| Technology             | Purpose                |
| ---------------------- | ---------------------- |
| **HTML5**              | Page structure         |
| **CSS3**               | Styling & animations   |
| **Vanilla JavaScript** | Client-side logic      |
| **Three.js**           | 3D animated background |

---

## 📁 Project Structure

```
Coin_Exchange_/
├── backend/
│   ├── models/
│   │   └── User.js          # Mongoose User model
│   ├── routes/
│   │   ├── authRoutes.js    # Login & Signup API endpoints
│   │   └── algorithmRoutes.js # Algorithm utility endpoints
│   ├── server.js            # Main Express server entry point
│   ├── seed.js              # Manual database seeder script
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── index.html   # Landing page
        │   ├── home.html    # Main dashboard (protected)
        │   ├── login.html   # Login page
        │   └── signup.html  # Signup page
        ├── css/             # Stylesheets
        └── js/              # Client-side scripts
```

---

## 🛠️ How to Run

```bash
cd backend
node server.js
```

Then open your browser and go to:

```
http://localhost:5050
```

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| `POST` | `/api/auth/register` | Register a new user           |
| `POST` | `/api/auth/login`    | Login and receive a JWT token |

### Algorithm Routes — `/api/algorithms`

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| `GET`  | `/api/algorithms/...` | Various algorithm utilities |

---

## 🌐 Frontend Pages

| URL                            | Page                            |
| ------------------------------ | ------------------------------- |
| `http://localhost:5050/`       | Landing / Index page            |
| `http://localhost:5050/home`   | Main dashboard (requires login) |
| `http://localhost:5050/login`  | Login page                      |
| `http://localhost:5050/signup` | Signup / Register page          |

---

## 👤 Default Demo User

On first startup, the server automatically seeds a demo account:

| Field        | Value       |
| ------------ | ----------- |
| **Username** | `saptarshi` |
| **Password** | `2005`      |

---

## 🔐 Authentication Flow

1. User registers via `/signup` → password is hashed with `bcryptjs` and saved to MongoDB.
2. User logs in via `/login` → backend verifies credentials and returns a **JWT token**.
3. The token is stored client-side (localStorage) and sent with protected requests.
4. Protected pages (`/home`) check for a valid token before rendering content.

---

## 📌 Notes

- The server **starts successfully even if MongoDB is offline** — auth features will be unavailable until the database connects.
- Frontend static assets (CSS, JS) are served directly by Express from `frontend/src/`.
- The `.env` file is listed in `.gitignore` and should **never** be pushed to GitHub.
