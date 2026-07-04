# AI Customer Review Analyzer

A production-ready full-stack SaaS application that analyzes customer reviews using Google Gemini AI. Built with React, Spring Boot, MySQL, and JWT authentication.

## Features

- User registration and login with JWT (Remember Me support)
- AI-powered review analysis via Google Gemini 2.5 Flash
- Dashboard with statistics, charts, and recent activity
- Save analysis history with search and filter
- Favorites management
- Analytics with pie and bar charts
- Export to PDF, JSON, and CSV
- Upload TXT and CSV review files
- Dark mode, responsive design, glassmorphism UI
- Review comparison tool

## Architecture

```
┌─────────────┐     REST/JWT      ┌──────────────┐     JPA      ┌────────┐
│  React SPA  │ ◄──────────────►  │ Spring Boot  │ ◄──────────► │ MySQL  │
│  (Vite)     │                   │   Backend    │              └────────┘
└─────────────┘                   └──────┬───────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │ Gemini API   │
                                  └──────────────┘
```

## Folder Structure

```
ai-customer-review-analyzer/
├── backend/          # Spring Boot API (Java 17, Maven)
├── frontend/         # React + Vite + Tailwind CSS
├── database/         # MySQL schema SQL
├── .env.example      # Environment variable template
└── README.md
```

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

## MySQL Setup

```bash
mysql -u root -p < database/schema.sql
```

Or let Spring Boot auto-create tables (ddl-auto: update is enabled).

## Backend Setup

1. Set environment variables (or edit `backend/src/main/resources/application.yml`):

```bash
set DB_URL=jdbc:mysql://localhost:3306/review_analyzer?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
set DB_USERNAME=root
set DB_PASSWORD=your_password
set JWT_SECRET=your-secure-secret-key-at-least-32-characters-long
set GEMINI_API_KEY=your_gemini_api_key
set GEMINI_MODEL=gemini-2.5-flash
```

2. Build and run:

```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

## Frontend Setup

1. Create environment file:

```bash
cd frontend
copy .env.example .env
```

2. Install and run:

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_URL` | MySQL JDBC connection URL |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRATION_MS` | Token expiry (default: 86400000 = 24h) |
| `JWT_REMEMBER_ME_EXPIRATION_MS` | Remember-me expiry (default: 604800000 = 7d) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model (default: gemini-2.5-flash) |
| `VITE_API_BASE_URL` | Backend API URL for frontend |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |
| PUT | `/api/profile/password` | Change password |
| DELETE | `/api/profile` | Delete account |
| POST | `/api/reviews/analyze` | Analyze reviews (Gemini) |
| POST | `/api/history` | Save analysis |
| GET | `/api/history` | List history |
| GET | `/api/history/{id}` | Get analysis by ID |
| DELETE | `/api/history/{id}` | Delete analysis |
| POST | `/api/favorites` | Add favorite |
| GET | `/api/favorites` | List favorites |
| DELETE | `/api/favorites/{id}` | Remove favorite |

