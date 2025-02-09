import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initializeAgent } from './cli-agent.ts';
import { HumanMessage } from '@langchain/core/messages';

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let agent;
let config;

initializeAgent().then((result) => {
    agent = result.agent;
    config = result.config;
});

app.post('/api/chat', async (req, res) => {
    const userInput = req.body.message;

    try {
        const stream = await agent.stream(
            { messages: [new HumanMessage(userInput)] },
            config
        );

        let responseMessage = '';
        for await (const chunk of stream) {
            if ('agent' in chunk) {
                responseMessage += chunk.agent.messages[0].content;
            } else if ('tools' in chunk) {
                responseMessage += chunk.tools.messages[0].content;
            }
        }

        res.json({ response: responseMessage });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});