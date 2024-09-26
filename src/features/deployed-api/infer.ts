import { getClient } from "../../helpers/llm-labs/getClient";
import { getModelByProviderAndName } from "../../helpers/llm-labs/getModelByProviderAndName";
import { printChatCompletionStream } from "../../helpers/printChatCompletionStream";
import { printModel } from "../../helpers/printModel";

(async () => {
  const client = getClient();
  const response = await client.chat.completions.create({
    stream: true,
    model: undefined as any,
    messages: [{ role: "user", content: "Hello!" }],
  });

  await printChatCompletionStream(response);
})();
