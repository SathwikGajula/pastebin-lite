# Pastebin Lite

Pastebin Lite is a backend-focused web application that allows users to create, store, and share text snippets using a unique, shareable URL. Each paste can optionally expire based on time (TTL) or the number of views.

This project was implemented as part of a confidential take-home assignment and focuses primarily on backend correctness, robustness, and deployment readiness rather than frontend complexity.

---

## Live Deployment

**Base URL**  
https://pastebin-lite-eaap.onrender.com

---

## Features

- Create text pastes via API or UI
- Generate a unique shareable URL for each paste
- Retrieve paste content using:
  - JSON API
  - HTML page for browser viewing
- Optional expiration mechanisms:
  - Time-based expiration (TTL in seconds)
  - View-count-based expiration
- Safe HTML rendering with XSS protection
- Health check endpoint for monitoring
- Persistent storage using a relational database

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (Railway)
- **Hosting:** Render
- **Architecture:** MVC (Model–View–Controller)

---

## Project Structure

pastebin-lite/
├── backend/
│ ├── app.js
│ ├── server.js
│ ├── package.json
│ ├── package-lock.json
│ │
│ ├── controllers/
│ │ └── pasteController.js
│ │
│ ├── routes/
│ │ ├── pasteRoutes.js
│ │ ├── htmlRoutes.js
│ │ └── healthRoutes.js
│ │
│ ├── models/
│ │ └── PasteModel.js
│ │
│ ├── db/
│ │ └── index.js
│ │
│ ├── utils/
│ │ ├── escapeHtml.js
│ │ ├── time.js
│ │ └── validators.js
│ │
│ └── public/
│ └── index.html
│
└── README.md

---

## API Endpoints

### Health Check


Checks whether the server and database are reachable.

**Response**
```json
{
  "ok": true
}

//Create Paste

POST /api/pastes

//Request
{
  "content": "Hello Pastebin",
  "ttl_seconds": 60,
  "max_views": 5
}

//Response
{
  "id": "uuid",
  "url": "https://pastebin-lite-eaap.onrender.com/p/uuid"
}

//Get Paste

GET /api/pastes/:id

//Response

{
  "content": "Hello Pastebin",
  "remaining_views": null,
  "expires_at": null
}


--View Paste (HTML)--

GET /p/:id


-------FRONTEND------------- 

The UI allows users to:

Enter paste content
Optionally specify TTL and maximum views
Generate and open a shareable paste URL
The frontend is intentionally minimal, as the evaluation focuses on backend functionality.


----Expiration Logic-----

Each paste can expire in two ways:
Time-based expiration
Paste becomes unavailable once the current time exceeds expires_at
View-based expiration
Paste becomes unavailable once view_count >= max_views
Expiration rules are enforced consistently across both API and HTML access.


----Security Considerations------

HTML output escapes user-provided content to prevent XSS
API responses return raw content for programmatic access
Environment variables are used for all sensitive configuration
No secrets are committed to version control


----Database Schema-----

CREATE TABLE pastes (
  id VARCHAR(50) PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME,
  max_views INT,
  view_count INT DEFAULT 0
);



---Running Locally----

Clone the repository
Navigate to the backend directory
Install dependencies:

npm install

MYSQL_PUBLIC_URL=<your-mysql-url>
TEST_MODE=0

npm start

http://localhost:3000


------Deployment------

Backend is deployed on Render
Database is hosted on Railway (MySQL)
Database schema is created automatically at startup
Application configuration is managed via environment variables

------Design Decisions----

MVC architecture for clean separation of concerns
Separate routes for API responses and HTML rendering
Stateless API design with database-backed persistence
Programmatic schema initialization for fast and reliable deployment
Minimal frontend aligned with backend-focused evaluation


Notes:-

UI styling is intentionally simple
The application prioritizes correctness, reliability, and clarity
All requirements from the problem statement are fully implemented
