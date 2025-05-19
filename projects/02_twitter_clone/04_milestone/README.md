# **Milestone 4: Introduction to Databases**

In the last lesson, we talked about how we can take data from the user and store it on disk, now we want to store it on a real database!

### Expected Outcomes

By the end of Milestone 4, you should:

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

Data is connected using relations / foreign keys. A foreign key is an identified that connects two rows from different tables.

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

Here is an example on how a document looks like in MongoDB

```json
{
  "_id": ObjectId("64fb..."),
  "fulL_name": "Alice Smith",
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

# Using databases in Your App

There are many ways of using databases in our app, the main way of doing this using an _ORM_

## ORM

An ORM (Object-Relational Mapper) is a library that lets you interact with your database using your programming language’s objects and classes, instead of writing raw queries. Much easier and safer for beginners, and often cleaner in large applications.

These libraries help you manage your database from your app a lot easier than talking to the DB directly.

For this project we are going to use _MongoDB_ with _Mongoose_ ORM

## Setup DB

There are 2 main ways to setup a database for this project:

### Atlas

[MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) is a service by company behind the mongodb database, basically, they will run the database for you, and then you can access from your app.

Using a cloud service has many advantages:

- You can access the database from anywhere
- Mongo wil handle the updates / backups for you

But also has advantages

- You have to pay for it 💰

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

## Connecting to the DB

You can use the following code to connect to the DB, you can put this in any file you want outside of the `app` folder, usually something like `lib/db.js`
```js
import mongoose from "mongoose";
import assert from "node:assert";

// caching for local development
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function makeSureDbIsReady() {
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
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

Anytime you want to talk to the database, make sure to `await makeSureDbIsReady()` first!



## Defining schemas

```js
import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
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

// we have to define it this way because of hot reloading
export let Company =
  mongoose.models.Company ?? mongoose.model("Company", CompanySchema);
```

Now our ORM knows we have a `Company` collection, and each company has a name, an industry, and the year it was founded.

Remember, you need to `await makeSureDbIsReady()` before calling any of the operations below:

### Create

```js
const company = await Company.create({
  name: "Audi",
  industry: "AutoMobile",
  founded_year: 1990,
});
// company is an ORM object, we can convert it to a normal object by calling
company.toObject();
```

### Read

```js
const audi = await Company.find({name: "Audi"});
```


### Update

```js
const audi = await Company.findOne({name: "Audi"});
audi.founded_year = 1950;
await audi.save();
```

### Delete

```js
await Company.findOneAndDelete({name: "Audi"});
```

### Task

Take the time, go through the examples from next.js, this is a good example on how to learn from other people's code. update your code to save the user's tweets and read them from the DB.
