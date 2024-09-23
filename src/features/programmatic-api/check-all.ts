import { getClient } from "../../helpers/llm-labs/getClient.js";
import { printChatCompletionStream } from "../../helpers/printChatCompletionStream.js";
import { printModel } from "../../helpers/printModel.js";

(async () => {
  const client = getClient();
  const models = await client.models.list();

  const errors: any[] = [];
  for (const model of models.data.slice(1)) {
    try {
      printModel(model);
      const result = await client.chat.completions.create({
        stream: true,
        model: model.id,
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are a helpful assistant that translates English to Italian.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Translate the following sentence from English to Italian: I love programming.",
              },
            ],
          },
        ],
      });
      await printChatCompletionStream(result);
    } catch (error) {
      console.error("error:", (error as Error).message);
      errors.push({ model: model, error });
    }
  }
  errors.forEach(({ model, error }) =>
    console.error(
      "error:",
      model.id,
      model["provider"],
      model["name"],
      error.message
    )
  );
})();
