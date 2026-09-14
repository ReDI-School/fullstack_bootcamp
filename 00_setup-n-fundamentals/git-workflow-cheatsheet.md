# Git Workflow — Cheat Sheet

A generic step-by-step routine for preparing and committing changes to GitHub.

## 1. Navigate to your project folder
```
cd ~/Schreibtisch/DCP - ReDI school/bootcamp
```

## 2. Check your branch and status
```
git branch
git status
```
Confirms which branch you're on and whether anything is uncommitted from last time. New/untracked files show up in red.

## 3. Pull the latest changes
```
git pull
```
Do this **before** editing anything, so your local copy matches GitHub and you avoid conflicts.

> Note: `git fetch` alone only downloads changes without merging them. `git pull` does both — use `git pull` for this routine.

## 4. Make your edits
Do your actual work — add, edit, or delete files as needed.

## 5. Review what changed
```
git status
git diff
```
`git diff` shows the exact line-by-line changes before you stage anything.

## 6. Stage your changes
```
git add .
```
Or stage a specific file only:
```
git add <filename>
```

## 7. Commit with a clear message
```
git commit -m "short description"
```
Example: `git commit -m "prep 20oct26 milestone 2 React"` — including the date and topic makes history easy to scan later.

## 8. Push to GitHub
```
git push
```

## 9. (Optional) Verify
Check the repository page in your browser, or run:
```
git log
```
