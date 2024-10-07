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
                text: "Answer the question shortly.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "What is beak trimming?",
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
