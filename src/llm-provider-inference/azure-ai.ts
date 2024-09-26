import OpenAI from "openai";

(async () => {
  const client = new OpenAI({
    baseURL: process.env.AZURE_AI_ENDPOINT,
    apiKey: process.env.AZURE_AI_TOKEN,
  });
  const response = await client.chat.completions.create({
    model: "",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that translates English to Italian.",
      },
      {
        role: "user",
        content:
          "Translate the following sentence from English to Italian: I love programming.",
      },
    ],
    temperature: 0.8,
    max_tokens: 512,
  });
  console.log(response.choices[0].message.content);
})();
