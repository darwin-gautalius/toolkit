import { getClient } from "../../helpers/llm-labs/getClient";
import { getModelByProviderAndName } from "../../helpers/llm-labs/getModelByProviderAndName";
import { printChatCompletionStream } from "../../helpers/printChatCompletionStream";
import { printModel } from "../../helpers/printModel";

(async () => {
  const client = getClient();
  const models = await client.models.list();
  const model = getModelByProviderAndName(
    models,
    "OPEN_AI",
    "gpt-4o-mini-2024-07-18"
  )!;
  printModel(model);
  const response = await client.chat.completions.create({
    stream: true,
    model: model.id,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "explain the image to me",
          },
          {
            type: "image_url",
            image_url: {
              url: "https://cdn.idntimes.com/content-images/community/2022/01/20220107-065619-329ae2b286ff7799fbbec7d4597d307a-2fe8bfd56abf5d4ca07e5cd5e3af3057.jpg",
            },
          },
        ],
      },
    ],
  });

  await printChatCompletionStream(response);
})();
