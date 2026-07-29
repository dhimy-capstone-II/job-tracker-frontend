# Team Norms — Job Application Tracker

Working agreements for the **Group 9 TTP Summer 2026 Capstone II** team.

Both teammates read and agree to this document before the first feature branch is created. It is tracked by the `planning/team-norms` issue on the project board.

---

## Team

| Team Member | GitHub | Primary Contact | Time Zone |
|---|---|---|---|
| Dhimy Jean | `@dhimysoft` | Discord / email | Add time zone |
| Daniel | `@username` | Discord / email | Add time zone |

**Assigned TA:** Nevin

---

## Communication

| Topic | Agreement |
|---|---|
| Primary channel | Discord |
| Backup channel | Email |
| Response time | Within 24 hours on weekdays |
| Urgent issues | Message directly and tag the other person |
| Silence | If someone has not responded in 48 hours, the other teammate notifies the TA |

Technical discussion about a specific task belongs in the GitHub issue or pull request, not in chat, so decisions stay recorded.

---

## Meetings

| Meeting | When | Purpose |
|---|---|---|
| Weekly sync | Add day and time | Review the board, assign the next issues, unblock each other |
| Mid-week check-in | Add day and time | Short status update, no agenda needed |
| Before a deadline | As needed | Test together and confirm the deployed app works |

Agreements:

- Whoever cannot attend posts a written update in Discord beforehand.
- Every meeting ends with each person knowing which issue they own next.
- Meeting decisions that change scope are written into the relevant planning document.

---

## Availability

| Team Member | Typical Working Hours | Days Unavailable |
|---|---|---|
| Dhimy Jean | Add hours | Add days |
| Daniel | Add hours | Add days |

Post in Discord as early as possible if availability changes for more than a day.

---

## Git and GitHub Workflow

1. Pick an issue from the project board and move it to **In Progress**.
2. Create a branch from an up-to-date `main` using the branch name listed on the board.
3. Commit in small, working steps.
4. Push the branch and open a pull request that links the issue.
5. Move the issue to **In Review**.
6. The other teammate reviews it.
7. Merge into `main` after approval, delete the branch, and move the issue to **Completed**.

Rules:

- Never commit directly to `main`.
- Never force push to `main`.
- Never commit `.env`, `node_modules`, or a database connection string.
- Pull the latest `main` before starting a new branch.
- One issue per branch, one branch per pull request.

### Branch Naming

| Prefix | Use |
|---|---|
| `planning/` | Planning and design documents |
| `chore/` | Setup, configuration, tooling |
| `feature/` | New functionality |
| `test/` | Testing work |
| `deploy/` | Deployment work |
| `docs/` | Documentation |
| `fix/` | Bug fixes |

### Commit Messages

Write short, present-tense messages describing what the commit does:

```text
Add JobApplication model
Return 404 when application is not found
Fix create form validation for empty company
```

---

## Pull Request Rules

- A pull request must link its issue number.
- A pull request must describe what changed and how it was tested.
- Include a screenshot for any visible UI change.
- Keep pull requests small enough to review in about fifteen minutes.
- Do not merge your own pull request without a review from the other teammate.
- Review within 24 hours on weekdays, or say when you can get to it.

### Review Standards

Reviewers check that:

- The change does what the issue describes
- The code runs locally without errors
- Naming matches the standard in `JOB-APPLICATION-TABLE-DESIGN.md`
- No secrets or `.env` files are included
- Loading, empty, and error states are handled for any new fetching page
- `npm run lint` and `npm run build` pass for frontend changes

Review feedback is about the code, never the person. Ask questions rather than issuing commands: "What happens if the API returns 404 here?" rather than "This is wrong."

---

## Code Standards

- JavaScript only, no TypeScript.
- Use the naming standard in `JOB-APPLICATION-TABLE-DESIGN.md` for every model, table, field, route, and file: `JobApplication`, `job_applications`, `dateApplied`, `jobLink`.
- Components and pages use PascalCase filenames with a `.jsx` extension.
- Keep fetch calls inside the page or component that uses the data. Do not add a shared API service file during the MVP.
- Keep routing in `App.jsx`, the database connection in `db.js`, and route handlers in `routes/applications.js`.
- All styles go in `index.css`. No CSS framework in the MVP.
- Remove commented-out code and leftover `console.log` calls before opening a pull request.

---

## Scope Discipline

- Nothing marked P2 begins until every P0 issue on the project board is Completed.
- Authentication is out of scope for this project and must not be started.
- No additional database tables during the MVP.
- If one teammate wants to add something not on the board, it becomes a new issue and the team agrees on its priority first.

---

## Getting Unblocked

If you are stuck for more than **45 minutes**:

1. Write down what you tried and what error you are seeing.
2. Post it in Discord with the error message.
3. Move the issue to **Blocked** on the board and note why.
4. If the team cannot resolve it within a day, bring it to the TA.

Being blocked is normal. Staying silently blocked is the problem.

---

## Handling Disagreements

1. Both people explain their reasoning in the issue or pull request, in writing.
2. Pick the option that is simpler and closer to the documented plan.
3. If there is still no agreement, ask the TA and follow that guidance.
4. Record the decision in the relevant planning document so it is not relitigated.

Disagreements are resolved before merging, not after.

---

## Work Distribution

- Neither teammate owns the frontend or the backend exclusively. Both work on both.
- Pair on anything neither person has done before, such as the first Neon and Render deployment.
- If one teammate finishes early, they pick up the next Ready issue rather than expanding the scope of their own.

---

## Definition of Done

A task is done when:

- The code works locally
- It has been manually tested against the checklist in the relevant README
- It is merged into `main` through a reviewed pull request
- The board is updated

---

## Agreement

| Team Member | Agreed | Date |
|---|---|---|
| Dhimy Jean | | |
| Daniel | | |
