# 🧭 Git & GitHub Cheat Sheet — Student Reference

> Keep this next to `README.md`. Note: this bootcamp involves **two different GitHub setups** that don't overlap much — this sheet is ordered so you hit the one you actually need first.

---

## At a Glance

| | **Your own project repo** | **The class repo (fork)** |
|---|---|---|
| **Purpose** | Building & submitting your React project for assessment | Optionally pulling updated class material |
| **Repo you use** | A brand-new repo you create yourself | *Your fork* of `ReDI-School/fullstack_bootcamp` |
| **Is it required?** | ✅ Essential — this is how we assess your work | ❌ Optional — nice to have, not required |
| **Main commands** | `git status` / `add` / `commit` / `push` | `git pull upstream main` |
| **Where to find it below** | ↓ Start right here | Bottom of this sheet |

---

## Your Own Project Repo (start here — this is the one you need)

This is the repo you'll actually build in, commit to, and submit for your first React project. There are two ways to start it — pick whichever feels more natural.

### Option A — Start locally, then connect to GitHub
```sh
# In your project folder, in VS Code's terminal:
git init
git add .
git commit -m "Initial commit"

# Then on GitHub: create a new EMPTY repo (no README/gitignore)
# Copy the URL it gives you, then:
git remote add origin https://github.com/[your-username]/[your-repo-name].git
git push -u origin main
```

### Option B — Start on GitHub, then clone it down
```sh
# On GitHub: click "New repository", name it, create it
# Then locally:
git clone https://github.com/[your-username]/[your-repo-name].git
cd [your-repo-name]
# start coding!
```

Either way, you end up with `origin` pointing at **your own repo**. There's no `upstream` here — there's no separate "original" project to sync with. This is simpler than the class repo, and it's the workflow you'll use daily.

### Your everyday workflow (get comfortable with this loop)
```sh
git status                       # see what changed
git add .                        # stage your changes
git commit -m "Add task form"    # save a snapshot
git push                         # send it to GitHub
```
Run `git status` often — it's your safety net and tells you exactly what Git sees before you commit anything.

### Working with branches

Branching is a habit worth building now, even solo — it keeps `main` stable and mirrors how you'll work on a team later.

```sh
git branch                   # see existing branches / confirm where you are
git checkout -b my-feature   # create + switch to a new branch
# ...make changes, add, commit as above...
git push origin my-feature   # push the branch itself to GitHub
```

**Bringing `main`'s updates into your feature branch (safe, beginner-friendly way):**
```sh
git branch               # check where you are
git checkout main        # switch to main
git pull                 # update main from GitHub
git checkout my-feature  # switch back to your branch
git merge main           # bring main's changes into your branch
```
This is the recommended sequence — explicit and easy to follow. (Later on you'll hear about `git rebase` as a fancier alternative; ignore it for now.)

**Bringing your finished branch back into `main`:**
```sh
git checkout main
git merge my-feature
git push
```

### Quick Command Reference — your own repo
| Goal | Command |
|---|---|
| See changed files | `git status` |
| Stage changes | `git add .` |
| Save a snapshot | `git commit -m "message"` |
| Upload to your repo | `git push` |
| Create + switch to a new branch | `git checkout -b branch-name` |
| Switch branches | `git checkout branch-name` |
| Update main, then bring it into your branch | `git checkout main && git pull` then `git checkout your-branch && git merge main` |
| Merge your branch into main | `git checkout main && git merge your-branch` |
| Check your remotes | `git remote -v` |

### Safety Rules — your own repo
- ✅ `git push` is always safe here — it's your repo.
- ✅ Use a branch for every new feature, even solo — never build straight on `main`.
- ✅ Run `git status` before `add`/`commit` — always know what you're about to save.

### FAQ — your own repo
**"I committed to `main` by accident — what now?"**
Don't panic, ask in the coaching session. It's fixable, and it's how most people learn branching for the first time.

**"Which repo do I submit for the React project?"**
This one — your own repo. Link us to it directly, not to any fork of the class repo.

---

---

## Optional: Syncing With the Class Repo (Fork Workflow)

Everything below is **optional**. It's only about *reading* — pulling updated class material into a personal copy. You will not be contributing changes back into the class repo, so there's no branching or pull-request step here, just staying up to date.

### One-time setup
```sh
# 1. Fork the repo on GitHub: https://github.com/ReDI-School/fullstack_bootcamp
#    (creates https://github.com/[your-username]/fullstack_bootcamp)

# 2. Clone YOUR fork
git clone https://github.com/[your-username]/fullstack_bootcamp.git
cd fullstack_bootcamp

# 3. Connect the class repo as "upstream" so you can pull from it
git remote add upstream https://github.com/ReDI-School/fullstack_bootcamp.git
git remote -v
```

### Whenever you want the latest material
```sh
git checkout main
git pull upstream main
```
That's it — no need to `push` anywhere unless you specifically want a backup of this fork on your own GitHub account.

### A note on remotes here
| Name | What it is | Can you push to it? |
|---|---|---|
| **upstream** | The original class repo (`ReDI-School/fullstack_bootcamp`) | ❌ No — read only |
| **origin** | *Your* fork on GitHub | ✅ Yes, but rarely needed for this |

### FAQ — the fork
**"Do I need this at all?"**
No — it's entirely optional. Your assessed work lives in your own repo (see above). This fork is only useful if you want an easy way to pull updated class exercises.

**"`git pull` says there's a conflict."**
That means the class repo and your local `main` both changed the same lines. Flag it in your breakout room — conflict resolution is worth walking through live the first time.

**"Can I make my fork private?"**
GitHub forks of public repos are always public — there's no toggle for that. For coursework, a public fork is completely normal and expected.

---

## Appendix: Visual Cheat Sheets (extra, optional)

These three infographics illustrate the same `origin` vs `upstream` ideas from the optional fork section above, if a picture helps it click. Not required reading.

![Fork sync basics](images/fork-cheatsheet-1-sync-basics.png)

![Origin and upstream connections](images/fork-cheatsheet-2-connections.png)

![Full fork & branch guide](images/fork-cheatsheet-3-full-guide.png)

---

*Companion to `README.md` — Milestone 0: Fullstack Bootcamp*
