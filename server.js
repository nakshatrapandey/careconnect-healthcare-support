// Load environment variables
require("dotenv").config();

const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON from frontend
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
    res.send("CareConnect Backend is running");
});

// Chat endpoint (Frontend will call this)
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
    contents: [
        {
            role: "user",
            parts: [
                {
                    text:
                        "You are an NGO healthcare support assistant. " +
                        "Provide only general, supportive, non-diagnostic guidance. " +
                        "Do not give medical advice or diagnoses. " +
                        "If the user mentions emergency or self-harm, advise contacting local emergency services or a trusted professional.\n\n" +
                        userMessage
                }
            ]
        }
    ],
    safetySettings: [
        {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
        },
        {
            category: "HARM_CATEGORY_SELF_HARM",
            threshold: "BLOCK_ONLY_HIGH"
        }
    ],
    generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 256
    }
})

            }
        );

        const data = await response.json();

        let reply = "Sorry, I could not generate a response.";

        if (
            data.candidates &&
            data.candidates.length > 0 &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts.length > 0
        ) {
            reply = data.candidates[0].content.parts[0].text;
        }

        res.json({ reply });
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to Gemini API" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
