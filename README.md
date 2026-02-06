# Polling System

<img width="600" height="380" alt="image" src="https://github.com/user-attachments/assets/e16a7b27-1d92-4edb-a6b6-571da927863d" />
<img width="600" height="380" alt="image" src="https://github.com/user-attachments/assets/e15bd820-f80d-4ae5-8c93-f686dcf9d9e2" />
<img width="600" height="380" alt="image" src="https://github.com/user-attachments/assets/36d02648-ff0b-4352-955d-ee8843db1e94" />
<img width="600" height="380" alt="image" src="https://github.com/user-attachments/assets/ae4b2855-ca71-4525-bb09-2bc702c05842" />

Full-stack voting web application with real-time updates via WebSockets.

## Stack

- Node.js / Express (backend API)
- Angular (frontend SPA)
- MySQL
- Java / Maven (microservice)
- Docker

## Project structure

```
backend/           Node.js API, views, static assets
  config/          database configuration
  controllers/     business logic
  middleware/      auth, role, status checks
  routes/          route definitions
  services/        websocket service
  views/           handlebars templates
  public/          static files
frontend/          Angular application
java-service/      Java microservice
docker/            Dockerfiles, compose, DB init script
```

## Quick start (Docker)

```bash
git clone https://github.com/stepan-redka/CW-2024.git
cd CW-2024
cp .env.example .env        # edit with your credentials
cd docker
docker-compose up --build -d
```

App will be available at `http://localhost:3000`.

## Manual setup

Prerequisites: Node.js, MySQL, Java 11+, Maven.

```bash
cp .env.example .env        # edit with your credentials
cd backend
npm install
npm start
```

## Environment variables

See `.env.example`:

```
DATABASE=your_database_name
DATABASE_HOST=localhost
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
PORT=3000
```
