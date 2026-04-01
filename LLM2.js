import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({ apiKey: "xyz" });

const bot = await ai.chats.create({
    model: "gemini-3-flash-preview",
    history:[]
});

async function main() {

  const userQuestion = readlineSync.question("Ask me anything -->");
  const response1 = await bot.sendMessage({
    message: userQuestion,
  });
  console.log("Chat response:", response1.text);
  main();
}

main();
