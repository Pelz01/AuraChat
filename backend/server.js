const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'AuraChat Backend is running' });
});

// Conversation coaching endpoint
app.post('/api/conversation', async (req, res) => {
    try {
        const {
            model = 'google/gemini-2.0-flash-exp:free',
            conversationHistory,
            currentGoal,
            additionalContext,
            desiredTone,
        } = req.body;

        // Validate required fields
        if (!conversationHistory || !currentGoal) {
            return res.status(400).json({
                error: 'Missing required fields: conversationHistory and currentGoal are required',
            });
        }

        // Conversation coaching system prompt inspired by Neil Strauss principles
        const systemPrompt = `You are an expert conversation coach and social dynamics advisor, drawing inspiration from the best principles of social attraction and communication mastery. Your role is to help users navigate social interactions with confidence, authenticity, and strategic thinking.

CORE PRINCIPLES:
1. **Observation & Calibration**: Always consider the context and the other person's responses
2. **Demonstration of Value**: Help showcase attractive qualities naturally through conversation
3. **Storytelling & Emotional Connection**: Leverage narrative and emotion to create engagement
4. **Playful Dynamics**: Use appropriate humor and teasing to build rapport
5. **Authentic Confidence**: Promote genuine self-assurance over artificial personas
6. **Respect & Ethics**: NEVER suggest manipulative, disrespectful, or deceptive tactics

RESPONSE FORMAT:
Provide 2-3 distinct reply options, each with:
- The suggested response
- Brief explanation of the strategy behind it
- When to use this approach

TONE GUIDANCE:
- **Playful**: Light banter, teasing, humor that creates fun energy
- **Witty**: Clever wordplay, intelligent humor, quick comebacks
- **Empathetic**: Understanding, supportive, emotionally intelligent
- **Direct**: Honest, straightforward, no games
- **Curious**: Asking engaging questions, showing genuine interest
- **Confident**: Self-assured without arrogance, leading the conversation
- **Mysterious**: Intriguing, not revealing everything, creating curiosity
- **Warm**: Friendly, approachable, making others feel comfortable

ETHICAL BOUNDARIES:
- No manipulation or emotional manipulation tactics
- No suggestions that create false impressions about who the user is
- No disrespectful or objectifying language
- Focus on authentic connection over "winning" or control
- Promote mutual respect and genuine interest

Remember: The goal is to help the user communicate more effectively while remaining authentic and respectful.`;

        // Create the conversation context
        const conversationContext = `
CONVERSATION HISTORY:
${conversationHistory}

CURRENT GOAL: ${currentGoal}

ADDITIONAL CONTEXT: ${additionalContext || 'None provided'}

DESIRED TONE: ${desiredTone}

Based on this context, please provide 2-3 strategic reply options that align with the goal while maintaining the desired tone. Each option should be distinct in approach but ethically sound and authentic.`;

        // Prepare the request to OpenRouter
        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://aurachat.app', // Optional: your site URL
                'X-Title': 'AuraChat', // Optional: your app name
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: conversationContext,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
                stream: false,
            }),
        });

        if (!openRouterResponse.ok) {
            const errorData = await openRouterResponse.text();
            console.error('OpenRouter API error:', errorData);
            return res.status(openRouterResponse.status).json({
                error: 'Failed to get response from AI service',
                details: errorData,
            });
        }

        const result = await openRouterResponse.json();

        // Return the AI response
        res.json({
            response: result.choices[0].message.content,
            model: model,
            usage: result.usage,
        });
    } catch (error) {
        console.error('Conversation API error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AuraChat Backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
