# Milestone 5 - Deployment

So far, we have been working on and developing our project locally in development mode. Now we want to take our Next.js app to "production".

## Development vs Production

So far we have been running the project with `npm run dev`. This means:

- It runs locally on your machine.
- Hot-reloading: when you change the code, Next.js automatically rebuilds and reruns it.
- Detailed warnings, error messages and stack traces.
- Fast iterations for development!

For production, the requirements are different:

- The code is not going to change.
- We want the code to run fast
  - with minified JS / CSS
  - static generation when possible
- It must be usable from anywhere, not only your machine.

We can create a production version of our app using `npm run build`, and run it with `npm start`.

### Test the production build locally

Always do this before you deploy. Some problems (type errors, pages that access the database at build time) do not show up in `npm run dev`, but they will make the deployment fail.

```sh
npm run build
npm start
```

Open `http://localhost:3000` and test the app (login, tweeting, likes) the way you would in development.

### Next.js output modes

Next.js has different options for the output of projects. [You can read more about them here](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

By default, Next.js automatically traces each page and its dependencies to determine all of the files that are needed for deploying a production version of your application. This helps reduce the size of deployments drastically.

`standalone` mode creates a folder at `.next/standalone` which can be deployed on its own without installing `node_modules`. Additionally, a minimal `server.js` file is output which can be used instead of `next start`. You have to switch it on in the Next.js config file:

```js
// next.config.mjs (JavaScript)
const nextConfig = { output: "standalone" };
export default nextConfig;
```

```ts
// next.config.ts (TypeScript)
import type { NextConfig } from "next";

const nextConfig: NextConfig = { output: "standalone" };
export default nextConfig;
```

Additionally, there is the `export` mode, [which you can read more about here](https://nextjs.org/docs/app/guides/static-exports). It builds all of your pages to static HTML / JS / CSS. However, this mode has [many caveats](https://nextjs.org/docs/app/guides/static-exports#unsupported-features):

- No API routes (meaning no databases)
- No dynamic routes
- No middleware / proxy
- And many others

Choose this option _only_ if you have a static website with no backend. This mode is great when you want to deploy to GitHub Pages. Our Twitter clone has API routes and a database, so it cannot be hosted there.

### Edge cases

Let's say you have this page:

```jsx
export default async function ShowCompany() {
  await makeSureDbIsReady();
  const allCompanies = await Company.find({});
  return (<>
  {allCompanies.map(...)}
   </>
  )
}
```

What do you think can go wrong when you try to build this app for production?

<details>
<summary>Answer</summary>

This won't work unless the database is running when you run the build. Next.js will try to connect to the database to read the data and create the page at build time, which may not work.

We have two options to deal with this:

_Use fetch instead of server components_

By using `fetch` inside of `useEffect`, Next.js won't fetch the data when building the app, but the browser will do the fetch request when you open the page.

_`force-dynamic`_

We can tell Next.js to not prebuild this page, but to run it dynamically on every request using the dynamic option. Inside of your `page.js` (or `page.tsx`) file, add

```js
export const dynamic = "force-dynamic";
```

You can read more about the dynamic options [here](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic).

(Our Twitter clone fetches its data from API routes in the browser, so this problem does not apply to it.)

</details>

## Deploying your App

Deployment means running your app on a different machine than your local one, so that it is reachable from the internet, not just on `localhost`. This also means that you need a database that is reachable from the internet, so a local database won't work. We use MongoDB Atlas for that.

If you want, you can also buy a domain and make your app accessible through that domain.

App deployment is a very, very big topic, and in this lesson we are going to talk broadly about the concepts. Don't be worried if you don't understand all of it, not many do.

There are many ways to deploy Next.js, [you can see them here](https://nextjs.org/docs/app/getting-started/deploying).

### Before you deploy: checklist

1. **Secrets stay out of Git.** `.env.local` and any file with credentials must be listed in `.gitignore`. Check it:

   ```sh
   git check-ignore -v .env.local .next node_modules
   git ls-files | grep env
   ```

   The second command should only list `.env.local.example`.

2. **The production build works locally** (`npm run build`, see above).
3. **The project is on GitHub.** Commit your code and publish the repository.

If a secret was ever committed, deleting the file is not enough, because it stays in the Git history. Change it (new database password, new `JWT_SECRET`).

### Vercel

Vercel is the company that created Next.js, and they provide an easy way to deploy your app. [You can read more about it here](https://vercel.com/docs). Deploying a simple app that does not have a lot of traffic is free!

The process is simple:

- Create an account on [Vercel's Website](https://vercel.com/signup)
- Allow Vercel access to your GitHub account
- Import the project you want to deploy
- Add your environment variables (see below)

![Example](https://content-media-cdn.codefinity.com/courses/383258e5-c318-41bc-b29c-0495ff30ccbe/deployment-%26-database/deployment-step-1-min.png)

![Example 2](https://miro.medium.com/v2/resize:fit:720/format:webp/1*l63mFft_EHwmWy9g-Vzvaw.png)

Vercel is going to build your app, deploy it for you, and give you a URL! Every push to `main` creates a new deployment, and other branches get their own preview URL.

#### Environment variables

Vercel never sees your `.env.local`, because it is not on GitHub. Before the first deploy, add the variables yourself under **Environment Variables** in the project settings:

- `MONGODB_URI`
- `JWT_SECRET`

Use new, strong values for production. Do not give them a `NEXT_PUBLIC_` prefix, because those variables are sent to the browser. If you change a variable later, **redeploy**, because the old deployment keeps the old value.

#### Atlas network access

Vercel does not run your app from one fixed IP address, so Atlas cannot be told which machine to allow. In Atlas, under **Network Access**, add `0.0.0.0/0` ("allow access from anywhere"). The database is then protected only by TLS and the database user's password, so:

- use a strong, unique password,
- give the production database user only `readWrite` on your one database,
- keep separate users for development and production.

Locking the database down to fixed IPs is possible with paid options, but beyond this course.

If the app builds but login or data fails, check the function logs in Vercel and the Network Access list in Atlas.

#### Production basics

- **CORS:** our pages and `/api` routes are served from the same origin, so no CORS settings are needed. They only matter if another website or app calls your API. Then you set the headers in the route handler or in `next.config`.
- **Authorization:** check the user inside every API route that changes data, not only in the `proxy` file.
- **Cookies:** the JWT cookie should be `httpOnly` and `secure`.

### Netlify

Another big provider that allows you to deploy your app in a process very similar to Vercel, you can [read more about it here](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/).

### Docker

This is an advanced way of deploying your app and requires a lot of control and understanding.

Docker containers are reusable applications that you can run anywhere. In a very similar way to how we can run MongoDB locally, we can create a Docker container for our app and deploy it anywhere.

We need to have [Docker](https://www.docker.com/get-started/) installed to be able to do this. Using the `standalone` mode (see above) is the best for this kind of deployment.

First we create a `Dockerfile`:

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
ENV HOSTNAME=0.0.0.0 PORT=80
CMD [ "node" , "server.js"]

```

(Remove the `public` line if your project has no `public` folder.)

And then we can build a Docker image from this:

```sh
docker build . -t my-website
```

Secrets do not belong inside the image. Pass them when you run the container:

```sh
docker run -p 3000:80 -e MONGODB_URI="..." -e JWT_SECRET="..." my-website
```

There are many places to run our Docker container, such as `AWS`, `Azure`, `GCP`, `DigitalOcean`, and many others. As an example with `GCP`, we can use [Google Cloud Run](https://cloud.google.com/run) to run your container. [More info here](https://github.com/nextjs/deploy-google-cloud-run). You need a GCP account to be able to do this. The first couple of months are free, but then it is paid.

First, we need a Google Cloud project and a registry to store our Docker image (Google is moving from `gcr.io` to Artifact Registry, so check the current docs for the exact image path).

```sh
gcloud config set project YOUR_PROJECT_ID
gcloud auth configure-docker
```

Then we can build and push our container:

```sh
docker build . -t gcr.io/YOUR_PROJECT_ID/nextjs-app
docker push gcr.io/YOUR_PROJECT_ID/nextjs-app
```

Finally, we can tell GCP to run our container:

```sh
gcloud run deploy nextjs-app \
  --image gcr.io/YOUR_PROJECT_ID/nextjs-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Of course, there are many additional edge cases to handle to be able to achieve this that we won't cover in this course. This should just give you a rough idea of what the process would look like.

The easiest approach is to deploy on Vercel, and you can do this for now if you want.
