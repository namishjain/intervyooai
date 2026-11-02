# Intervyoo

Intervyoo is an AI-powered interview preparation app. Users sign in with Google, submit a job description, a self-description, and a PDF resume, then receive a personalized interview report.

## How it works

1. **Sign in:** The frontend uses Google Identity Services to obtain a Google credential and sends it to the backend. The backend verifies the credential, creates or finds the user in MongoDB, and sets an HTTP-only JWT session cookie.
2. **Submit interview details:** A signed-in user enters a job description and self-description and uploads a PDF resume. The frontend sends these to the backend as a multipart request, including the session cookie.
3. **Generate a report:** The backend extracts text from the PDF and sends it, together with the descriptions, to Google Generative AI. It validates the generated report, stores it in MongoDB for that user, and returns it to the frontend.
4. **Review reports:** The frontend displays the generated report and can load the user's saved report list. Protected backend endpoints use the JWT cookie to verify the session and restrict report access to its owner.

## Requirements

- Node.js 20.19 or later (or Node.js 22.12 or later)
- npm
- A MongoDB database
- A Google OAuth 2.0 web client ID
- A Google Generative AI API key

## Run locally

### 1. Configure the backend

From the repository root, copy the backend environment template:

```powershell
Copy-Item backend\.env.example backend\.env
```

Set the following values in `backend/.env`:

| Variable | Value |
| --- | --- |
| `MONGO_URI` | MongoDB connection string for your database |
| `JWT_SECRET` | A long, random secret used to sign sessions |
| `GOOGLE_GENAI_API_KEY` | Google Generative AI API key |
| `GOOGLE_CLIENT_ID` | Google OAuth web client ID |
| `FRONTEND_ORIGIN` | `http://localhost:5173` |

In Google Cloud Console, configure `http://localhost:5173` as an authorized JavaScript origin for the OAuth client. Use the same client ID for `GOOGLE_CLIENT_ID` and the frontend's `VITE_GOOGLE_CLIENT_ID`.

### 2. Install dependencies

Install dependencies for the AI service, backend, and frontend. Run these commands from the repository root:

```powershell
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configure the frontend

Copy the frontend environment template:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

Set these values in `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

Vite reads these values when it starts. Restart the frontend dev server after changing them.

### 4. Start the backend and frontend

Open two terminals at the repository root.

In the first terminal, start the backend:

```powershell
Set-Location backend
node server.js
```

The backend connects to MongoDB and listens on port `3000` by default.

In the second terminal, start the frontend:

```powershell
Set-Location frontend
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Useful frontend commands

Run these from the `frontend` directory:

```powershell
npm run lint
npm run build
```

## Troubleshooting

- **MongoDB connection fails:** verify `MONGO_URI` and confirm your MongoDB network access rules allow your machine to connect.
- **Google sign-in is unavailable:** check that both client ID variables match and that the Vite origin is listed in Google Cloud's authorized JavaScript origins.
- **API requests fail or return CORS errors:** keep `FRONTEND_ORIGIN` set to the exact frontend origin (`http://localhost:5173`) and `VITE_API_BASE_URL` set to `http://localhost:3000`.
- **Changes to frontend environment variables have no effect:** restart Vite after editing `frontend/.env`.

Do not commit `.env` files or put server secrets in frontend variables. Only variables prefixed with `VITE_` are intended for the browser and are visible to users.
