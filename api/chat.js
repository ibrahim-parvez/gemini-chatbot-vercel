import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userMessage = req.body.message;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY env variable." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [{ text: userMessage }]
      }
    ]);

    const reply = result.response.text();
    res.status(200).json({ response: reply });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
