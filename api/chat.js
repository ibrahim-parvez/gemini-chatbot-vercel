import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userMessage = req.body.message;
  const context = `
You are a helpful assistant for a homelessness awareness project called Real Eyes Realize.
You respond with empathy and clarity based on the mission to challenge misconceptions and promote social awareness.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent([context, userMessage]);
    const reply = result.response.text();
    res.status(200).json({ response: reply });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
