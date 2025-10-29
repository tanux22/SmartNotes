import { GoogleGenAI } from "@google/genai";

const generateContent = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      const error = new Error("Prompt is required");
      error.statusCode = 400;
      return next(error);
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = 'gemini-2.5-pro';
    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    // This will stream chunks
    const stream = await ai.models.generateContentStream({
      model,
      contents,
    });

    let fullText = '';
    for await (const chunk of stream) {
      fullText += chunk.text || '';
      console.log(chunk.text);
    }

    // Send the collected text back
    res.sendResponse({ generatedText: fullText }, 200);

  } catch (error) {
    console.error("Gemini API Error:", error);
    next(error);
  }
};

export default generateContent;
