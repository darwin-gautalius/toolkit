import { OpenAI } from "openai";

export function getClient(path: string = "/programmatic") {
  const baseURL = process.env.LLM_LABS_API_BASE_URL! + "/api" + path;
  console.log("baseURL", baseURL);
  return new OpenAI({
    apiKey: process.env.LLM_LABS_TOKEN!,
    baseURL,
  });
}
