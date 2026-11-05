# **Milestone 3: Introduction to Databases (TypeScript Version)**

> 📘 This is the **TypeScript** version of the Milestone 3 lesson. The concepts are identical to the JavaScript version (`README.md`) – the difference is that we now add **types** to our database connection, Mongoose schemas, API routes, and frontend so that mistakes are caught *before* the code runs.
>
> **File extensions**: in a TypeScript Next.js project, API routes are `route.ts`, pages/components are `page.tsx` / `.tsx`, and plain logic files (DB connection, models, types) are `.ts`.

In the last lesson, we talked about how we can take data from the user and store it on disk, now we want to store it on a real database!

### Expected Outcomes

By the end of Milestone 3, you should:

- Allow user to create tweets and store them in the database
- Allow the user to see the tweets they created from the database
- Allow up votes / down votes to be stored in the database


# Introduction to databases

## What is a Database?

A database is a place where data is stored, organized, and accessed. In backend development, databases are used to save things like user information, product details, messages, or anything your app needs to remember. You can put data in (store), look at it (read), change it (update), or remove it (delete). These operations are often referred to as CRUD (Create, Read, Update, Delete).

## Types of Databases

There are several types of databases, but the two main categories are:

### Relational Databases (SQL)

Relational databases use tables with rows and columns (like spreadsheets).

Here is an example with `SQL` how to define the schema for a table:

```sql
CREATE TABLE companies (
  company_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  industry VARCHAR(50),
  founded_year INT
);
```

Every row is an entry to that database, so if you think about tweets, every row is a tweet.

Data is connected using relations / foreign keys. A foreign key is an identifier that connects two rows from different tables.

```sql
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  company_id INT NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);
```

Generally, data in SQL is flat, you can add columns, but you cannot nest items inside other items. For that, you create a new table, and reference the items by the `key`.

Examples: MySQL, PostgreSQL, SQLite, SQL Server.

We won't dig deep into SQL in this course, but I just want to give you the basics.

### Non-Relational Databases (NoSQL)

Non-Relational Databases don't use traditional tables, they use a variety of other data formats, like documents, key-value pairs or graphs. Generally the data is not structured, you can store anything anywhere.

Examples: Document-based: MongoDB, Key-Value: Redis, Graph: Neo4j

### **Key Features of NoSQL Databases**

- **Schema-less data storage** 🏗️ → No rigid structure like SQL tables.
- **Horizontal scalability** 📈 → Data can be distributed across multiple servers.
- **High availability & performance** ⚡ → Optimized for fast data retrieval.
- **Variety of models** 🎭 → Document, Key-Value, Graph, and Column-based storage.


## **Why NoSQL & MongoDB?**

Traditional SQL databases use **tables and relationships**, while NoSQL databases like **MongoDB** use **documents and collections**. This makes NoSQL **flexible** and **scalable**, especially for dynamic applications like our Library App.

### **MongoDB vs SQL: Key Differences**

| Feature | SQL (Relational DB) | MongoDB (NoSQL) |
| :-- | :-- | :-- |
| **Schema** | Fixed schema | Dynamic schema |
| **Data Model** | Tables & Rows | JSON-like Documents |
| **Scalability** | Vertical Scaling | Horizontal Scaling |
| **Joins** | Uses relationships | Embedded documents |
| **Best for** | Structured data (e.g., Banking) | Unstructured data (e.g., Social Media, Content Management) |

MongoDB stores data in **documents** (JSON format), which allows us to **store book details** in an easy-to-query structure.

Here is an example on how a document looks like in MongoDB

```json
{
  "_id": ObjectId("64fb..."),
  "full_name": "Alice Smith",
  "email": "alice@technova.com",
  "company_id": ObjectId("64fa...")  // Reference to the company
}
```

Note that we are just looking at the data, because there is _no schema inside the database_. You can even put nested documents

```json
{
  "_id": ObjectId("64fa..."),
  "name": "TechNova",
  "industry": "Technology",
  "founded_year": 2010,
  "employees": [
    {
      "full_name": "Alice Smith",
      "email": "alice@technova.com"
    },
    {
      "full_name": "Bob Lee",
      "email": "bob@technova.com"
    }
  ]
}
```

