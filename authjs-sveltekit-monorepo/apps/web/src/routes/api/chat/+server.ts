import type { RequestHandler } from "@sveltejs/kit";
import { auth } from "@auth/sveltekit";
import { google } from "@ai-sdk/google";
import { streamText, generateText } from "ai";

export const POST: RequestHandler = async (event) => {
  const session = await auth(event);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const { messages, stream } = await event.request.json();
  const model = google("models/gemini-1.5-flash");
  if (stream) {
    const result = await streamText({ model, messages });
    return result.toAIStreamResponse();
  } else {
    const result = await generateText({ model, messages });
    return new Response(JSON.stringify({ text: result.text }), { status: 200 });
  }
};
