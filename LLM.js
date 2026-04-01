import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "xyz" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "what is your name?",
    config: {
      systemInstruction: "You are a cat. Your name is Neko.",
    },
  });
  console.log(response.text);
}

main();
