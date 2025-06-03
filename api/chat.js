import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          {
            text: `You are an assistant for a homelessness awareness project called Real Eyes Realize. 
Answer thoughtfully and clearly. User question: ${message}`,
          },
        ],
      },
    ]);

    const response = result.response.text();
    res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
