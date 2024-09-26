import { getClient } from "../../helpers/llm-labs/getClient";
import { getModelByProviderAndName } from "../../helpers/llm-labs/getModelByProviderAndName";
import { printChatCompletionStream } from "../../helpers/printChatCompletionStream";
import { printModel } from "../../helpers/printModel";

(async () => {
  const client = getClient();
  const models = await client.models.list();
  const model = getModelByProviderAndName(
    models,
    "AMAZON_BEDROCK",
    "meta.llama3-8b-instruct-v1:0"
  )!;
  printModel(model);
  const response = await client.chat.completions.create({
    stream: true,
    model: model.id,
    messages: [{ role: "user", content: "Hello!" }],
  });

  await printChatCompletionStream(response);
})();
