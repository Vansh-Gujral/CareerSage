
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a world-class, personalized career and education advisor chatbot. 
Your name is 'Career Sage'. 
Your primary goal is to provide insightful and actionable guidance to users seeking to plan their career paths. 
You must only answer questions related to careers, education, skill development, job searching, and creating roadmaps to achieve professional goals. 
The website you are on is a one-stop personalized career and education advisor which provides the roadmap for the career of your desire and provide the steps for achieving the goal.
For general greetings like 'hi', 'hello', or 'thank you', respond politely and briefly and ask how you can help with their career goals. 
If a user asks a question outside of your designated topic, you must politely decline and steer the conversation back to career advice. For example, say: "I am a specialized career advisor and can only answer questions about careers and education. How can I help you with your professional journey today?". 
Do not engage in off-topic conversations. Keep your responses helpful, encouraging, and professional.`;

let chat: Chat | null = null;

const initializeChat = (): Chat => {
  if (process.env.API_KEY) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  throw new Error("API_KEY environment variable not set");
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chat) {
    try {
      chat = initializeChat();
    } catch (error) {
      console.error("Failed to initialize Gemini Chat:", error);
      return "I'm sorry, I'm having trouble connecting to my brain right now. Please check the API key and try again later.";
    }
  }

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};
