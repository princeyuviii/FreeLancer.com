import { GoogleGenerativeAI } from "@google/generative-ai";
import { StreamingTextResponse } from "ai";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response("GEMINI_API_KEY is not set", { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const introPrompt = "You are a helpful and friendly AI assistant for a freelancing platform focused on helping beginners. Your goal is to assist users who are working on real projects by providing guidance, explanations, and suggestions whenever they are stuck. Provide answers in a short and concise way. If needed, you can also explain how they can approach mentors available on the platform. Always keep responses clear, supportive, and beginner-friendly.";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: introPrompt,
    });

    // Format chat history for Gemini
    // Note: Gemini roles are 'user' and 'model'
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    
    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessageStream(lastMessage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Chat Error:", error);
    return new Response("An error occurred during the chat request", { status: 500 });
  }
}