# Deployment Guide

## Architecture Overview

This app uses a **separated database approach**:
- **Application**: Next.js app running in a Docker container
- **Database**: MongoDB (local via Docker Compose for dev, MongoDB Atlas for production)

## Local Development with Docker

### Using Docker Compose (Recommended for Development)
```bash
# Start MongoDB and Mongo Express
npm run docker:dev:bg

# Start Next.js dev server
npm run dev

# Seed the database
npm run db:seed
```

### Testing Production Build Locally
```bash
# Build the Docker image
npm run docker:build

# Run the container (make sure .env.local exists)
npm run docker:run:local
```

Visit http://localhost:3000

---

## Production Deployment to GCP Cloud Run

### Prerequisites

#### 1. GCP Account
Sign up at https://cloud.google.com (free tier available for first 90 days)

#### 2. Install gcloud CLI ⚙️

The gcloud CLI is **required** to deploy to GCP Cloud Run. It authenticates your Docker commands and deploys containers.

**For macOS:**
```bash
# Option 1: Using Homebrew (easiest)
brew install --cask google-cloud-sdk

# Option 2: Using the installer
curl https://sdk.cloud.google.com | bash
exec -l $SHELL  # Restart your shell
```

**For Windows:**
Download the installer from: https://cloud.google.com/sdk/docs/install

**For Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Verify Installation:**
```bash
gcloud --version
# Should output something like: Google Cloud SDK 456.0.0
```

**Initialize gcloud:**
```bash
# Login and configure
gcloud init

# Follow the prompts to:
# 1. Login with your Google account
# 2. Select or create a project
# 3. Choose a default region (e.g., us-central1)
```

**What gcloud CLI does:**
- `gcloud config`: Manages project settings
- `gcloud auth`: Handles authentication
- `gcloud run deploy`: Deploys containers to Cloud Run
- `gcloud services enable`: Activates GCP APIs

#### 3. Docker Desktop
You already have this for local development! ✅

#### 4. MongoDB Atlas
Set up a free cluster at https://www.mongodb.com/cloud/atlas

---

### Step 1: Set up MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with password
3. Whitelist IP addresses (or use 0.0.0.0/0 for any IP - less secure but works)
4. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/twitter-clone?retryWrites=true&w=majority
   ```

### Step 2: Configure GCP Project

```bash
# Login to GCP
gcloud auth login

# Create a new project (or use existing one)
gcloud projects create my-twitter-clone-project --name="My Twitter Clone"

# Set your project ID
export PROJECT_ID="my-twitter-clone-project"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Configure Docker authentication with Google Container Registry
gcloud auth configure-docker gcr.io
```

### Step 3: Build and Push Docker Image

**Option A: Using npm scripts**

First, update `package.json` and replace `YOUR_PROJECT_ID` with your actual project ID:
```json
"docker:build:gcp": "docker build -t gcr.io/my-twitter-clone-project/my-twitter-clone .",
"docker:push:gcp": "docker push gcr.io/my-twitter-clone-project/my-twitter-clone"
```

Then run:
```bash
npm run docker:build:gcp
npm run docker:push:gcp
```

**Option B: Using commands directly**

```bash
# Build the image for GCP
docker build -t gcr.io/$PROJECT_ID/my-twitter-clone .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/my-twitter-clone
```

### Step 4: Deploy to Cloud Run

```bash
# Deploy with environment variable
gcloud run deploy my-twitter-clone \
  --image gcr.io/$PROJECT_ID/my-twitter-clone \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/twitter-clone?retryWrites=true&w=majority" \
  --port 3000 \
  --memory 512Mi \
  --max-instances 10
```

**Important**: Replace the MongoDB URI with your actual Atlas connection string!

**What this command does:**
- `--image`: Specifies which container image to deploy
- `--platform managed`: Uses Cloud Run (not GKE)
- `--region`: Deployment region (choose closest to your users)
- `--allow-unauthenticated`: Makes the app public (anyone can access)
- `--set-env-vars`: Sets environment variables (your MongoDB connection)
- `--port 3000`: The port your app listens on
- `--memory 512Mi`: Allocated memory (512MB is usually enough)
- `--max-instances 10`: Auto-scaling limit

After deployment, Cloud Run will output a URL like:
```
https://my-twitter-clone-xxxxx-uc.a.run.app
```

### Step 5: Seed Production Database

Visit this URL to seed the database:
```
https://my-twitter-clone-xxxxx-uc.a.run.app/api/demo-data
```

Or use curl:
```bash
curl https://your-app-url.run.app/api/demo-data
```

---

## Environment Variables

### Local Development (.env.local)
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/twitter-clone?authSource=admin
```

