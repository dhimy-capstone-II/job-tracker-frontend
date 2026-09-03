# Job Application Tracker - Frontend

React frontend for the **TTP Summer 2026 Capstone II** Job Application Tracker.

## Features

- View all job applications
- View one job application
- Create a new job application
- Edit an existing job application
- Delete a job application
- Track company, position, status, location, application date, job link, and notes
- Display loading, empty, and error states
- Validate required fields before submitting
- Navigate with React Router
- Use responsive styling

## Project Links

- Frontend Repository: https://github.com/dhimy-capstone-II/job-tracker-frontend
- Backend Repository: https://github.com/dhimy-capstone-II/job-tracker-backend
- GitHub Organization: https://github.com/dhimy-capstone-II
- Project Board: Add GitHub Project Board URL after it is created

### Local Links

These links work only while both servers are running:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Live Links

- Frontend: Add Vercel URL after deployment
- Backend: Add Render URL after deployment

## Planning Documents

The shared planning documents live in this repository:

- [`JOB-APPLICATION-TABLE-DESIGN.md`](JOB-APPLICATION-TABLE-DESIGN.md) — database design and naming standard
- [`PROJECT-BOARD.md`](PROJECT-BOARD.md) — issues, priorities, branches, and definitions of done
- [`TEAM-NORMS.md`](TEAM-NORMS.md) — team working agreements

## Team

| Name | Role |
|---|---|
| Dhimy Jean | Role to be confirmed |
| Daniel | Role to be confirmed |

**TA:** Nevin

## Technologies

- React
- Vite
- React Router
- JavaScript
- HTML
- CSS
- Fetch API

## Application Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ HTTP requests using Fetch API
  ▼
Express REST API
  │
  ▼
Sequelize
  │
  ▼
PostgreSQL Database
```

## Full Project Structure

The frontend and backend are separate Git repositories stored inside one local parent folder:

```text
capstone-2/
│
├── 2-my-guides/
│   ├── START-HERE.md
│   ├── SOLO-BUILD-GUIDE.md
│   └── CODE-WALKTHROUGH.md
│
├── 3-project-docs/
│   ├── README-BACKEND.md
│   ├── README-FRONTEND.md
│   ├── JOB-APPLICATION-TABLE-DESIGN.md
│   ├── PROJECT-BOARD.md
│   └── TEAM-NORMS.md
│
├── job-tracker.code-workspace
│
├── job-tracker-backend/
│   ├── models/
│   │   ├── index.js
│   │   └── JobApplication.js
│   ├── routes/
│   │   └── applications.js
│   ├── app.js
│   ├── db.js
│   ├── seed.js
│   ├── .env                  (not committed)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
└── job-tracker-frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── ApplicationCard.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ApplicationPage.jsx
    │   │   ├── CreateApplicationPage.jsx
    │   │   ├── EditApplicationPage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── .env                  (not committed)
    ├── .env.example
    ├── .gitignore
    ├── eslint.config.js
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── JOB-APPLICATION-TABLE-DESIGN.md
    ├── PROJECT-BOARD.md
    ├── TEAM-NORMS.md
    ├── vercel.json
    └── vite.config.js