> 💡 **TypeScript connection**: MongoDB itself doesn't enforce a schema – but *our code* can. In this milestone we describe the shape of our documents in **two** places: a **Mongoose schema** (validates data at runtime when saving) and a **TypeScript interface** (checks our code at compile time). They complement each other.


# Using databases in Your App

There are many ways of using databases in our app, the main way of doing this using an _ODM_

## [ODM](https://www.mongodb.com/docs/drivers/odm/)

An ODM (Object Data Modeling library) is a library that lets you interact with your database using your programming language’s objects and classes, instead of writing raw queries. Much easier and safer for beginners, and often cleaner in large applications.

These libraries help you manage your database from your app a lot easier than talking to the DB directly.

For this project we are going to use _MongoDB_ with _Mongoose_ ODM

## Setup DB

There are 2 main ways to setup a database for this project:

### Atlas

[MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) is a service by company behind the mongodb database, basically, they will run the database for you, and then you can access from your app.

Using a cloud service has many advantages:

- You can access the database from anywhere
- Mongo will handle the updates / backups for you
- MongoDB Atlas also offers a [free tier](https://www.mongodb.com/pricing) for development and learning.

If you are shipping an application to production, you should use a _managed_ database, since it makes your life easier. However, to get started, you can also use a local db.

### Local Database

MongoDB is open source, it means we can run the database on our machine for local development. There are many ways of starting mongodb locally, the easiest one would be to use a docker container:

```yml
services:
  mongo:
    image: mongo:8.0
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db


volumes:
  mongo-data:
```

You need to have [Docker](https://docs.docker.com/desktop/) installed on your machine. We won't go into details what containers are, feel free to look it up.

Then to start the database, you run `docker compose up`

### Using with next.js

There is [an official example](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose) from next.js team on how to use mongoose.

Go through code in the example and try to understand what is happening, and how we can apply this to our use case. Also, read the documentation of [Mongoose](https://mongoosejs.com/docs/).

> 💡 The official example is written in JavaScript. Try converting parts of it to TypeScript yourself using the patterns in this README – it's great practice!

## **What is Mongoose?**

Mongoose is an **Object Data Modeling (ODM) library** for MongoDB in **Node.js**. It provides a structured way to interact with MongoDB by defining **schemas** and **models**.

### **Why Use Mongoose?**

✅ **Provides schema validation** to ensure data consistency
✅ **Simplifies database interactions** with an easy-to-use API
✅ **Handles relationships** between different data models
✅ **Ships with built-in TypeScript types** – no extra `@types/...` package needed

### **Installing Mongoose**

```sh
npm install mongoose
```

> Modern versions of Mongoose include their own type definitions, so TypeScript works out of the box. Only `@types/node` is needed (for `process.env` and `node:assert`), and it is already included in a Next.js TypeScript project.

## Connecting to the DB

First, add your connection string to a `.env.local` file in the root of your project:

```sh
MONGODB_URI=mongodb://localhost:27017/my-app
```

You can use the following code to connect to the DB, you can put this in any file you want outside of the `app` folder, usually something like `lib/db.ts`

```ts
import mongoose, { Mongoose } from "mongoose";
import assert from "node:assert";

// The shape of our cached connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Tell TypeScript that `global` has a `mongoose` property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// caching for local development
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function makeSureDbIsReady(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  // after this assert, TypeScript knows MONGODB_URI is a string (not undefined)
  assert(
    MONGODB_URI,
    "Please define the MONGODB_URI environment variable inside .env.local"
  );

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

A few TypeScript details worth understanding:

- **`declare global { var mongoose ... }`** – by default, TypeScript doesn't know that we are attaching a `mongoose` property to `global`. This block teaches it. (It must use `var`, not `let`/`const`.)
- **`process.env.X` is `string | undefined`** – TypeScript can't know that the env variable exists. The `assert(...)` call **narrows** the type to `string`, so `mongoose.connect(MONGODB_URI)` compiles.
- **`Promise<Mongoose>`** – the return type tells every caller what they get back from the function.

Anytime you want to talk to the database, make sure to `await makeSureDbIsReady()` first!

## Defining schemas

With TypeScript, defining a model has **three** parts:

1. An **interface** that describes the document's fields.
2. A **Schema**, typed with that interface (`Schema<ICompany>`).
3. A **Model**, typed with the same interface (`Model<ICompany>`).

```ts
import mongoose, { Schema, Model } from "mongoose";

// 1. The TypeScript interface – describes the shape of a Company
export interface ICompany {
  name: string;
  industry: string;
  founded_year: number;
}

// 2. The Mongoose schema – validates data at runtime
const CompanySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  industry: {
    type: String,
    required: true,
    maxlength: [60, "Industry cannot be more than 60 characters"],
  },
  founded_year: {
    type: Number,
    required: true,
  },
});

// 3. The model – we have to define it this way because of hot reloading
export const Company: Model<ICompany> =
  mongoose.models.Company ?? mongoose.model<ICompany>("Company", CompanySchema);
```

Now our Mongoose model knows the `Company` collection, and each company has a name, an industry, and the year it was founded – **and TypeScript knows it too**.

> 💡 Notice that the interface uses TypeScript types (`string`, `number`), while the schema uses Mongoose types (`String`, `Number` – capitalized). They look similar, but they are different things: one is for the compiler, the other is for the database layer.

Remember, you need to `await makeSureDbIsReady()` before calling any of the operations below:

***

## **CRUD Operations with MongoDB & Mongoose**

Now that our database is connected, let's implement **CRUD (Create, Read, Update, Delete)** operations to manage books in our Library App.

***

## **1️⃣ Understanding CRUD Operations**

| Operation | HTTP Method | Description |
| :-- | :-- | :-- |
| **Create** | `POST` | Add a new company to the database |
| **Read** | `GET` | Retrieve company from the database |
| **Update** | `PUT` or `PATCH` | Modify an existing company's details |
| **Delete** | `DELETE` | Remove a company from the database |


***

## **2️⃣ Creating API Routes for CRUD Operations**

In **Next.js App Router**, we structure our API routes inside `/app/api/books/`.

📁 **Project Structure**

```
/app
 ├── /api
 │   ├── /books
 │   │   ├── route.ts  (Handles CRUD operations)
 ├── /library
 │   ├── page.tsx
/lib
 ├── db.ts             (DB connection)
/models
 ├── Book.ts           (Mongoose model)
/types
 ├── book.ts           (Shared TypeScript types)
```

Before the routes, here are the basic Mongoose operations on the `Company` model from above:

### Create

```ts
const company = await Company.create({
  name: "Audi",
  industry: "AutoMobile",
  founded_year: 1990,
});
// company is a Mongoose document, we can convert it to a normal object by calling
company.toObject();
```

TypeScript checks the object we pass to `create`: a missing `name` or a `founded_year: "1990"` (string) would be a compile error.

### Read

```ts
const audi = await Company.find({ name: "Audi" });
```

> `find` always returns an **array** (`HydratedDocument<ICompany>[]`), even if only one document matches. Use `findOne` to get a single document.

### Update

```ts
const audi = await Company.findOne({ name: "Audi" });

// findOne returns `Document | null` – TypeScript forces us to handle "not found"
if (!audi) {
  throw new Error("Company not found");
}

audi.founded_year = 1950; // ✅ number
// audi.founded_year = "1950"; // ❌ Error: Type 'string' is not assignable to type 'number'
await audi.save();
```

### Delete

```ts
await Company.findOneAndDelete({ name: "Audi" });
```


## **3️⃣ Implementing CRUD Routes**

### **Shared Types**

For the Library App, we first describe what a book looks like. We put the types in their own file, so they can be used by **both** the backend (the model) and the frontend (the page) without importing any backend code into the browser.

```ts
// types/book.ts

// A book as we store it (no id yet)
export interface IBook {
  title: string;
  author: string;
  publishedYear: number;
  coverImage?: string; // optional
  description?: string; // optional
}

// A book as we receive it from the API (JSON → _id is a string)
export interface BookDTO extends IBook {
  _id: string;
}

// The body of an update request: the id + any fields we want to change
export interface UpdateBookBody extends Partial<IBook> {
  id: string;
}
```

- **`?`** marks a property as optional.
- **`extends`** lets one interface build on another (`BookDTO` = `IBook` + `_id`).
- **`Partial<IBook>`** is a built-in utility type that makes *all* properties of `IBook` optional – perfect for updates, where we only send the fields that changed.

And the Mongoose model:

```ts
// models/Book.ts
import mongoose, { Schema, Model } from "mongoose";
import type { IBook } from "@/types/book";

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  coverImage: { type: String },
  description: { type: String },
});