### Production (Cloud Run)
Set via gcloud command or Cloud Run console:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/twitter-clone?retryWrites=true&w=majority
```

---

## Useful Commands

### Docker
```bash
# Build local image
npm run docker:build

# Run locally
npm run docker:run:local

# Build for GCP (after updating PROJECT_ID in package.json)
npm run docker:build:gcp

# Push to GCP
npm run docker:push:gcp
```

### GCP Cloud Run
```bash
# View logs
gcloud run logs read --service my-twitter-clone --region us-central1 --limit 50

# Follow logs in real-time
gcloud run logs tail --service my-twitter-clone --region us-central1

# View service details
gcloud run services describe my-twitter-clone --region us-central1

# Update environment variables
gcloud run services update my-twitter-clone \
  --region us-central1 \
  --update-env-vars MONGODB_URI=new-value

# List all services
gcloud run services list

# Delete service
gcloud run services delete my-twitter-clone --region us-central1
```

### GCP Projects
```bash
# List all projects
gcloud projects list

# Switch project
gcloud config set project PROJECT_ID

# Get current project
gcloud config get-value project
```

---

## Troubleshooting

### gcloud CLI Issues

**Problem: Command not found**
```bash
# Make sure gcloud is in your PATH
echo $PATH | grep google-cloud-sdk

# If not, add to ~/.zshrc or ~/.bashrc:
export PATH=$PATH:/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/bin
source ~/.zshrc
```

**Problem: Authentication failed**
```bash
# Re-authenticate
gcloud auth login
gcloud auth configure-docker gcr.io
```

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string format (username and password must be URL-encoded)
- Ensure database user has read/write permissions
- Test connection locally first

### Build Failures
- Clear Docker cache: `docker builder prune`
- Check Node.js version compatibility (we use Node 24)
- Ensure `output: 'standalone'` is set in next.config.mjs
- Make sure .dockerignore is properly configured

### Cloud Run Issues
- Check logs: `gcloud run logs read --service my-twitter-clone --region us-central1`
- Verify environment variables are set correctly
- Ensure port 3000 is exposed in Dockerfile
- Check that MongoDB Atlas allows connections from any IP (0.0.0.0/0)
- Verify the container starts locally with `npm run docker:run:local`

### Permission Errors
```bash
# Grant yourself necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="user:your-email@gmail.com" \
  --role="roles/run.admin"
```

---

## Cost Considerations

### MongoDB Atlas
- **Free Tier**: 512MB storage
- **Limitations**: 500 connections, 100 databases
- **Perfect for**: Development and small projects

### GCP Cloud Run
**Free Tier includes:**
- 2 million requests per month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds of compute time
- 1 GB network egress per month

**After Free Tier:**
- $0.00002400 per vCPU-second
- $0.00000250 per GB-second
- $0.40 per million requests

**Cost estimate for small project:**
- ~1000 daily requests = ~$1-2/month
- The free tier should cover development and testing!

---

## Alternative: Deploy to Vercel (Easiest) 🚀

If you don't want to deal with Docker and GCP:

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add `MONGODB_URI` environment variable in Vercel dashboard
4. Deploy!

**Pros:**
- ✅ Zero configuration needed
- ✅ Automatic deployments on git push
- ✅ Built-in CI/CD
- ✅ Free tier is generous
- ✅ No Docker knowledge required

**Cons:**
- ❌ Less control over infrastructure
- ❌ Vendor lock-in
- ❌ Limited customization

Vercel automatically handles everything for Next.js projects, making it the easiest deployment option for most use cases.

---

## Summary

**For Learning & GCP Experience:** Follow this guide with gcloud CLI
**For Quick Deployment:** Use Vercel
**For Production at Scale:** Consider AWS ECS, Kubernetes, or managed services

Choose what fits your goals! 🎯
