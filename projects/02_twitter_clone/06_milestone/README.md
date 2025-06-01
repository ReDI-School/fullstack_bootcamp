# Milestone 6 - Deployment

So far, we have been working and developing our project locally in development mode, but now we want to take our next.js app to "production"

## Development vs Production

So far we have been running the project with `npm run dev`, this includes:

- Runs locally on your machine
- Hot-reloading, when you change the code, next.js automatically builds and runs your code.
- Detailed warnings / error messages and stack traces.
- Fast iterations for development!

For production, there are different requirements

- Code is not going to change
- We want to the code to run fast
  - with minified JS / CSS
  - static generation when possible
- Usable from anywhere, not only your machine

We can create a production version of our app using `npm run build`.

### Next.js output modes

Next.js has different options for outputs of projects. [You can read more about them here](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)

By default, next.js will will automatically trace each page and its dependencies to determine all of the files that are needed for deploying a production version of your application. This feature helps reduce the size of deployments drastically.

`standalone` mode will create a folder at .next/standalone which can then be deployed on its own without installing `node_modules`. Additionally, a minimal `server.js` file is also output which can be used instead of `next start`.

Additionally, there is the `export` mode, [which you can read more about here](https://nextjs.org/docs/app/guides/static-exports), this will build all of your pages to static html / js / css. However, this mode has [many caveats](https://nextjs.org/docs/app/guides/static-exports#unsupported-features):

- No API routes (meaning no databases)
- No Dynamic routes
- No middleware
- And many others

Choose this option _only_ if you have a static website with no backend. This mode is great when you want to deploy to github pages.

### Edge cases

Lets say you have this page:

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

This won't work unless the database is running when you run the build. Next.js will try to connect to the database to read the data to create the page at build time, which may not work.

We have to options to deal with this:

_Use fetch instead of server components_

By using `fetch` inside of `useEffect`, next.js won't fetch the data when building the app, but the browser will do the fetch request when you open the page.

_`force-dynamic`_

We can tell next.js to not build this page, but run this dynamically on every request using the dynamic option:

Inside of your `page.js` file, add

```js
export const dynamic = "force-dynamic";
```

You can read more about the dynamic options [here](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)

</details>

## Deploying your App

Deployment means running your app on a different machine than your local one, and it is reachable from the internet. Not just `localhost`. This also means however that you need a database that is also reachable from the internet, so a local database won't work.

If you want, you can also buy a domain and make your app accessible through that domain.

App deployment is a very very big topic, and this lesson we are going to talk broadly about the concepts. Don't be worried if you don't understand all of it, not many do.

There are many ways to deploy next.js, [you can see them here](https://nextjs.org/docs/app/getting-started/deploying).

### Vercel

Vercel is the company that created next.js, and they provide an easy way to deploy your app. [You can read more about it here](https://nextjs.org/learn/pages-router/deploying-nextjs-app-deploy). Deploying a simple app that does not have a lot of traffic is free!

The process is simple

- Create an account on [Vercel's Website](https://vercel.com/signup)
- Allow Vercel access to your github account
- Import the project you want to deploy

![Example](https://content-media-cdn.codefinity.com/courses/383258e5-c318-41bc-b29c-0495ff30ccbe/deployment-%26-database/deployment-step-1-min.png)

![Example 2](https://miro.medium.com/v2/resize:fit:720/format:webp/1*l63mFft_EHwmWy9g-Vzvaw.png)

Next.js is going to build your app, and then deploy it for you, and give you a url!

### Netlify

Another big provider that allows you to deploy your app in a process very similar to Vercel, you can [read more about it here](https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/)

### Docker

This is an advanced of deploying your app and requires a lot of control and understanding.

Docker containers are reusable applications that you can run anywhere, in a very similar way that we can run a mongodb locally, we can create a docker container for our app and deploy it anywhere.

We need to have [docker](https://www.docker.com/get-started/) installed, to be able to do this. Using the `standalone` mode is the best for this kind of deployment.

First we create a `Dockerfile`

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
ENV HOSTNAME=0.0.0.0 PORT=80
CMD [ "node" , "server.js"]

```

And then we can build a docker image from this:

```sh
docker build . -t my-website
```

There are many ways to run our docker container, something like `AWS`, `Azure`, `GCP`, `DigitalOcean`, and many others. As an example with `GCP`, we can use [Google cloud run](https://cloud.google.com/run) to run your container. [More info here](https://github.com/nextjs/deploy-google-cloud-run). You need a GCP account to be able to do this. The first couple of months are free, but than it is paid.

First, we need a google cloud project and an artifact registry to store our docker image.

```sh
gcloud config set project YOUR_PROJECT_ID
gcloud auth configure-docker
```

Then we can build and push our container

```sh
docker build . -t gcr.io/YOUR_PROJECT_ID/nextjs-app
docker push gcr.io/YOUR_PROJECT_ID/nextjs-app
```

Finally, we can tell GCP to run our container

```sh
gcloud run deploy nextjs-app \
  --image gcr.io/YOUR_PROJECT_ID/nextjs-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Of course, there are many additional edge cases needed to be able to achieve this that we won't handle in this course, this should just give you a rough idea on what the process would look like.

The easiest approach is to deploy on vercel, and you can do this for now if you want.
