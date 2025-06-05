# AuraChat Backend

Express.js backend for the AuraChat conversation coaching app.

## Deployment to Render

### 1. Prepare Your Repository

-   Push this `backend/` folder to your GitHub repository
-   Make sure `package.json`, `server.js`, and `.env.example` are in the backend folder

### 2. Deploy to Render

1. Go to [Render.com](https://render.com) and sign up with your GitHub account
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
    - **Name**: `aurachat-backend` (or any name you prefer)
    - **Root Directory**: `backend` (important!)
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`

### 3. Environment Variables

In the Render dashboard, add these environment variables:

-   `OPENROUTER_API_KEY`: Your OpenRouter API key
-   `PORT`: `3001` (Render will override this, but good to have)

### 4. Deploy

-   Click "Create Web Service"
-   Render will automatically build and deploy your backend
-   You'll get a URL like: `https://your-app-name.onrender.com`

### 5. Test Your Backend

Once deployed, test the health endpoint:

```bash
curl https://your-app-name.onrender.com/health
```

You should get: `{"status":"OK","message":"AuraChat Backend is running"}`

## Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY

# Start the server
npm start
```

The server will run on http://localhost:3001

## API Endpoints

-   `GET /health` - Health check
-   `POST /api/conversation` - Conversation coaching endpoint

### Example Request

```bash
curl -X POST https://your-app-name.onrender.com/api/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-2.0-flash-exp:free",
    "conversationHistory": "Hey, how are you?\nI'm good, thanks! Just got back from a trip to Japan.",
    "currentGoal": "Ask about her trip and show genuine interest",
    "additionalContext": "She seems excited about travel",
    "desiredTone": "curious"
  }'
```
