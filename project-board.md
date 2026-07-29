# Project Board — Medium Version

## Recommended Build Order

**Planning → Backend → Frontend → Integration → Testing → Deployment → Polish → Stretch**

The complete one-resource CRUD application must be finished, tested, and deployed before stretch goals begin.

---

## What Goes in GitHub, and What Does Not

Not everything in the planning documents needs to be a GitHub issue. Use these three categories.

### A. Not an issue — reference documents

The seven planning documents are reference material. They are already written and do not need issues or branches. Read them, do not track them.

`JOB-APPLICATION-TABLE-DESIGN.md`, `PROJECT-BOARD.md`, `TEAM-NORMS.md`, and this repo's README.

If a document needs a change later, put that change in the pull request that makes it necessary. Do not open a separate documentation issue for it.

### B. Issue, but no branch

Work done in a browser dashboard, or verification work, produces nothing to commit. Create the issue so it is tracked and owned, move it across the board, and close it with a comment describing what you did. There is no pull request.

### C. Issue with a branch and a pull request

Anything that changes code. This is the list you actually create branches for.

---

## Board Columns

| Column | Meaning |
|---|---|
| Backlog | Task exists but is not ready |
| Ready | Task is ready to begin |
| In Progress | A teammate is actively working on it |
| In Review | A pull request is open |
| Blocked | Work cannot continue |
| Completed | Work is merged and verified |

Category B issues skip **In Review**, because there is no pull request.

---

## Priority Levels

| Priority | Meaning | Expected to ship? |
|---|---|---|
| P0 | Required for the MVP. The application is incomplete without it | Yes |
| P1 | Important improvement after MVP requirements. The app works without it, but feels unfinished | Yes, if time allows |
| P2 | Stretch goal. New functionality beyond the project scope | Optional |

Work in strict order: **all P0 → then P1 → then P2.**

- No P1 or P2 issue may move to In Progress while a P0 issue is unfinished.
- Nothing that a P0 issue depends on may be classified P1. If a P1 task turns out to block a P0 task, reclassify it to P0 immediately.

---

## P0 Issues — Required for the MVP

**23 issues. 15 of them have branches.** A dash in the Branch column means category B: track it, but there is nothing to commit.

### Planning

| # | Issue | Repo | Branch | Definition of Done |
|---|---|---|---|---|
| 1 | Confirm planning documents and MVP scope | frontend | — | Both teammates have read all seven documents and agree on scope, schema, routes, and pages |

### Backend

| # | Issue | Repo | Branch | Definition of Done |
|---|---|---|---|---|
| 2 | Set up backend repo and Express server | backend | `chore/backend-setup` | Repo created with `.gitignore` and `.env.example`, `npm run dev` starts the server, `GET /api/health` returns `200` |
| 3 | Connect Sequelize to PostgreSQL | backend | `feature/database-connection` | `db.js` connects using `DATABASE_URL`, connection success logs on startup |
| 4 | Create the JobApplication model | backend | `feature/job-application-model` | Table `job_applications` syncs with `tableName` set, all nine fields present, required fields and allowed `status` values enforced |
| 5 | Build read routes | backend | `feature/read-routes` | `GET /api/applications` returns an array, `GET /api/applications/:id` returns one record or `404` |
| 6 | Build write routes | backend | `feature/write-routes` | `POST` creates with `201`, `PATCH` updates a partial body, `DELETE` returns `204`, all three return `404` or `400` correctly |
| 7 | Add error handling and CORS | backend | `feature/error-handling` | All errors return `{ "error": "..." }` with the right status, bad input never returns `500`, requests from `CLIENT_URL` are allowed |
| 8 | Add seed data | backend | `feature/seed-data` | `npm run seed` loads 6–8 records covering every status value |
| 9 | Test the backend API in Postman | backend | — | Every route and every error case from the backend README checklist passes |

### Frontend

| # | Issue | Repo | Branch | Definition of Done |
|---|---|---|---|---|
| 10 | Set up frontend repo and Vite app | frontend | `chore/frontend-setup` | Repo created with `.gitignore`, `.env.example`, and `vercel.json`, `npm run dev` runs on port 5173 |
| 11 | Build layout and routing | frontend | `feature/layout-and-routing` | All five routes resolve, Navbar and Footer render on every page, unknown paths show `NotFoundPage` |
| 12 | Build the application list page | frontend | `feature/application-list` | All applications render as cards, **plus loading, empty, and error states** |
| 13 | Build the application detail page | frontend | `feature/application-detail` | One application renders, **plus loading and error states**, unknown ID shows an error not a blank page |
| 14 | Build the create form | frontend | `feature/create-form` | Form creates a record and redirects, required fields are enforced, every input has a label, `status` is a six-option dropdown |
| 15 | Build the edit form | frontend | `feature/edit-form` | Form pre-fills existing data and saves changes |
| 16 | Add the delete action | frontend | `feature/delete-action` | Delete asks for confirmation, removes the record, and returns to the list |
| 17 | Add responsive CSS | frontend | `feature/responsive-css` | Layout works on mobile and desktop with no horizontal scrolling |
| 18 | Test frontend flows and persistence | frontend | — | Every item in the frontend README checklist passes, data survives refresh and a backend restart |

