# DevHunt

A developer-focused job platform. Job seekers browse and view roles; employers post and manage listings. Auth uses HTTP-only JWT cookies.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router |
| Backend | Express 5, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT in HTTP-only cookies (`bcrypt` for passwords) |

## Project structure

```
DevHunt/
├── frontend/          # Vite React app (port 5173)
├── backend/           # Express API (port 5000)
├── vercel.json        # Frontend + API services + /api rewrites
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas cluster (or local MongoDB)

## Setup

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Backend environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/devhunt?retryWrites=true&w=majority
JWT_TOKEN=<strong-secret>
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Notes:

- Use database name `devhunt` (lowercase) to match Atlas casing.
- URL-encode special characters in the password (e.g. `$` → `%24`).
- Allow your IP (or `0.0.0.0/0` for local dev) under Atlas **Network Access**.

### 3. Frontend environment

Copy the example file:

```bash
cd frontend
cp .env.example .env
```

Local values use relative `/api/...` paths. Vite proxies `/api` to `http://localhost:5000` in development.

```env
VITE_REGISTER_KEY=/api/auth/register
VITE_LOGIN_KEY=/api/auth/login
VITE_LOGOUT_KEY=/api/auth/logout
VITE_PROFILE_KEY=/api/auth/profile
VITE_PROFILECOMPLETED_KEY=/api/auth/profilecompleted
VITE_CREATE_JOB_KEY=/api/job/createjob
VITE_GET_ALL_JOBS=/api/job/getalljobs
VITE_GET_JOB_BY_ID=/api/job/getjobsbyid
VITE_GET_MY_JOBS=/api/job/getmyjobs
VITE_DELETE_JOB=/api/job/deletejob
VITE_UPDATE_JOB=/employer/updatejobs
```

## Run locally

Open two terminals:

```bash
# API
cd backend
npm run dev
```

```bash
# UI
cd frontend
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  

You should see `Server is running on port 5000` and `MongoDB Connect: ...` in the API terminal.

## API overview

### Auth — `/api/auth`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/register` | Public | Create account |
| POST | `/login` | Public | Login + set cookie |
| POST | `/logout` | Cookie | Clear session |
| GET | `/profile` | Cookie | Current user |
| PUT | `/profilecompleted` | Cookie | Complete profile |

### Jobs — `/api/job`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/getalljobs` | Public | List active jobs |
| GET | `/getjobsbyid/:id` | Public | Job detail |
| POST | `/createjob` | Employer | Create job |
| GET | `/getmyjobs` | Employer | Employer’s jobs |
| PATCH | `/updatejob/:id` | Employer | Update job |
| DELETE | `/deletejob/:id` | Employer | Delete job |
| PATCH | `/togglejobstatus/:id` | — | Toggle active/closed |

## Roles & flows

1. **Register** → **Login**
2. Complete profile (`/profilecompleted`) — choose **jobseeker** or **employer**
3. Job seekers → browse `/jobspage`
4. Employers → dashboard `/employer` (post / manage jobs)

Session restore: on load, the frontend calls `/api/auth/profile` with `credentials: "include"`.

## Deploy (Vercel)

`vercel.json` runs frontend + backend as services and rewrites `/api/*` to the backend. Set these in the Vercel project:

**Backend:** `MONGO_URI`, `JWT_TOKEN`, `CLIENT_URL` (production frontend URL), `NODE_ENV=production`

**Frontend:** relative `VITE_*` keys (same as `.env.example`) work when `/api` is rewritten to the API service.

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | API with nodemon |
| `backend` | `npm run build` | Compile TypeScript |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Production build |
| root | `npm run dev:frontend` / `dev:backend` | Convenience wrappers |

## License

ISC
