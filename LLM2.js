import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({ apiKey: "AIzaSyBFzdI1Tb3Ilq_vX-5_OKAo_a1dBVZfdrw" });

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
