# A simple git flow for two-project student work

*For a React (Vite) frontend + Express backend — and getting ready to join a team*

## 1. Repo setup

Keep the frontend and backend as **two separate repos** — not one monorepo — unless you have a specific reason to combine them. This mirrors how most teams work.

```bash
# frontend
npm create vite@latest my-app -- --template react
cd my-app
git init
git add .
git commit -m "Initial commit: Vite + React scaffold"

# backend
mkdir my-app-api && cd my-app-api
npm init -y
git init
git add .
git commit -m "Initial commit: Express scaffold"
```

Push each to its own GitHub repo (e.g. `my-app` and `my-app-api`).

## 2. The branching model: GitHub Flow

Don't use full Git Flow (release branches, hotfix branches, etc.) — that's built for teams with scheduled releases. Use **GitHub Flow**, the lightweight version almost every modern team actually uses:

- `main` — always working, always deployable code
- `feature/xyz` — one branch per feature, fix, or task

![GitHub Flow diagram](./github-flow-diagram.svg)

*The GitHub Flow loop — repeat this for every feature, fix, or task.*

## 3. The daily loop, step by step

```bash
git checkout main
git pull                      # start from the latest code
git checkout -b feature/thing # branch for this change

# ...write code...

git add .
git commit -m "Add thing"
git push -u origin feature/thing
```

Open a Pull Request on GitHub — even solo, it's good practice for reviewing your own diff before merging. Once it's approved and merged:

```bash
git checkout main
git pull
git branch -d feature/thing
```



## 4. Habits that matter even more on a team

These matter on solo projects too, but they become essential once other people are pushing to the same repo:

- **Pull `main` before you branch, every time.** `main` moves without you on a team — starting from a stale `main` is the #1 cause of painful merge conflicts.
- **Keep branches and PRs small and focused.** One feature or fix per branch. A 40-line PR gets reviewed fast; a 400-line PR doesn't.
- **Write PR descriptions like the reviewer has zero context**: what changed, why, and how to test it.
- **Never force-push to `main` or a shared branch.** Be careful force-pushing your own feature branch once a teammate may have pulled it.
- **Resolve conflicts locally, not in the GitHub UI**, for anything non-trivial:

```bash
git checkout feature/xyz
git pull origin main    # or: git fetch && git merge origin/main
# fix conflicts, then:
git add .
git commit
git push
```

- **Respond to review comments instead of fixing silently** — reply on each thread, then re-request review.

Ask your new team on day one whether they prefer **merge commits, squash-and-merge, or rebase** when landing a PR — teams differ, and it changes how the commit history reads.

## 5. `.gitignore` essentials

Add this to both projects — generated content and secrets should never be committed:

```
node_modules/
dist/
.env
.env.local
```

Never commit `.env` files (API keys, secrets). Use a `.env.example` file instead to show what variables are needed.

![alt text](image.png)

# A simple git flow for two-project student work

*For a React (Vite) frontend + Express backend — and getting ready to join a team*

## 1. Repo setup

Keep the frontend and backend as **two separate repos** — not one monorepo — unless you have a specific reason to combine them. This mirrors how most teams work.

```bash
# frontend
npm create vite@latest my-app -- --template react
cd my-app
git init
git add .
git commit -m "Initial commit: Vite + React scaffold"

# backend
mkdir my-app-api && cd my-app-api
npm init -y
git init
git add .
git commit -m "Initial commit: Express scaffold"
```

Push each to its own GitHub repo (e.g. `my-app` and `my-app-api`).

## 2. The branching model: GitHub Flow

Don't use full Git Flow (release branches, hotfix branches, etc.) — that's built for teams with scheduled releases. Use **GitHub Flow**, the lightweight version almost every modern team actually uses:

- `main` — always working, always deployable code
- `feature/xyz` — one branch per feature, fix, or task

![GitHub Flow diagram](./github-flow-diagram.svg)

*The GitHub Flow loop — repeat this for every feature, fix, or task.*

## 3. The daily loop, step by step

```bash
git checkout main
git pull                      # start from the latest code
git checkout -b feature/thing # branch for this change

# ...write code...

git add .
git commit -m "Add thing"
git push -u origin feature/thing
```

Open a Pull Request on GitHub — even solo, it's good practice for reviewing your own diff before merging. Once it's approved and merged:

```bash
git checkout main
git pull
git branch -d feature/thing
```


## 4. Habits that matter even more on a team

These matter on solo projects too, but they become essential once other people are pushing to the same repo:

- **Pull `main` before you branch, every time.** `main` moves without you on a team — starting from a stale `main` is the #1 cause of painful merge conflicts.
- **Keep branches and PRs small and focused.** One feature or fix per branch. A 40-line PR gets reviewed fast; a 400-line PR doesn't.
- **Write PR descriptions like the reviewer has zero context**: what changed, why, and how to test it.
- **Never force-push to `main` or a shared branch.** Be careful force-pushing your own feature branch once a teammate may have pulled it.
- **Resolve conflicts locally, not in the GitHub UI**, for anything non-trivial:

```bash
git checkout feature/xyz
git pull origin main    # or: git fetch && git merge origin/main
# fix conflicts, then:
git add .
git commit
git push
```

- **Respond to review comments instead of fixing silently** — reply on each thread, then re-request review.

Ask your new team on day one whether they prefer **merge commits, squash-and-merge, or rebase** when landing a PR — teams differ, and it changes how the commit history reads.

## 5. `.gitignore` essentials

Add this to both projects — generated content and secrets should never be committed:

```
node_modules/
dist/
.env
.env.local
```

Never commit `.env` files (API keys, secrets). Use a `.env.example` file instead to show what variables are needed.