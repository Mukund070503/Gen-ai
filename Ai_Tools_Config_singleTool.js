import { GoogleGenAI,Type } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({ apiKey: "AIzaSyAzeyzp8NGsZx6KdLZggcPwFvI0rJnuA8I" });
const history = []
// Example Functions
function get_weather_forecast({ location }) {
  console.log(`Tool Call: get_weather_forecast(location=${location})`);
  // TODO: Make API call
  console.log("Tool Response: {'temperature': 25, 'unit': 'celsius'}");
  return { temperature: 25, unit: "celsius" };
}

function set_thermostat_temperature({ temperature }) {
  console.log(
    `Tool Call: set_thermostat_temperature(temperature=${temperature})`,
  );
  // TODO: Make API call
  console.log("Tool Response: {'status': 'success'}");
  return { status: "success" };
}

const toolFunctions = {
  get_weather_forecast,
  set_thermostat_temperature,
};

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_weather_forecast",
        description:
          "Gets the current weather temperature for a given location.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            location: {
              type: Type.STRING,
            },
          },
          required: ["location"],
        },
      },
      {
        name: "set_thermostat_temperature",
        description: "Sets the thermostat to a desired temperature.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            temperature: {
              type: Type.NUMBER,
            },
          },
          required: ["temperature"],
        },
      },
    ],
  },
];

async function main() {

    const userQuestion = readlineSync.question("Ask me anything -->");
    history.push({
        role: "user",
        parts: [{ text: userQuestion }],
      })
    while (true){
    const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
        systemInstruction: `you are a AI bot with the tools which are actually functions available to you you can use them
        when required to answer user questions if needed other keep working as you are doing right now.`,
        tools: tools},
        
});
    console.log(result.functionCalls);
    if (result.functionCalls && result.functionCalls.length > 0) {
    const functionCall = result.functionCalls[0];

    const { name, args } = functionCall;

    if (!toolFunctions[name]) {
      throw new Error(`Unknown function call: ${name}`);
    }
    const toolResponse = toolFunctions[name](args);

    const functionResponsePart = {
      name: functionCall.name,
      response: {
        result: toolResponse,
      },
    };

    history.push({
      role: "user",
      parts: [
        {
          functionResponse: functionResponsePart,
        },
      ],
    });}
  else {
    // No more function calls, break the loop.
    console.log(result.text);
    history.push({
        role: "model",
        parts: [{ text: result.text }],
      });
    break;
  }}
    main();
}

main();
