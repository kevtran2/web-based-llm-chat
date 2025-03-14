require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Rate limit exceeded. Please try again after 1 minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // note to Lei: please provide a .env variable with your own OPENAI_API_KEY
});

app.post('/', chatLimiter, async (req, res) => {
    try {
        const reqBody = req.body.prompt;
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: reqBody,
                }
            ],
            stream: true,
        });
        for await (const chunk of stream) {
            res.write(chunk.choices[0]?.delta?.content || '');
        }
        res.end('');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
})

app.listen(8080, () => {
    console.log('server listening on 8080')
});





