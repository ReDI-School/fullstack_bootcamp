# **Milestone 3: Advanced Next.js - API, Routing, Backend**

In this lesson, we'll do some backend development, and learn how to create backend endpoints using Next.js API routes. These routes allow us to define server-side logic that runs when a request is made. For this lesson, and for simplicity's sake, we won't be using a database, we'll store data in files on disk. This helps us focus on the API design and backend logic. We'll talk about databases later.

### Expected Outcomes

By the end of Milestone 3, you should:

- Allow user to create tweets and store them on disk
- Allow the user to see the tweets they created

---

## Frontend vs Backend

Imagine a website like a restaurant.

The frontend is like the part of the restaurant you see — the tables, chairs, menus, and the food when it's brought to your table. It's what customers (users) interact with.

The backend is like the kitchen — you don’t see it, but it’s where the real work happens. It’s where the food is prepared (data is processed), orders are handled (requests are managed), and everything runs behind the scenes to make the restaurant function.

When we are building website, the frontend is everything you see in the browser, the backend is what happens on the "server".

A server is a computer that’s always on and waiting to respond to requests. When you open a website, you send a request to a server — and the server sends back what you need, like a web page, images, or data.

When we are doing backend development, we are working in the server, and we define API routes, that your website can make requests to.

## API Routes

You can read about routes in the [official tutorial](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) and in the [reference](https://nextjs.org/docs/app/api-reference/file-conventions/route).

Next.js allows us to create API routes inside our project, enabling you to do both frontend and backend development in the same project!

So not only we will use `fetch` inside of our react app, we will also write the API that will be fetched.

You can define routes in modern versions of next.js using the `route.js` file name, (or `ts` if using typescript), the structure is similar to how we did this with `page.js` to define pages, however, _you are not allowed to have a `page.js` and `route.js` in the same folder._

Let's start with an example, create the file `app/api/hello/route.js`

and put this code inside of it

```js
import { NextResponse, NextRequest } from "next/server";

/**
 * @param {NextRequest} request
 */
export async function GET(request) {
  console.log("Request to", request.url);
  return NextResponse.json({ ping: "pong" });
}
```

Then open your next js project in the browser, and in the developer tools' console run this command:

```js
fetch("/api/hello")
  .then((r) => r.json())
  .then(console.log);
```

What do you see? can you explain what happened? Can you check the network tab for details?

---

### HTTP

We have just created a new API endpoint, and then we called this endpoint from the browser. More specifically we created an endpoint that listens on GET requests.

Requests are done over something called [HTTP or Hypertext Transfer Protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP). Your browser, sometimes referred to as a client, does a request to a server, using the HTTP format.

HTTP consists of many parts:

_URL_: Where the request is supposed to go, for example `https://dummyjson.com/posts` means go the server at `dummyjson.com` and then give me the route `/posts`, here sometimes you can have additional query parameters.

In our next.js project, we created a file in `app/api/hello/`, which tells next js to create a new API that listens on the route `/api/hello`, and so when we did a fetch request from our browser like this `fetch('/api/hello')`, we got a response back from our server.

If you don't define the _host_ (the part with `http://.....com`, then the current host of the browser will be used).

_Method_: Sometimes referred to as the HTTP verb, this is a way to distinguish different HTTP operations, of which there are many

- GET: get something
- POST: create something
- PUT: create or update something
- PATCH: update something
- DELETE: remove something

And others, [You can find the full list here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods).

When you do a normal `fetch` request, the default method is `GET`, which is the same name of function we defined in our `route.js` file. You can change the method used for teh `fetch` request in the second parameter.

```js
fetch("/api/hello", {
  method: "POST",
});
```

if you run this code in your browser, what do you get?

<details>
 <summary>You should get...</summary>

An HTTP 405 Error, Method not allowed, why?

</details>

_Headers_: Headers are metadata then you send with your request to explain to the server what you want, for example, you can send to the server `accept: application/json` which means: "Please respond with json because I can understand it".

Sometimes if there is authorization for a request it will be sent in the headers, you will see something like `Authorization: Bearer .....`.

_Body_: this is the data that we are sending to the server, this data could be anything, but usually we convert it to a json string before sending it. For example, if the user is creating a new tweet, this would be the content of the tweet.

**Exercise**:

Create a new text input in your next.js app, and a button.
When the user clicks on this button, we want to send the text we have inside the input field to a new function inside of our `route.js` file.

Inside of your route handler, log whatever input the user has sent.

---

### Static vs. Dynamic Routes

A static route return the same data for all requests, our `/app/api/hello/route.js` is static.

A dynamic route returns different data depending on the parameters of the request, something like `/app/api/hello/[name]/route.js` is dependant on the `name` parameter. These are called [Dynamic segments](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes).

You can access the parameters in the second parameter of your handler. Just like how we get the params in the browser, we do the same in our route handler.

```js
export async function GET(request, { params }) {
  const { name } = await params;
  return NextResponse.json({ greeting: "Hi " + name });
}
```

---

## Dealing with data

In a typical application, we would connect to a database to store and load the data, however, for this milestone, we will keep it simple and store everything on disk. We will talk about databases later.

But how to work with the disk?

## Reading files

We are running our next application in the node runtime, so we can use libraries provided for us by node to read / write files.

If we search for the documentation, we find the following

```js
import fs from "node:fs/promises";
const data = await fs.readFile("/Users/joe/test.txt", { encoding: "utf8" });
// You will get an error in the above code if this file does not exist.
```

**Exercise**

Create a file called `note.txt` and return the contents of this file in the response of you`GET /api/hello` endpoint.

You should also handle the case where the file does not exist, you can google how to check for this.

## Writing files

Similar to when doing requests, we can store data as string in files.

```js
import fs from "node:fs/promises";

fs.writeFileSync("./programming.txt", "this is an example", {
  encoding: "utf8",
});
```

**Exercise**

In a previous exercise, you created an input with a button that sends the content of the input to the backend. Now update the code to store whatever the user send into the same `note.txt` file.

If you are finished, you can work on Milestone 3 goals.