export const Book: Model<IBook> =
  mongoose.models.Book ?? mongoose.model<IBook>("Book", BookSchema);
```

### **📌 Create a New Book (`POST`)**

```ts
// app/api/books/route.ts
import { makeSureDbIsReady } from "@/lib/db";
import { Book } from "@/models/Book";
import type { IBook } from "@/types/book";

export async function POST(req: Request) {
  await makeSureDbIsReady();
  const body: IBook = await req.json();
  try {
    const newBook = await Book.create(body);
    return new Response(JSON.stringify(newBook), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating book" }), {
      status: 500,
    });
  }
}
```

> ⚠️ `req.json()` returns `Promise<any>`, so TypeScript can't verify that the client really sent a valid `IBook`. Annotating `const body: IBook` *tells* TypeScript what we expect – it is **not** a runtime check. Mongoose's schema validation (`required: true`, etc.) is what protects the database from bad data at runtime.

### **📌 Read All Books (`GET`)**

```ts
export async function GET(req: Request) {
  await makeSureDbIsReady();
  try {
    const books = await Book.find({});
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching books" }), {
      status: 500,
    });
  }
}
```

### **📌 Update a Book (`PUT` or `PATCH`)**

```ts
import type { UpdateBookBody } from "@/types/book";

export async function PUT(req: Request) {
  await makeSureDbIsReady();
  const { id, ...updatedData }: UpdateBookBody = await req.json();
  try {
    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    // findByIdAndUpdate returns `null` if no book has this id
    if (!updatedBook) {
      return new Response(JSON.stringify({ error: "Book not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedBook), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error updating book" }), {
      status: 500,
    });
  }
}
```

### **📌 Delete a Book (`DELETE`)**

```ts
export async function DELETE(req: Request) {
  await makeSureDbIsReady();
  const { id }: { id: string } = await req.json();
  try {
    await Book.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({ message: "Book deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error deleting book" }), {
      status: 500,
    });
  }
}
```

> 💡 In a `catch (error)` block, `error` has the type `unknown` in TypeScript. We don't use it above, but if you want to log or return its message, narrow it first: `error instanceof Error ? error.message : "Unknown error"`.


***

## **4️⃣ Testing API Routes with Postman or Thunder Client**

### **Testing a `POST` Request**

1. Open **Postman** or **Thunder Client** (VSCode extension).
2. Set the method to `POST`.
3. Use the URL: `http://localhost:3000/api/books`
4. Set the request body to JSON:

