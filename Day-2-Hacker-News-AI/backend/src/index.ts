import express from 'express';
import dotenv from 'dotenv';
import { summarizeWithGemini } from './services/gemini.service.js';
import { getHackerNewsItem, getTopStoryIds } from './services/hackernews.service.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/summarize-story/:itemId', async (req, res) => {
    try {
       


        const itemId = Number(req.params.itemId);
        let newsItem = await getHackerNewsItem(itemId);

        let summary = await summarizeWithGemini(newsItem.title + ' - ' + newsItem.text);
    
        console.log('Summarized Hacker News item:', summary);
        res.json({"hn summary": summary});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
