# 🚀 Milestone 5 – Deployment

Alice has finished her app. It has a login, a database and a Like button, and it works perfectly on her laptop. Her friend asks: _"Can I try it?"_ Alice says: _"Sure, come over."_

That is the problem this milestone solves. So far, everything ran on `localhost`, which means _this machine_. Deployment means running your app on another machine that is reachable from the internet, together with everything the app needs: its code, its database and its secrets.

And somewhere out there, Mallory is waiting for every mistake Alice makes on the way: a password pushed to GitHub, a database open to the world, a secret shipped to the browser.

> [!NOTE]
> This milestone is more about **concepts and a few careful steps** than about code. Don't worry if you don't understand every detail of hosting. It is a huge topic, and you only need to go as deep as your app requires.

## 📑 Table of contents

1. [The red line: six levels](#-the-red-line-six-levels)
2. [Expected outcomes](#-expected-outcomes)
3. [Development vs production](#1-development-vs-production)
4. [Levels 0–2: static websites](#2-levels-02-static-websites)
5. [Next.js output modes](#3-nextjs-output-modes)
6. [The build-time edge case](#4-the-build-time-edge-case)
7. [Level 3: Next.js with a public API](#5-level-3-nextjs-with-a-public-api)
8. [Level 4: Next.js with a `db.json` file](#6-level-4-nextjs-with-a-dbjson-file)
9. [Before you deploy: the checklist](#7-before-you-deploy-the-checklist)
10. [Level 5: Vercel + MongoDB Atlas](#8-level-5-vercel--mongodb-atlas)
11. [Production basics (and where CORS lives)](#9-production-basics-and-where-cors-lives)
12. [Netlify](#10-netlify)
13. [Level 6: Docker](#11-level-6-docker)
14. [Cloud Run (concept only)](#12-cloud-run-concept-only)
15. [Mallory's test](#-mallorys-test)
16. [Common problems](#-common-problems)
17. [Task](#-task)
18. [Takeaways](#-takeaways)
19. [Check yourself](#-check-yourself)
20. [Glossary](#-glossary)
21. [Further reading](#-further-reading)

## 🧭 The red line: six levels

We start with the simplest website imaginable and climb one level at a time. At every level you ask three questions:

1. **What do I have to set up?**
2. **What can I show?**
3. **Where does it stop working?**

| Level | What you deploy                  | Things to set up                                                | Where it stops working                                                   |
| ----- | -------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 0     | One HTML file (plus a fetch)     | 1: put the file online                                          | The API must allow your page (CORS). There is no backend.                |
| 1     | A React app (Vite)               | 2: run the build, upload `dist`                                 | Refresh on a route can give a 404. Secrets in the bundle are public.     |
| 2     | React plus a data source         | 3: frontend, API, a place for the data                          | `json-server` is a second program. Files on cloud servers are temporary. |
| 3     | Next.js with a public API (M1)   | 3: Git repo, Vercel project, a local production build           | Static export loses everything that needs a server.                      |
| 4     | Next.js with `db.json` (M2)      | 4: app host, API process, writable storage, a way to reach them | The filesystem is read-only or temporary. Writes don't survive.          |
| 5     | Next.js with MongoDB (M3/M4)     | 6: see [chapter 8](#8-level-5-vercel--mongodb-atlas)            | Missing env variables, Atlas access rules, forgotten redeploy.           |
| 6     | Docker and other platforms       | Outlook only                                                    | You now run the server yourself.                                         |

> [!NOTE]
> The numbers are a teaching device, not an exact science. What matters is the direction: **every level adds something you must set up**, and every level has a point where the previous solution breaks.

### 🍽️ One picture for all levels: the restaurant

- **Printed menu = static files.** HTML, CSS and JavaScript. Anyone can read them, and nothing is cooked when you visit.
- **Kitchen = server code.** It runs when someone orders: login, API routes, secrets.
- **Pantry = database.** It stores the ingredients. In our course that is MongoDB Atlas, a separate service.

Keep this picture in mind. Most deployment questions boil down to _"Do I need a kitchen, and where is the pantry?"_

## 🎯 Expected outcomes

After this milestone you can:

- explain the difference between development, build and deployment,
- decide whether an app can live on a static host or needs a server,
- test a production build locally before you deploy,
- deploy your Next.js app with MongoDB to Vercel, with secrets stored safely,
- explain why `0.0.0.0/0` in Atlas is a trade-off, and how to limit the damage,
- say what changes when you push to GitHub, and what doesn't,
- describe in a few sentences what Docker and Cloud Run add.

## 1. Development vs production

So far we ran the project with `npm run dev`. That means:

- It runs locally on your machine.
- **Fast Refresh:** when you save a file, the dev server sends the changed code to your open browser tab, and the page updates without a full reload.
- You get detailed warnings, error messages and stack traces.
- Iteration is fast.

Production has different requirements:

- The code does not change while it runs.
- It should be fast: minified JS and CSS, and static generation where possible.
- It must be reachable from anywhere, not only from your machine.

We create the production version with:

```sh
npm run build
npm start
```

There are three separate things here, and it helps to keep them apart:

| Step           | What happens                                                          |
| -------------- | --------------------------------------------------------------------- |
| **Develop**    | You write code and run it with development tooling.                   |
| **Build**      | The tooling creates the production output.                            |
| **Deploy**     | That output, plus its configuration, is put on a machine you can reach. |

> [!TIP]
> `npm run build` followed by `npm start` runs the production version on your own machine. Many errors that `npm run dev` tolerates (type errors, build-time database access) only show up here. Find them locally, not during a failed deployment.

**In one sentence:** development is for writing, the build creates the production output, and deployment puts that output where others can reach it.

## 2. Levels 0–2: static websites

Before Next.js, let's look at what you can deploy with almost no setup.

### Level 0: one HTML file

A single HTML page can fetch data from a public API and show it. Put it online with:

- **GitHub Pages:** put the page in a repository and turn on Pages in the repository settings.
- **Netlify Drop:** drag the folder into the browser. It takes seconds.

A whole folder works too, for example a presentation with screenshots next to the HTML file. Keep the paths **relative** (`./screenshots/cookie.png`), and they keep working after the upload.

**Where it stops:** the API must allow requests from your page's origin. This rule is called **CORS**. The browser enforces it, and the API grants the permission. It is a shop _front end_, not a shop: payments need a backend.

### Level 1: a React app (Vite)

You can't upload React source code. The browser needs the **built** files:

```sh
npm run build
```

Upload the output folder (`dist`) to GitHub Pages or Netlify. A React app that only uses browser state (such as Context) works fine this way. Context needs no server.

**Where it stops:**

- **Refresh on a route:** if your app uses client-side routing, pressing F5 on `/cart` asks the server for a file called `cart`, which doesn't exist: **404**. Static hosts need a fallback to `index.html`. On Netlify, a `_redirects` file in your `public` folder (so it ends up in `dist`) does it:

  ```
  /* /index.html 200
  ```

- **Subpath:** a GitHub Pages project site lives under `/your-repo/`. Vite needs a matching `base` setting in `vite.config.js` (or `.ts`), or scripts and styles won't load:

  ```js
  export default defineConfig({ base: "/your-repo/" });
  ```

- **Secrets:** everything in a React bundle is visible to every visitor. An API key in your frontend code is public. This is the real reason we need a server.

### Level 2: React plus a data source

- **A public API:** nothing extra to deploy. CORS applies again.
- **`json-server` with `db.json`:** this is a second program that has to run somewhere. Uploading the frontend does not upload `json-server`. And a file on a cloud server is usually temporary (more in [chapter 6](#6-level-4-nextjs-with-a-dbjson-file)).

> [!NOTE]
> Words you will hear: a React app like this is a **single-page application (SPA)**: one HTML page where React swaps the views in the browser. That is why a built Vite app is "just files", and why a refresh on `/cart` can 404. Don't call Next.js an SPA. It renders on the server and has API routes. The useful dividing line is **full-stack**: does your own code run on a server?

**In one sentence:** static hosting is enough as long as nothing has to run on a server when someone visits.

## 3. Next.js output modes

Next.js can produce different outputs. [The output reference is here](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

**Default.** Next.js traces each page and its dependencies and keeps only the files needed to run the production version. This keeps deployments small.

**`standalone`.** Creates a folder at `.next/standalone` that can run on its own, without installing `node_modules`. It includes a minimal `server.js` that you use instead of `next start`. We use this for Docker.

**`export`.** Builds your pages to static HTML, JS and CSS in an `out` folder. [Read the guide here](https://nextjs.org/docs/app/guides/static-exports). It can go on any static host, for example GitHub Pages. But it only works if your app needs no server at request time. According to the guide, these are **not** supported:

- dynamic routes without `generateStaticParams()`,
- route handlers that depend on the incoming request,
- cookies,
- rewrites, redirects and headers,
- **Proxy** (the successor of `middleware`),
- Server Actions,
- Incremental Static Regeneration and Draft Mode,
- image optimization with the default loader.

What _does_ work: Server Components (they run once, at build time), Client Components, and route handlers that only answer `GET` with static data.

> [!IMPORTANT]
> Choose `export` only for sites without a backend. Your M4 app has login, protected API routes and Proxy, so it needs a server. It cannot be a static export.

**In one sentence:** the default and `standalone` modes need a server, `export` produces only files.

## 4. The build-time edge case

Say you have this page (imports left out):

```jsx
export default async function ShowCompany() {
  await makeSureDbIsReady();
  const allCompanies = await Company.find({});
  return <>{allCompanies.map(/* ... */)}</>;
}
```

What do you think can go wrong when you build this app for production?

<details>
<summary>Answer</summary>

Next.js prepares pages that don't depend on the incoming request **at build time**. For this page, that means it tries to connect to the database while you run `npm run build`. If the database isn't reachable from the build machine (or the connection string isn't set there), the build fails or the page shows stale data.

The fix is to tell Next.js not to prepare this page in advance, but to run it on every request. In your `page.js` (or `page.tsx`):

```js
export const dynamic = "force-dynamic";
```

[More about the `dynamic` option](https://nextjs.org/docs/app/guides/caching-without-cache-components#dynamic).

> [!NOTE]
> Our apps read data through API routes and `fetch`, so this exact case may not appear in your project. But you will meet it as soon as a Server Component talks to a database directly.

</details>

**In one sentence:** code that runs at build time needs everything it uses to be available at build time.

## 5. Level 3: Next.js with a public API

In M1 we fetched data from a public API. This is the first time we meet **Vercel**, the company behind Next.js. Deploying a small app with little traffic is free.

The path is short:

1. Put the project in a GitHub repository (see the [checklist](#7-before-you-deploy-the-checklist)).
2. Create an account on [Vercel](https://vercel.com/signup) and let it access your GitHub account.
3. Import the repository. Vercel builds your app and gives you a URL.

Now ask: **where does the fetch run?**

| Where                 | What happens                                                                        |
| --------------------- | ----------------------------------------------------------------------------------- |
| In the browser        | CORS applies. The API must allow your deployed site.                                |
| On the server         | No CORS, but the server must be able to reach the API.                              |
| During the build      | The result can become a snapshot, frozen at the time of the build.                  |

**Where it stops:** a static export of this app could go on GitHub Pages, but you lose everything that needs a server (see [chapter 3](#3-nextjs-output-modes)). The M1 app might survive that. The M4 app can't.

**In one sentence:** with a public API, deployment is mostly "connect the repository, press deploy", and the only question is where the fetch runs.

## 6. Level 4: Next.js with a `db.json` file

In M2 we used a local `db.json`. What happens when you deploy that?

First, `localhost` means _this machine_:

- Code running **in the browser** that calls `localhost:3001` calls the **visitor's** computer, not yours and not the server.
- Code running **on the server** calls the server it runs on.
- Neither one can reach your laptop, unless you are the one visiting.

CORS only enters the picture when the _browser_ calls an API on another origin (a different port counts as a different origin). Calls from server to server don't involve it.

Second, **writing** to a file is the real problem. On Vercel, [functions have a read-only filesystem, with a writable `/tmp` scratch area](https://vercel.com/docs/functions/runtimes). So reading `db.json` may work if the file ends up in the deployment, but adding or changing data fails or disappears again. Other platforms have the same issue in a different form: free [Render web services lose local file changes on every restart, redeploy or spin-down](https://render.com/docs/free).

> [!IMPORTANT]
> A file on a cloud server is not a database. The app may deploy successfully and then break the moment someone clicks "Save". Use a real database (that's why we use MongoDB Atlas).

**In one sentence:** an app can deploy fine and still break at the first write, because cloud servers don't keep the files you write.

## 7. Before you deploy: the checklist

Do these three steps before you go near Vercel.

### 1. Secrets stay out of Git

Check that your local env files are in `.gitignore`:

```sh
git check-ignore -v .env.local
git ls-files | grep -i env
```

The first command prints the rule that ignores the file. The second lists tracked files with `env` in their name. `.env.local` must **not** appear. A file like `.env.local.example` (without real values) is fine.

### 2. Test the production build locally

```sh
npm run build
npm start
```

Open `http://localhost:3000` and test login, tweeting and likes. TypeScript errors fail the build, so students with the TS version should find them here.

### 3. Push to GitHub

Vercel deploys from a repository:

```sh
git init
git add .
git commit -m "Initial commit"
```

Then publish the repository from VS Code, or create it on GitHub and `git push`.

> [!WARNING]
> If you committed a secret by accident, deleting the file in a new commit is **not enough**. The old commit still contains it, and so does everything cloned from it. Treat the secret as leaked and rotate it (see [chapter 8](#rotate-a-leaked-secret)).

**In one sentence:** before you deploy, check your secrets, run the production build and push your code.

## 8. Level 5: Vercel + MongoDB Atlas

This is the big one: Next.js with MongoDB. Picture the restaurant again: your app (the kitchen) runs on Vercel, and the pantry is **Atlas**, a separate service on the internet. Deploying the app does **not** copy your local data. And Vercel never sees your `.env.local`, so you must give it the secrets yourself.

Count what you need to set up:

1. A GitHub repository,
2. A Vercel project connected to it,
3. An Atlas cluster and a database user,
4. Atlas network access,
5. The environment variables `MONGODB_URI` and `JWT_SECRET`,
6. A deployment that happens **after** the variables are set.

### Step by step

1. **Import** the repository in Vercel.
2. **Environment variables.** Before the first deploy, open the project's **Environment Variables** settings and add `MONGODB_URI` and `JWT_SECRET`. Use **new values for production**, not the ones from your laptop. Do **not** use a `NEXT_PUBLIC_` prefix.
   - Select the environments each variable applies to (Production, Preview, Development). If a variable is only set for Production, preview deployments won't have it.
   - If Vercel offers a "Sensitive" option for the variable, use it. Then the value can't be read back later.
3. **Atlas access.** In Atlas, open **Network Access** (under **Security**) and add `0.0.0.0/0` ("allow access from anywhere"). See the box below for why.
4. **Deploy.**
5. Open the URL Vercel gives you. Register a user, log in, tweet and like.

> [!IMPORTANT]
> **A change to a variable only applies to new deployments.** [Vercel's docs](https://vercel.com/docs/projects/environment-variables/managing-environment-variables) say you must redeploy for it to take effect. The old deployment keeps the old values.

### Why `0.0.0.0/0`, and why it isn't a toy setting

Vercel deployments use dynamic outgoing IP addresses by default, so Atlas can't be told "only allow this one machine". Atlas's documentation says that without private networking or a fixed IP, you must allow all addresses (`0.0.0.0/0`). That means your database is reachable from anywhere on the internet. The only barriers are TLS, the database user's password and the user's role.

That is a common setup in real small projects, and it is a **deliberate trade-off**. What makes it professional is that you know it, and you limit the damage:

| Measure                                   | How                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| **Strong, unique password**               | A long random password, used nowhere else.                                          |
| **Least-privilege database user**         | `readWrite` on **one** database, not "Atlas admin" or "read and write to any database". |
| **Separate dev and prod**                 | Different user (ideally a different database) for the deployed app.                 |
| **Close the gap later**                   | Fixed IPs are available as a paid option ([Vercel Static IPs](https://vercel.com/docs/networking/static-ips) for Pro and Enterprise teams). Then Atlas can allow only those addresses. |

> [!NOTE]
> Atlas sends an alert email when you add a `/0` entry to the access list. That is normal, and a good reminder that you chose this on purpose.

### Preview vs production

- A push to the **production branch** (usually `main`) creates a **production deployment**.
- A push to **any other branch** creates a **preview deployment** with its own URL.

Previews are great for trying changes without touching the live site. Remember that they use the **Preview** variables.

### Three kinds of "update"

These three things all change what a visitor sees, but they are completely different:

| What you do                         | What happens                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| A user clicks **Like**              | React state changes and components render again. No code was edited and nothing was deployed.                 |
| You **save a file** during `npm run dev` | Fast Refresh sends the changed code to the browser. Often local state survives, but some edits remount the component or reload the page. |
| You **push to GitHub**              | Vercel builds and deploys. Visitors see the new version after the deployment finishes and they reload the page. |

A fourth case: you **edit a document in Atlas**. The data changes without any deployment, because the database is a separate service. The app shows the change the next time it reads the data. Try it with your `isLiked` array.

> [!TIP]
> Committing directly on github.com triggers the same deployment as pushing from your machine.

### Logs

If the app builds but login or data fails, check the **function logs** for the deployment in Vercel, then the Network Access list in Atlas. Check access rules before you blame your code.

### Rotate a leaked secret

If a secret reached GitHub, or you just want to be safe:

1. Create a **new password** for the Atlas database user and a **new** `JWT_SECRET`.
2. Update them locally in `.env.local` and in Vercel's environment variables.
3. **Redeploy.**

Rotating `JWT_SECRET` has a visible side effect: tokens signed with the old secret stop working, so everybody is logged out. That is exactly what you want if Mallory had the old one.

**In one sentence:** deploy the app to Vercel, keep the database on Atlas, give Vercel the secrets yourself, and redeploy after every change to them.

## 9. Production basics (and where CORS lives)

**CORS.** Your pages and your `/api` routes are served from the **same origin**, so your apps need no CORS settings. They only become relevant if another website or a mobile app calls your API. In that case the headers can be set:

- in the route handler itself (with an `OPTIONS` export and the `Access-Control-Allow-Origin` header),
- centrally in the Next.js config through `headers()`,
- in `proxy`, if the rule depends on the request.

Never leave `*` in production, especially when cookies are involved.

**Other things that matter more for your app:**

- **Secrets:** unprefixed environment variables stay on the server. Anything named `NEXT_PUBLIC_` is exposed to the browser. Neither `MONGODB_URI` nor `JWT_SECRET` may ever have that prefix.
- **Authorization:** check the user inside every API route that changes data, not only in `proxy`.
- **Cookies:** check how your login route sets the JWT cookie. It should be `httpOnly` and `secure`.
- **Dependencies:** keep `next` and your packages on patched versions.

**In one sentence:** your apps need no CORS settings, but they do need server-side checks and well-guarded secrets.

## 10. Netlify

Netlify is another big provider with a process very similar to Vercel: connect your repository, set environment variables, deploy. It also offers the drag-and-drop upload we used at Level 0. For this course, Vercel is the simplest option, so we stick with it.

## 11. Level 6: Docker

> [!NOTE]
> This is an advanced topic. You don't need it for this course. It is here so you know what the next step looks like.

**Docker containers** are reusable packages of an application that you can run anywhere, in a similar way to how we run MongoDB locally. You need [Docker](https://www.docker.com/get-started/) installed.

### 1. Switch on `standalone` mode

The Dockerfile below copies `.next/standalone`, so the mode must be enabled in your Next.js config:

```js
// next.config.mjs (JS)
const nextConfig = { output: "standalone" };
export default nextConfig;
```

```ts
// next.config.ts (TS)
import type { NextConfig } from "next";
const nextConfig: NextConfig = { output: "standalone" };
export default nextConfig;
```

### 2. Write a `Dockerfile`

```dockerfile
FROM node:24 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
ENV HOSTNAME=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
```

If your project has no `public` folder, remove that `COPY` line.

Also add a `.dockerignore` file, so `COPY . .` doesn't copy your secrets and local files into the image:

```
node_modules
.next
.env*
```

### 3. Build and run it

```sh
docker build . -t my-website
docker run -p 3000:3000 --env-file .env.local my-website
```

The secrets are passed when the container **runs**, never baked into the image.

> [!WARNING]
> Variables that start with `NEXT_PUBLIC_` are baked in at **build** time. Server-side variables like `MONGODB_URI` are read at **run** time. That is why the container needs them when it starts.

**In one sentence:** Docker packages your app and everything it needs, and you take over the work the platform did for you.

## 12. Cloud Run (concept only)

A container can run on many platforms: AWS, Azure, Google Cloud, DigitalOcean and others. As an example, Google's [Cloud Run](https://cloud.google.com/run) runs containers for you. You need a Google Cloud account, and free credits don't last forever.

The rough shape of the process:

1. Create a Google Cloud project and an **Artifact Registry** repository to store your image.
2. Build the image and push it to that repository.
3. Tell Cloud Run to run it.

```sh
gcloud config set project YOUR_PROJECT_ID
gcloud artifacts repositories create nextjs-repo --repository-format=docker --location=europe-west3
gcloud auth configure-docker europe-west3-docker.pkg.dev

docker build . -t europe-west3-docker.pkg.dev/YOUR_PROJECT_ID/nextjs-repo/nextjs-app
docker push europe-west3-docker.pkg.dev/YOUR_PROJECT_ID/nextjs-repo/nextjs-app

gcloud run deploy nextjs-app \
  --image europe-west3-docker.pkg.dev/YOUR_PROJECT_ID/nextjs-repo/nextjs-app \
  --region europe-west3 \
  --allow-unauthenticated
```

> [!NOTE]
> Older tutorials push to `gcr.io/...`. Google's old Container Registry has been shut down, and image URLs now follow the Artifact Registry format `LOCATION-docker.pkg.dev/PROJECT_ID/REPOSITORY/IMAGE`. Cloud Run needs the repository to exist before you push. Check [Google's current guide](https://docs.cloud.google.com/run/docs/deploying) before you try this, as commands and flags change.

> [!TIP]
> If you build on an Apple Silicon Mac, the image may be built for the wrong CPU type. Ask for an `amd64` image with `docker build --platform linux/amd64 ...`.

There are many more details (secrets management, custom domains, scaling) that we won't cover. This should just give you a rough idea of what the process looks like.

**In one sentence:** with containers you can run your app almost anywhere, but you are responsible for the details.

## 🕵️ Mallory's test

Mallory visits your live app. What does she try, and what stops her?

| Mallory tries…                                                  | What should happen                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Opens a protected API route without being logged in             | The route rejects her. The check lives in the route, not only in `proxy`.       |
| Reads your frontend code for passwords or keys                  | She finds none. Secrets are only in server-side environment variables.          |
| Looks through your GitHub history for `.env` files              | There are none. If there ever were, the secrets have been rotated.              |
| Connects to your Atlas cluster with a leaked connection string  | It doesn't work, because the password was changed. The user can't touch other databases. |
| Tries a change made with a stolen old `JWT_SECRET`              | Old tokens are rejected after rotation.                                         |

## 🛠️ Common problems

| Problem                                                    | Likely cause and fix                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Build works locally, fails on Vercel                       | Type errors or build-time database access. Run `npm run build` locally and read the build log.                |
| App loads but login or data fails                          | Missing environment variables, or Atlas Network Access. Check the function logs.                              |
| I changed a variable but nothing happened                  | The old deployment keeps old values. **Redeploy.**                                                            |
| Preview deployment can't connect                           | The variables weren't set for the **Preview** environment.                                                    |
| Connection refused or timeout from Atlas                   | `0.0.0.0/0` is missing from Network Access, or it was removed.                                                |
| Authentication failed for the database user               | Wrong password in `MONGODB_URI`. Special characters in the password must be URL-encoded.                      |
| Everything was fine, now everyone is logged out            | You rotated `JWT_SECRET`. That's expected.                                                                    |
| 404 when refreshing a page on a static host                | Missing fallback to `index.html` (React with client-side routing).                                            |
| Styles and scripts missing on GitHub Pages                 | Missing `base` / base path for a project site under `/your-repo/`.                                            |
| Docker image starts but the app can't reach the database   | Variables not passed at run time, or `HOSTNAME` not set to `0.0.0.0`.                                         |

## ✅ Task

**Core**

1. Run the [checklist](#7-before-you-deploy-the-checklist) for your M4 app: secrets ignored, production build works, code on GitHub.
2. Create a **new** database user for production with `readWrite` on your one database only, and a new `JWT_SECRET`.
3. Deploy to Vercel with the environment variables set. Register, log in, tweet and like on the live URL.
4. Change a variable's value, observe that nothing changes, then redeploy.

**Stretch**

1. Create a branch, push it and find its **preview URL**. Check what happens if the Preview variables are missing.
2. Edit a document directly in Atlas and watch the live app change without a deployment.
3. Make a static export of an earlier project (M1) and put it on GitHub Pages.
4. Run your app in Docker on your own machine.

## 📌 Takeaways

- Development, build and deployment are three different things.
- Ask first: does anything have to run on a server when someone visits? If not, a static host is enough.
- Don't ship secrets in code, in the browser or in Git. If one leaks, rotate it.
- A change to an environment variable needs a new deployment.
- `0.0.0.0/0` is a deliberate trade-off. Limit the damage with a strong password and a least-privilege user.
- A file on a cloud server is not a database.
- Docker and Cloud Run are the next step, not the first one.

## ❓ Check yourself

<details>
<summary>1. What is the difference between development, build and deployment?</summary>

Development means working with development tooling (`npm run dev`). The build creates the production output (`npm run build`). Deployment puts that output, with its configuration, on a machine that is reachable from the internet.

</details>

<details>
<summary>2. Why can't you upload the source code of a Vite React app to a static host?</summary>

The browser needs the built files. You run the build and upload the output folder (`dist`).

</details>

<details>
<summary>3. Why can pressing F5 on <code>/cart</code> give a 404 on a static host?</summary>

The page doesn't exist as a file. React normally switches views in the browser. The host needs a fallback to `index.html` so that React can take over.

</details>

<details>
<summary>4. Can a Next.js app be hosted on GitHub Pages?</summary>

Only as a static export (`output: "export"`), and only if it needs nothing that runs on a server at request time. An app with login, cookies, Proxy or write endpoints can't be exported.

</details>

<details>
<summary>5. Why does a deployed app not reach a <code>localhost</code> API on your laptop?</summary>

`localhost` means "this machine". Browser code calls the visitor's computer, server code calls the server it runs on. Neither reaches your laptop.

</details>

<details>
<summary>6. Why doesn't <code>db.json</code> work as a database on Vercel?</summary>

Vercel functions have a read-only filesystem apart from a temporary `/tmp` area. Reading might work, but writes can't be kept.

</details>

<details>
<summary>7. You changed <code>MONGODB_URI</code> in Vercel, but the live app still uses the old one. Why?</summary>

Environment variable changes only apply to new deployments. Redeploy the project.

</details>

<details>
<summary>8. Why do we allow <code>0.0.0.0/0</code> in Atlas, and how do we limit the risk?</summary>

Vercel deployments use dynamic IP addresses by default, so Atlas can't be told which machine to allow. The risk is limited with a strong unique password, a database user with `readWrite` on one database only, and separate credentials for production. Fixed IPs are a paid option.

</details>

<details>
<summary>9. What is the difference between a click on Like, saving a file, and pushing to GitHub?</summary>

A click changes React state and re-renders components. Saving a file during `npm run dev` triggers Fast Refresh in the browser. A push triggers a build and deployment on Vercel.

</details>

<details>
<summary>10. A secret was pushed to GitHub. What do you do?</summary>

Treat it as leaked. Create new credentials (database password, `JWT_SECRET`), update them locally and in Vercel, and redeploy. Deleting the file in a later commit is not enough.

</details>

## 📖 Glossary

| Term                        | Meaning                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| **Deployment**              | Running your app on a machine that is reachable from the internet.                          |
| **Build**                   | Creating the production version of your app.                                                |
| **Static hosting**          | A host that only serves files (HTML, CSS, JS, images).                                      |
| **Static export**           | A Next.js build that produces only files (`output: "export"`).                              |
| **Fast Refresh**            | The dev server updating your open browser tab when you save a file.                         |
| **SPA**                     | Single-page application: one HTML page where JavaScript switches the views.                 |
| **Full-stack**              | An app where your own code also runs on a server.                                           |
| **CORS**                    | Browser rule that decides whether a page may call an API on another origin.                 |
| **Origin**                  | Protocol, host and port of a website, for example `https://example.com`.                    |
| **Environment variable**    | A setting (often a secret) provided to the app from outside its code.                       |
| **Production / preview**    | The live deployment (usually from `main`) and the deployments for other branches.           |
| **IP access list**          | The list of addresses Atlas allows to connect to your cluster.                              |
| **`0.0.0.0/0`**             | "All addresses": allow access from anywhere.                                                |
| **Least privilege**         | Giving an account only the permissions it needs.                                            |
| **Rotating a secret**       | Replacing a secret with a new value and retiring the old one.                               |
| **Docker image / container**| A packaged app, and a running instance of it.                                               |
| **Artifact Registry**       | Google Cloud's storage for container images.                                                |

## 🔗 Further reading

- [Next.js: deploying](https://nextjs.org/docs/app/getting-started/deploying)
- [Next.js: static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js: output option](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Vercel: managing environment variables](https://vercel.com/docs/projects/environment-variables/managing-environment-variables)
- [Vercel: functions and the filesystem](https://vercel.com/docs/functions/runtimes)
- [Vercel: Static IPs](https://vercel.com/docs/networking/static-ips)
- [MongoDB Atlas: IP access list](https://mongodb.com/docs/atlas/security-whitelist)
- [Google Cloud Run: deploying container images](https://docs.cloud.google.com/run/docs/deploying)
- [Render: free instance limits](https://render.com/docs/free)
- [Docker: get started](https://www.docker.com/get-started/)
- [Template: Next.js on GitHub Pages](https://github.com/nextjs/deploy-github-pages)
- [Template: Next.js on Google Cloud Run](https://github.com/nextjs/deploy-google-cloud-run)
