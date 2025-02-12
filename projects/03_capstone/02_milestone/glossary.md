# **Glossary - NoSQL, Authentication & Deployment**

## **1. NoSQL & MongoDB**
### **1.1 NoSQL**
- **NoSQL (Not Only SQL)**: A type of database that allows for flexible, schema-less data storage, optimized for scalability and performance.
- **Document Database**: A NoSQL database that stores data in JSON-like documents (e.g., MongoDB).
- **Key-Value Store**: A NoSQL model that stores data as key-value pairs (e.g., Redis).
- **Column-Family Store**: A NoSQL model where data is stored in columns instead of rows (e.g., Cassandra).
- **Graph Database**: A NoSQL model optimized for relational data (e.g., Neo4j).

### **1.2 MongoDB**
- **MongoDB**: A NoSQL database that stores data in documents with flexible schemas.
- **Mongoose**: An ODM (Object-Document Mapper) for MongoDB in Node.js that helps define schemas and models.
- **Cluster**: A group of connected MongoDB instances for scalability.
- **Database**: A collection of multiple collections in MongoDB.
- **Collection**: A set of related documents in MongoDB (equivalent to tables in SQL).
- **Document**: A single record in MongoDB stored as JSON.

### **1.3 MongoDB CRUD Operations**
- **Create (`insertOne`, `insertMany`)**: Add new documents to a collection.
- **Read (`find`, `findOne`)**: Retrieve documents from a collection.
- **Update (`updateOne`, `updateMany`)**: Modify existing documents.
- **Delete (`deleteOne`, `deleteMany`)**: Remove documents from a collection.

---

## **2. Authentication & User Management**
### **2.1 Authentication Basics**
- **Authentication**: The process of verifying user identity (e.g., logging in).
- **Authorization**: The process of granting permissions to authenticated users.
- **Session-Based Authentication**: Stores session data on the server and assigns users session IDs (e.g., Express sessions).
- **Token-Based Authentication**: Uses JSON Web Tokens (JWT) to verify users without storing session data on the server.

### **2.2 JWT (JSON Web Token)**
- **Header**: Contains metadata about the token (e.g., algorithm used).
- **Payload**: Contains user-related data.
- **Signature**: A hash that ensures the token's integrity.

### **2.3 User Management**
- **User Model**: A schema that defines user data (e.g., email, password, role).
- **Hashing**: Encrypting passwords before storing them in the database (e.g., bcrypt).
- **Salting**: Adding random data to a password before hashing to improve security.

---

## **3. Next.js API Routes & Deployment**
### **3.1 Next.js API Routes**
- **App Router (`app/api`)**: The recommended way to create API routes in Next.js.
- **REST API**: A standard way to create APIs where endpoints return JSON responses.
- **Middleware**: Functions that process requests before they reach the final handler.

### **3.2 Environment Variables**
- **Environment Variables (`.env.local`)**: Securely store sensitive credentials like database URIs and API keys.
- **Process Variables (`process.env`)**: Access environment variables in Node.js applications.

### **3.3 Deployment**
- **Vercel**: A cloud platform optimized for hosting Next.js applications.
- **MongoDB Atlas**: A managed cloud database service for MongoDB.
- **CI/CD (Continuous Integration & Deployment)**: Automates testing and deployment for production applications.

---

## **4. Miscellaneous Terms**
- **Middleware**: Functions that process requests before they reach the final API route.
- **CORS (Cross-Origin Resource Sharing)**: A security feature that restricts access to resources from different origins.
- **Rate Limiting**: Restricting the number of API requests to prevent abuse.
- **OAuth**: An authorization protocol used for third-party logins (e.g., Google, Facebook authentication).

---

## **Key Takeaways**
📌 **MongoDB & NoSQL**: We explored document databases and how to perform CRUD operations.  
📌 **Authentication & Authorization**: We implemented JWT authentication and secured user data.  
📌 **Next.js API & Deployment**: We created API routes, stored environment variables, and deployed the app on Vercel.

🚀 **Moving Forward**: The next step is **Demo Day**, where we present our final project and consolidate all the skills learned in the bootcamp!

