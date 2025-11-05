import { GoogleGenAI } from "@google/genai";

// const generateContent = async (req, res, next) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       const error = new Error("Prompt is required");
//       error.statusCode = 400;
//       return next(error);
//     }

//     const ai = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });

//     const model = 'gemini-2.5-pro';
//     const contents = [
//       {
//         role: 'user',
//         parts: [{ text: prompt }],
//       },
//     ];

//     // This will stream chunks
//     const stream = await ai.models.generateContentStream({
//       model,
//       contents,
//     });

//     let fullText = '';
//     for await (const chunk of stream) {
//       fullText += chunk.text || '';
//       console.log(chunk.text);
//     }

//     // Send the collected text back
//     res.sendResponse({ generatedText: fullText }, 200);

//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     next(error);
//   }
// };

// export default generateContent;



export const streamAIContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = "gemini-2.5-pro";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const contents = [{ role: "user", parts: [{ text: prompt }] }];
    const stream = await ai.models.generateContentStream({ model, contents });

    for await (const chunk of stream) {
      const text = chunk.text || "";
      if (text.trim()) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Stream error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};