// routes/ai.routes.js
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables right here

const router = express.Router();

// Initialize OpenAI with API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/query", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or your preferred model
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ 
      response: response.choices[0].message?.content || ''
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

export default router;