```

The parent folder is only a local workspace. Do not run `git init` in `capstone-2`. The backend and frontend folders each have their own Git history and GitHub remote.

The source copies inside `3-project-docs/` remain outside both repositories. Copies of the planning documents are committed to the frontend repository.

## Frontend Structure

```text
job-tracker-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ApplicationCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ApplicationPage.jsx
│   │   ├── CreateApplicationPage.jsx
│   │   ├── EditApplicationPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── .env                  (not committed)
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
├── JOB-APPLICATION-TABLE-DESIGN.md
├── PROJECT-BOARD.md
├── TEAM-NORMS.md
├── vercel.json
└── vite.config.js
```

The default Vite files `src/App.css`, `src/assets/`, and the starter content in `App.jsx` may exist immediately after setup. They will be removed or replaced when the project foundation is built.

`Navbar.jsx` and `Footer.jsx` are reusable components rendered from `App.jsx` so they appear throughout the application.

API requests are made inside the page or component that uses the data. The MVP does not use a shared `api.js` helper.

## File Responsibilities

| File | Responsibility |
|---|---|
| `Navbar.jsx` | Displays the main navigation links |
| `Footer.jsx` | Displays the shared footer |
| `ApplicationCard.jsx` | Displays a summary of one job application and links to its detail page |
| `Home.jsx` | Fetches and displays all job applications |
| `ApplicationPage.jsx` | Fetches and displays one job application |
| `CreateApplicationPage.jsx` | Creates a new job application |
| `EditApplicationPage.jsx` | Loads and updates an existing job application |
| `NotFoundPage.jsx` | Handles invalid frontend routes |
| `App.jsx` | Defines routes and the shared page layout |
| `main.jsx` | Starts the React application and wraps `App` in `BrowserRouter` |
| `index.css` | Contains the application styles |
| `vercel.json` | Rewrites direct frontend routes to `index.html` on Vercel |

`BrowserRouter` lives in `main.jsx`. `Routes` and `Route` live in `App.jsx`. `Navbar` and `Footer` are rendered outside `Routes` so they remain visible on every page.

## Frontend Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | `Home.jsx` | Display all job applications |
| `/applications/new` | `CreateApplicationPage.jsx` | Create a job application |
| `/applications/:id` | `ApplicationPage.jsx` | Display one job application |
| `/applications/:id/edit` | `EditApplicationPage.jsx` | Edit a job application |
| `*` | `NotFoundPage.jsx` | Handle invalid routes |

`/applications/new` is listed before `/applications/:id` for readability. React Router ranks the static route as more specific, so matching does not depend on declaration order.

## Backend API

The frontend sends requests to these backend routes:

| Method | Route | Purpose | Expected Status |
|---|---|---|---|
| `GET` | `/api/applications` | Get all job applications | `200` |
| `GET` | `/api/applications/:id` | Get one job application | `200`, `400`, or `404` |
| `POST` | `/api/applications` | Create a job application | `201` or `400` |
| `PATCH` | `/api/applications/:id` | Update a job application | `200`, `400`, or `404` |
| `DELETE` | `/api/applications/:id` | Delete a job application | `204`, `400`, or `404` |

`fetch` does not throw automatically for `4xx` or `5xx` responses. Every request checks `response.ok` before treating the request as successful.

A successful `DELETE` returns `204 No Content`, so the frontend must not call `response.json()` after a successful deletion.

## Page Requirements

Every page that fetches data handles the states relevant to that page:

| State | Requirement |
|---|---|
| Loading | Show a loading message while the request is in progress |
| Error | Show a clear message from the API |
| Empty | On `Home.jsx`, show a friendly message and a link to create the first application |
| Success | Render the requested data |

Additional requirements:

- Both forms mark `company`, `position`, and `status` as required.
- `status` uses a `<select>` limited to `Saved`, `Applied`, `Interview`, `Offer`, `Rejected`, and `Closed`.
- Blank optional form values are converted to `null` before being sent.
- `EditApplicationPage.jsx` loads the existing record and pre-fills the form.
- Delete asks for confirmation before sending the request and then navigates back to `/`.
- Every form control has a matching `<label>`.
- Submit buttons are disabled while a request is in progress to prevent duplicate submissions.

## Styling

`index.css` contains all MVP styles. The MVP does not use a CSS framework or separate component stylesheets.

- Use a mobile-first layout.
- The layout must work at phone and desktop widths.
- Application cards stack in one column on small screens.
- A media query may change the list to a grid on wider screens.
- Avoid fixed widths that cause horizontal scrolling.
- Style loading, empty, and error states.

## Run Locally

Both servers must be running. Start the backend first.

### Backend

In the `job-tracker-backend` repository:

```bash
npm install
cp .env.example .env
npm run db:create   # create the PostgreSQL database
npm run seed        # load 48 sample applications (optional)
npm run dev
```

That creates a demo account you can sign in with:

| Field | Value |
|---|---|
| Email | `dhimy@example.com` |
| Password | `Password123!` |

Full backend setup, API reference, and troubleshooting live in the backend
repository's README.

### Frontend

Open another terminal, in this repository:

```bash
npm install
cp .env.example .env
npm run dev
```

**Auth0 is optional.** Leave the three `VITE_AUTH0_*` variables blank and the app
runs normally with email + password login — the "Continue with Auth0" button is
simply not shown. Fill all three in if you want social login.

The planned local URLs are:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

If Vite reports that port `5173` is already in use, stop the older Vite process or temporarily use the alternate port displayed in the terminal. The backend `CLIENT_URL` must exactly match the frontend origin currently in use.

## Environment Variable

Create a `.env` file in the frontend repository:

```env
VITE_API_URL=http://localhost:3000
```

Create a committed `.env.example` file with the same non-secret local example:

```env
VITE_API_URL=http://localhost:3000
```

Rules:

- Use the backend origin only.
- Do not include `/api`.
- Do not add a trailing slash.
- Fetch calls build the remaining path, such as `${import.meta.env.VITE_API_URL}/api/applications`.
- The variable must begin with `VITE_` for client-side access.
- Vite replaces the value at build time, so a changed Vercel environment variable requires a redeployment.

Do not commit `.env`. The frontend `.gitignore` must include:

```text
node_modules
dist
.env
```

## Vercel Configuration

Direct visits and browser refreshes on routes such as `/applications/3` must return the React application rather than a Vercel 404.

Create `vercel.json` at the frontend root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Commit this file before deployment.

## Testing

Run:

```bash
npm run lint
npm run build
```

Both commands must pass before the related pull request is merged.

Verify manually:

- All applications load on `/`
- The empty state appears when the database has no records
- One application opens from a card
- The create form creates a record and redirects to its detail page
- Required fields block blank submissions
- The edit form loads existing data
- Edited values persist after refresh
- Delete asks for confirmation and removes the record
- `/applications/9999` shows an error instead of crashing
- `/nonsense` shows `NotFoundPage`
- Loading, empty, and error states appear correctly
- Direct frontend URLs work in a new tab
- Routes still work after refresh
- Stopping the backend produces a visible frontend error
- The layout works at mobile and desktop widths

## Performance Note

The dashboard uses Recharts and the interview room uses `socket.io-client`, which
are the two heaviest libraries in the project. Both routes are loaded with
`React.lazy()` in `src/App.jsx`, so their code is only downloaded when someone
visits those pages.

Measured with `npm run build`:

| | Initial JS (gzipped) |
|---|---|
| Single bundle | 305 kB |
| After splitting the two heavy routes | **181 kB** |

Someone who only opens the login page no longer downloads the charting library.

## Deployment

| Layer | Service |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

### Deployment Order

1. Create the Neon database.
2. Deploy the backend to Render using a temporary `CLIENT_URL`.
3. Deploy the frontend to Vercel with `VITE_API_URL` set to the Render URL.
4. Return to Render, replace `CLIENT_URL` with the exact Vercel production URL, and redeploy.

### Vercel Settings

```text
Framework preset: Vite
Build command:    npm run build
Output directory: dist
```

Set this environment variable in the Vercel dashboard:

```env
VITE_API_URL=https://your-render-backend-url
```

The Render backend must allow the exact Vercel frontend origin through CORS.

### After Deployment

- Test list, detail, create, edit, and delete on the live application
- Refresh a detail or edit route to verify the Vercel rewrite
- Confirm loading feedback appears during a slow or cold-starting backend request
- Add the live Vercel and Render URLs to both repository READMEs
