## Simple Todo List (Flask + PostgreSQL + React)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 13+

### Backend (Flask + PostgreSQL)
1. Create and configure your database (example):
   - Create a database and user, e.g. `todo_db` / `todo_user`.
   - Grant privileges to the user on the database.
2. Copy backend env example and edit values:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Install backend dependencies and run (Flask dev server):
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   # Run the server (default http://localhost:5000)
   flask --app app run --debug
   ```

#### Alternative: Run Flask via uvicorn (ASGI)
- This repo includes an ASGI wrapper so you can serve Flask with uvicorn.
- Useful for production-like reloader and server features.
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Run on http://localhost:8000
uvicorn asgi:application --host 0.0.0.0 --port 8000 --reload
```

- Configure CORS origins via `backend/.env`:
  - `CORS_ORIGINS=http://localhost:5173` (comma-separated for multiple origins)

### Frontend (Vite + React)
1. Install dependencies and run dev server:
   ```bash
   cd frontend
   npm install
   # optional: copy and edit env
   cp .env.example .env
   npm run dev
   ```
   - Open the app: http://localhost:5173
   - Ensure the backend is running on http://localhost:5000 (Flask) or http://localhost:8000 (uvicorn) or set `VITE_API_URL`.

### Environment Variables
- Backend (`backend/.env`):
  - `DATABASE_URL=postgresql+psycopg2://todo_user:password@localhost:5432/todo_db`
  - `CORS_ORIGINS=http://localhost:5173`
  - `FLASK_ENV=development` (optional)
  - `FLASK_DEBUG=1` (optional)
- Frontend (`frontend/.env`):
  - `VITE_API_URL=http://localhost:5000`

### API Endpoints
- `GET    /api/todos` — list todos
- `POST   /api/todos` — create todo `{ title: string }`
- `PATCH  /api/todos/:id` — update `{ title?: string, completed?: boolean }`
- `DELETE /api/todos/:id` — delete

### Notes
- The backend will auto-create tables on startup.
- CORS is enabled and configurable via env (default allows `http://localhost:5173`).


