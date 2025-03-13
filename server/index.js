require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const OpenAI = require('openai');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Successfully called server GET request'})
});

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // note to Lei: please provide a .env variable with your own OPENAI_API_KEY
});

app.post('/', async (req, res) => {
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
})

app.listen(8080, () => {
    console.log('server listening on 8080')
});