```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "publishedYear": 1937,
  "coverImage": "https://example.com/hobbit.jpg",
  "description": "A classic fantasy novel."
}
```

5. Click **Send** → Expect a `201 Created` response.

### **Testing a `GET` Request**

1. Set the method to `GET`.
2. Use the URL: `http://localhost:3000/api/books`
3. Click **Send** → Expect a JSON array of books.

### **Testing an `UPDATE` Request**

1. Set the method to `PUT`.
2. Use the URL: `http://localhost:3000/api/books`
3. Set the request body:

```json
{
  "id": "64b2ff...",
  "title": "The Hobbit - Updated Edition"
}
```

4. Click **Send** → Expect a `200 OK` response with updated data.

### **Testing a `DELETE` Request**

1. Set the method to `DELETE`.
2. Use the URL: `http://localhost:3000/api/books`
3. Set the request body:

```json
{ "id": "64b2ff..." }
```

4. Click **Send** → Expect a `200 OK` confirmation.

***

## **5️⃣ Frontend Integration (Fetching Books in Next.js)**

### **Fetching Books from the API in Next.js**

Inside `/app/library/page.tsx`, add:

```tsx
"use client";
import { useEffect, useState } from "react";
import type { BookDTO } from "@/types/book";

export default function Library() {
  // Empty array → we must tell TypeScript what the array will contain
  const [books, setBooks] = useState<BookDTO[]>([]);

  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch("/api/books");
      const data: BookDTO[] = await res.json();
      setBooks(data);
    }
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Library</h1>
      <ul>
        {books.map((book) => (
          <li key={book._id}>
            {book.title} - {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

> 💡 Note that we import `BookDTO` from `types/book.ts` and **not** from the Mongoose model. This keeps Mongoose (a backend-only library) out of the browser bundle. We also use `import type`, which tells TypeScript the import is only used for types and is erased at build time.

> ⚠️ Without the generic, `useState([])` is inferred as `never[]` and you would get a type error on `setBooks(data)`. Always write `useState<YourType[]>([])` for arrays.


***

## **Common TypeScript Errors in This Milestone**

| Error message | Likely cause | Fix |
| --- | --- | --- |
| `Property 'mongoose' does not exist on type 'typeof globalThis'` | Missing `declare global` block in `lib/db.ts` | Add the `declare global { var mongoose: ... }` block |
| `Argument of type 'string \| undefined' is not assignable to parameter of type 'string'` | `process.env.MONGODB_URI` may be `undefined` | Narrow it with `assert(...)` or an `if` check |
| `'audi' is possibly 'null'` | `findOne` / `findByIdAndUpdate` can return `null` | Add a guard: `if (!audi) { ... }` |
| `Argument of type 'X' is not assignable to parameter of type 'never'` | `useState([])` without a generic | Use `useState<BookDTO[]>([])` |
| `Type 'string' is not assignable to type 'number'` | Wrong value type for a field (e.g., `publishedYear: "1937"`) | Send/assign a `number` |
| `Cannot find module '@/models/Book'` | Path alias not configured | Check `paths` in `tsconfig.json` (`"@/*": ["./*"]`) |


***

# **Conclusion - NoSQL & Database**

## **Key Takeaways from This Milestone**

1. **Understanding NoSQL** → We explored how NoSQL databases like MongoDB differ from relational databases, offering flexibility and scalability.
2. **MongoDB Basics** → We set up a MongoDB database and learned how to interact with it using Mongoose.
3. **Database Connection** → We established a connection between our Next.js app and MongoDB using Mongoose.
4. **CRUD Operations** → We implemented Create, Read, Update, and Delete functionalities in our Library App.
5. **Frontend Integration** → We fetched book data from our API and displayed it on the frontend.
6. **Type Safety** → We described our documents with interfaces, typed our schemas and models with generics, and handled `null` / `unknown` values safely.

---

### Task

Take the time, go through the examples from next.js, this is a good example on how to learn from other people's code. update your code to save the user's tweets and read them from the DB.

**TypeScript hints for the Tweet task:**

- Create an `ITweet` interface (e.g., `content: string`, `createdAt`, `upvotes: number`, `downvotes: number`) and a `TweetDTO` that extends it with `_id: string`.
- Type your schema and model: `new Schema<ITweet>(...)` and `Model<ITweet>`.
- Type your state: `useState<TweetDTO[]>([])`.
- Handle the `null` case when updating votes (e.g., `findByIdAndUpdate` returns `null` for an unknown id).

[Getting Started with Next.js - official instructions](https://nextjs.org/docs/app/getting-started)

---

## READ THE DOCS, TEST YOURSELF & LEARN 🤓

- [Is Mongoose an ORM or ODM?](https://medium.com/@abhikshirsagar1999/is-mongoose-an-orm-or-odm-651c9d14e513)

- [ORMs, ODMs, and Libraries](https://www.mongodb.com/docs/drivers/odm/)

- [Quizlet - 54 Qs on Milestone 3](https://quizlet.com/de/1180898068/mongodb-flash-cards/?funnelUUID=ed8eba12-6b0f-466d-80c4-a11c63ab5350)

- [Next.js documentation](https://nextjs.org/docs)

- [Mongoose – TypeScript Support](https://mongoosejs.com/docs/typescript.html)

- [Next.js – TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript)
