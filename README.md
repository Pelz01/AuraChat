# AuraChat

![AuraChat](/app/opengraph-image.png)

An AI-powered conversation coaching tool that helps you navigate social interactions with confidence, authenticity, and strategic thinking. Built on the Scira framework.

## Powered By

<div align="center">
  <div style="display: flex; justify-content: center; align-items: center; gap: 80px; margin: 20px 0;">
    <a href="https://sdk.vercel.ai/docs">
      <img src="/public/one.svg" alt="Vercel AI SDK" height="40" />
    </a>
    <a href="https://tavily.com">
      <img src="/public/four.svg" alt="Tavily AI" height="40" />
    </a>
  </div>
</div>

-   [Vercel AI SDK](https://sdk.vercel.ai/docs) - For AI model integration and streaming
-   [Tavily AI](https://tavily.com) - For search grounding and web search capabilities

## Special Thanks

<div align="center" markdown="1">

[![Warp](https://github.com/user-attachments/assets/2bda420d-4211-4900-a37e-e3c7056d799c)](https://www.warp.dev/?utm_source=github&utm_medium=referral&utm_campaign=scira)<br>

### **[Warp, the intelligent terminal](https://www.warp.dev/?utm_source=github&utm_medium=referral&utm_campaign=scira)**<br>

[Available for MacOS, Linux, & Windows](https://www.warp.dev/?utm_source=github&utm_medium=referral&utm_campaign=scira)<br>
[Visit warp.dev to learn more](https://www.warp.dev/?utm_source=github&utm_medium=referral&utm_campaign=scira)

</div>

## Features

-   **Conversation Coaching**: AI-powered assistance for navigating social interactions
-   **Context-Aware Suggestions**: Analyzes conversation history to provide strategic reply options
-   **Multiple Tone Options**: Choose from playful, witty, empathetic, direct, curious, confident, mysterious, or warm tones
-   **Goal-Oriented Responses**: Tailored suggestions based on your specific conversation goals
-   **Ethical Boundaries**: Built-in safeguards to ensure authentic and respectful communication
-   **Real-time Generation**: Instant AI-powered reply suggestions using OpenRouter's free models
-   **No Sign-up Required**: Use the tool immediately without creating an account
-   **Privacy-First**: Conversation data stays in your browser's local storage

## Conversation Coaching Philosophy

Drawing inspiration from the best principles of social dynamics and attraction (including insights from Neil Strauss's work), AuraChat focuses on:

-   **Authentic Confidence**: Building genuine self-assurance rather than artificial personas
-   **Observation & Calibration**: Understanding context and reading social cues
-   **Value Demonstration**: Showcasing attractive qualities through natural conversation
-   **Emotional Connection**: Using storytelling and empathy to create genuine bonds
-   **Ethical Communication**: Promoting respect, honesty, and authentic interaction

**Important**: This tool explicitly avoids manipulative tactics and focuses on helping you become a better, more authentic communicator.

## AI Models (Free via OpenRouter)

-   [Google Gemini 2.0 Flash Experimental](https://openrouter.ai/google/gemini-2.0-flash-exp:free) - Fast and capable, great for conversation coaching (1M token context)
-   [Google Gemma 3 4B](https://openrouter.ai/google/gemma-3-4b-it:free) - Multimodal with vision support (96k token context)
-   [Google Gemma 3 1B](https://openrouter.ai/google/gemma-3-1b-it:free) - Lightweight and efficient (32k token context)

All models are completely free to use via [OpenRouter](https://openrouter.ai/), no payment required.

## Deployment Architecture

-   **Frontend**: React app deployed on Vercel (free tier)
-   **Backend**: Express.js API deployed on Render (free tier)
-   **AI**: Free Google models via OpenRouter
-   **No Authentication**: No sign-up required, just use it!

## Quick Setup

### Option 1: Deploy to Production (Recommended)

1. **Get a free OpenRouter API key**:

    - Visit [OpenRouter](https://openrouter.ai/keys)
    - Sign up and get your free API key

2. **Deploy Backend to Render**:

    - Fork this repository
    - Go to [Render.com](https://render.com), sign up with GitHub
    - Create new Web Service, connect your repo
    - Set root directory to `backend`
    - Add environment variable: `OPENROUTER_API_KEY=your_key_here`
    - Deploy (takes ~5 minutes)

3. **Deploy Frontend to Vercel**:

    - Go to [Vercel.com](https://vercel.com), sign up with GitHub
    - Import your repository
    - Add environment variable: `NEXT_PUBLIC_BACKEND_URL=https://your-render-url.onrender.com`
    - Deploy (takes ~2 minutes)

4. **Start coaching conversations**!

### Option 2: Local Development

1. **Backend setup**:

    ```bash
    cd backend
    npm install
    cp .env.example .env
    # Edit .env and add your OPENROUTER_API_KEY
    npm start  # Runs on http://localhost:3001
    ```

2. **Frontend setup** (new terminal):
    ```bash
    npm install
    cp .env.local.example .env.local
    # Edit .env.local and set NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
    npm run dev  # Runs on http://localhost:3000
    ```

## Built with

-   [Next.js](https://nextjs.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Vercel AI SDK](https://sdk.vercel.ai/docs)
-   [Shadcn/UI](https://ui.shadcn.com/)
-   [Exa.AI](https://exa.ai/)
-   [Tavily](https://tavily.com/)
-   [OpenWeather](https://openweathermap.org/)
-   [Daytona](https://daytona.io/)
-   [E2B](https://e2b.dev/)
-   [Google Maps](https://developers.google.com/maps)
-   [Mapbox](https://www.mapbox.com/)
-   [Aviation Stack](https://aviationstack.com/)

### Deploy your own

<!-- TODO: update key names -->

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzaidmukaddam%2Fscira&env=XAI_API_KEY,OPENAI_API_KEY,ANTHROPIC_API_KEY,GROQ_API_KEY,DAYTONA_API_KEY,E2B_API_KEY,DATABASE_URL,BETTER_AUTH_SECRET,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,TWITTER_CLIENT_ID,TWITTER_CLIENT_SECRET,REDIS_URL,ELEVENLABS_API_KEY,TAVILY_API_KEY,EXA_API_KEY,TMDB_API_KEY,YT_ENDPOINT,FIRECRAWL_API_KEY,OPENWEATHER_API_KEY,SANDBOX_TEMPLATE_ID,GOOGLE_MAPS_API_KEY,MAPBOX_ACCESS_TOKEN,AVIATION_STACK_API_KEY,CRON_SECRET,BLOB_READ_WRITE_TOKEN,MEM0_API_KEY,MEM0_ORG_ID,MEM0_PROJECT_ID,SMITHERY_API_KEY,NEXT_PUBLIC_MAPBOX_TOKEN,NEXT_PUBLIC_POSTHOG_KEY,NEXT_PUBLIC_POSTHOG_HOST,NEXT_PUBLIC_SCIRA_PUBLIC_API_KEY,SCIRA_API_KEY&envDescription=API%20keys%20and%20configuration%20required%20for%20Scira%20to%20function)

## Set Scira as your default search engine

1. **Open the Chrome browser settings**:

    - Click on the three vertical dots in the upper right corner of the browser.
    - Select "Settings" from the dropdown menu.

2. **Go to the search engine settings**:

    - In the left sidebar, click on "Search engine."
    - Then select "Manage search engines and site search."

3. **Add a new search engine**:

    - Click on "Add" next to "Site search."

4. **Set the search engine name**:

    - Enter `Scira` in the "Search engine" field.

5. **Set the search engine URL**:

    - Enter `https://scira.ai?q=%s` in the "URL with %s in place of query" field.

6. **Set the search engine shortcut**:

    - Enter `sh` in the "Shortcut" field.

7. **Set Default**:
    - Click on the three dots next to the search engine you just added.
    - Select "Make default" from the dropdown menu.

After completing these steps, you should be able to use Scira as your default search engine in Chrome.

### Local development

#### Run via Docker

The application can be run using Docker in two ways:

##### Using Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed on your system
2. Create a `.env` file based on `.env.example` with your API keys
3. Run the following command in the project root:
    ```bash
    docker compose up
    ```
4. The application will be available at `http://localhost:3000`

##### Using Docker Directly

1. Create a `.env` file based on `.env.example` with your API keys
2. Build the Docker image:
    ```bash
    docker build -t scira.app .
    ```
3. Run the container:
    ```bash
    docker run --env-file .env -p 3000:3000 scira.app
    ```

The application uses a multi-stage build process to minimize the final image size and implements security best practices. The production image runs on Node.js LTS with Alpine Linux for a minimal footprint.

#### Run with Node.js

To run the application locally without Docker:

1. Sign up for accounts with the required AI providers:
    - OpenAI (required)
    - Anthropic (required)
    - Tavily (required for web search feature)
2. Copy `.env.example` to `.env.local` and fill in your API keys
3. Install dependencies:
    ```bash
    pnpm install
    ```
4. Start the development server:
    ```bash
    pnpm dev
    ```
5. Open `http://localhost:3000` in your browser

# License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
