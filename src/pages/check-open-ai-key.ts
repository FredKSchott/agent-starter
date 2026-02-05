import { OPENAI_API_KEY } from "astro:env/server";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const hasOpenAIKey = !!OPENAI_API_KEY;

  return Response.json({ success: hasOpenAIKey });
};