### Deployment

| # | Issue | Repo | Branch | Definition of Done |
|---|---|---|---|---|
| 19 | Create the Neon database | — | — | Database is active and the connection string is saved securely |
| 20 | Deploy the backend to Render | backend | — | Live `/api/health` returns `200` and connects to Neon over SSL |
| 21 | Deploy the frontend to Vercel | frontend | — | Production UI loads and refreshing a detail page works |
| 22 | Connect production CORS and test live | — | — | Render `CLIENT_URL` is the Vercel URL, and all five CRUD flows pass against the live site |

### Documentation

| # | Issue | Repo | Branch | Definition of Done |
|---|---|---|---|---|
| 23 | Finalize both READMEs | both | `docs/readme` | Setup steps, environment variables, and live links are current in both repos |

---

### Notes on the Consolidation

- **Loading, empty, and error states are folded into issues 12 and 13.** You build the state at the same moment you build the page. They are named in the Definition of Done so they cannot be skipped.
- **Form validation and labels are folded into issue 14.** They are attributes you write while writing the form.
- **The five CRUD routes are two issues, not five.** `GET` all and `GET` one are a few lines apart. Splitting them creates five pull requests that are each smaller than their own description. Two issues also splits cleanly between two people.
- **Repo creation and environment variables are folded into issues 2 and 10.** You cannot branch before the repo exists.
- **Deployment issues have no branches** because the work happens in the Neon, Render, and Vercel dashboards. If a deploy requires a code change, such as adding `engines` to `package.json`, commit it on `chore/backend-setup` or open a small `fix/` branch.

---

## P1 Issues — Important Improvements After the MVP

Start these only after every P0 issue is Completed. The application already works; these make it feel finished.

| Issue | Repo | Branch | Definition of Done |
|---|---|---|---|
| Style status badges | frontend | `feature/status-badges` | The six status values are distinguishable at a glance without relying on color alone |
| Format dates and empty fields | frontend | `feature/display-formatting` | `dateApplied` renders readably, empty optional fields render as `—`, long notes truncate on cards |
| Add success feedback | frontend | `feature/submit-feedback` | Create, edit, and delete each show a confirmation instead of silently navigating |
| Prevent double submission | frontend | `feature/prevent-double-submit` | The submit button is disabled while a request is in flight |
| Accessibility pass | frontend | `feature/accessibility-pass` | Visible focus states, working keyboard navigation, correct heading order |
| Share the Postman collection | backend | `test/postman-collection` | The collection is exported and committed so both teammates run identical tests |
| Add README screenshots | both | `docs/screenshots` | Both READMEs show the deployed list page and one form |

---

## Definition of Done (applies to every issue)

**Category C, issues with a branch:**

- The branch is merged into `main` through a reviewed pull request
- The related issue number is linked in the pull request
- The feature was manually tested by someone other than the author
- The frontend passes `npm run lint` and `npm run build`, if frontend code changed
- No secrets or `.env` files were committed
- The board is updated

**Category B, issues without a branch:**

- The work is verified against the issue's Definition of Done
- A closing comment records what was done, including any URL created
- The board is updated

---

## Pull Request Requirements

Each pull request should include:

- The related issue number
- A short description of the change
- Testing completed
- Screenshots when the UI changes
- Any remaining limitations

A teammate should review the pull request before merge. Do not merge your own pull request without a review.

---

## P2 Issues — Stretch Goals

Start these only after the Final Rule checklist below is complete, which includes all P0 and all P1 issues.

| Stretch Goal | Notes |
|---|---|
| Filter applications by status | Smallest useful next step, frontend only |
| Sort by date applied | Frontend only |
| Search by company or position | Can be done client-side first |
| Add the Interviews resource | First stretch that changes the database, see `JOB-APPLICATION-TABLE-DESIGN.md` |
| Dashboard showing counts per status | |
| Pagination | Only useful with a large amount of data |

### Not Recommended for This Capstone

**Authentication.** It is listed here so the decision is documented, not so it can be picked up. Adding users would require a second table, protected routes, token storage in the frontend, and changes to every existing route and page. It is out of scope for Capstone II and must not be started.

---

## Final Rule

Do not begin P2 stretch issues until:

**All 23 P0 issues are Completed:**

- Core CRUD works locally
- Backend routes and error cases are tested
- Frontend flows are tested
- Loading, empty, and error states work
- Required fields are validated and every input has a label
- The layout is responsive
- Database, backend, and frontend are deployed
- Production CORS is connected and the live app passes testing
- Both READMEs contain current setup steps and live links

**And all 7 P1 issues are Completed.**

If the deadline is close and P1 work is unfinished, finish P1 rather than starting P2. A polished one-resource CRUD app scores better than a rough app with a half-built second feature.
