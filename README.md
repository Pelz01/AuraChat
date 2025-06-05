# AuraChat

An AI-powered conversation coaching tool that helps you navigate social interactions with confidence, authenticity, and strategic thinking.

## ✨ What is AuraChat?

AuraChat is your personal AI conversation coach that provides real-time, strategic reply suggestions for any social interaction. Whether you're navigating dating conversations, networking events, or building deeper connections, AuraChat helps you communicate with confidence and authenticity.

## 🎯 Features

-   **Conversation Coaching**: AI-powered assistance for navigating social interactions
-   **Context-Aware Suggestions**: Analyzes conversation history to provide strategic reply options
-   **Multiple Tone Options**: Choose from playful, witty, empathetic, direct, curious, confident, mysterious, or warm tones
-   **Goal-Oriented Responses**: Tailored suggestions based on your specific conversation goals
-   **Ethical Boundaries**: Built-in safeguards to ensure authentic and respectful communication
-   **Real-time Generation**: Instant AI-powered reply suggestions using OpenRouter's free models
-   **No Sign-up Required**: Use the tool immediately without creating an account
-   **Privacy-First**: Conversation data stays in your browser's local storage

## 🧠 Conversation Coaching Philosophy

Drawing inspiration from the best principles of social dynamics and attraction (including insights from Neil Strauss's work), AuraChat focuses on:

-   **Authentic Confidence**: Building genuine self-assurance rather than artificial personas
-   **Observation & Calibration**: Understanding context and reading social cues
-   **Value Demonstration**: Showcasing attractive qualities through natural conversation
-   **Emotional Connection**: Using storytelling and empathy to create genuine bonds
-   **Ethical Communication**: Promoting respect, honesty, and authentic interaction

**Important**: This tool explicitly avoids manipulative tactics and focuses on helping you become a better, more authentic communicator.

## 🤖 AI Models (Free via OpenRouter)

-   [Google Gemini 2.0 Flash Experimental](https://openrouter.ai/google/gemini-2.0-flash-exp:free) - Fast and capable, great for conversation coaching (1M token context)
-   [Google Gemma 3 4B](https://openrouter.ai/google/gemma-3-4b-it:free) - Multimodal with vision support (96k token context)
-   [Google Gemma 3 1B](https://openrouter.ai/google/gemma-3-1b-it:free) - Lightweight and efficient (32k token context)

All models are completely free to use via [OpenRouter](https://openrouter.ai/), no payment required.

## 🏗️ Deployment Architecture

-   **Frontend**: React app deployed on Vercel (free tier)
-   **Backend**: Express.js API deployed on Render (free tier)
-   **AI**: Free Google models via OpenRouter
-   **No Authentication**: No sign-up required, just use it!

## 🚀 Quick Setup

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

## 🛠️ Built with

-   [Next.js](https://nextjs.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Vercel AI SDK](https://sdk.vercel.ai/docs)
-   [Shadcn/UI](https://ui.shadcn.com/)
-   [Express.js](https://expressjs.com/)
-   [OpenRouter](https://openrouter.ai/)

## 📖 How to Use AuraChat

1. **Enter Conversation History**: Paste the conversation that has happened so far
2. **Set Your Goal**: Specify what you want to achieve (e.g., "make her laugh", "build deeper connection")
3. **Add Context**: Include relevant background information
4. **Choose Tone**: Select the desired tone for your response
5. **Get Suggestions**: Receive 2-3 strategic reply options with explanations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have questions or need help, please open an issue in this repository.

---

**Made with ❤️ for better conversations and authentic connections.**
