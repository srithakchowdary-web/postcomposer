# PostComposer (MERN)
Simple MERN app to compose, validate, post, and schedule social media posts.
Baby-pink + white theme. Posting is **simulated** (no real X/IG/FB/LinkedIn API calls) — scheduled posts flip to `Posted` at their scheduled time via `node-cron`.
## Structure
```
postcomposer/
├── backend/     # Node + Express + MongoDB + JWT + Multer + node-cron
└── frontend/    # React (Vite) + Tailwind CSS
```
## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) OR a MongoDB Atlas URI
## 1) Run the backend
```bash
cd backend
npm install
cp .env.example .env       # then edit .env if needed
npm run dev                # starts on http://localhost:5000
```
Env vars (`backend/.env`):
``
MONGO_URI=mongodb://127.0.0.1:27017/postcomposer
JWT_SECRET=change-this-to-a-long-random-string
```
## 2) Run the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```
Frontend expects the backend at `http://localhost:5000` (see `frontend/src/utils/api.js`). Change it there if you deploy the backend elsewhere.
## API summary
| Method | Path                | Auth | Purpose                      |
| ------ | ------------------- | ---- | ---------------------------- |
| POST   | /api/signup         | no   | Create account               |
| POST   | /api/login          | no   | Login, returns JWT           |
| PUT    | /api/change-password| yes  | Change password              |
| POST   | /api/posts          | yes  | Create + "post" immediately  |
| POST   | /api/posts/schedule | yes  | Schedule for future datetime |
| GET    | /api/posts          | yes  | List current user's posts    |
Images upload as `multipart/form-data`, field name `images` (max 10 MB each).
## Deploying later
- Backend: Render / Railway / Fly.io / any Node host. Set the env vars above.
- Frontend: Vercel / Netlify. Set `VITE_API_URL` to the deployed backend URL.
- MongoDB: MongoDB Atlas free tier works fine.
