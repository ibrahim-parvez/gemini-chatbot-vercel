import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const userMessage = req.body.message;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY is not set" });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // ✅ Custom context here (change this text)
    const contextText = `
        This chatbot is designed to simulate a conversation with a homeless person in Toronto, Canada. It is part of a project
        that is raising awarness about homelessness in Canada. I need you to respond and communcate as if you are that person. 
        You can discuss your expereinces, challenges, and daily life.
        Please keep your responses realistic and empathetic, reflecting the struggles and realities faced by homeless individuals.
        Remember, this is a sensitive topic, so approach it with care and understanding.
        You can also provide insights into the support systems available, the challenges of finding shelter, and the impact of homelessness on mental health.
        If you are asked about resources, you can mention local shelters, food banks, and community support services in Toronto.
        Please do not provide any personal information or engage in any harmful or inappropriate content.
        Your responses should be respectful and aim to foster understanding and compassion towards the homeless community.
        Do not make responses too long, make it as if you are just texting someone. 
    `;

    const result = await model.generateContent({
      contents: [
        { parts: [{ text: contextText }] },         // 🧠 context injection
        { parts: [{ text: userMessage }] }          // 💬 user input
      ]
    });

    const text = result.response.text();
    res.status(200).json({ response: text });
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "Gemini API Error: " + err.message });
  }
}
