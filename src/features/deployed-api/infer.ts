import { getClient } from "../../helpers/llm-labs/getClient";
import { getModelByProviderAndName } from "../../helpers/llm-labs/getModelByProviderAndName";
import { printChatCompletionStream } from "../../helpers/printChatCompletionStream";
import { printModel } from "../../helpers/printModel";

(async () => {
  const client = getClient(process.env.LLM_LABS_DEPLOYED_API);
  const response = await client.chat.completions.create({
    // stream: true,
    model: undefined as any,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What is EBT?",
          },
        ],
      },
    ],
  });

  // await printChatCompletionStream(response);
  console.log(JSON.stringify(response, null, 2));
})();
