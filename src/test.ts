import { getClient } from "./helpers/llm-labs/getClient";
import { getModelByProviderAndName } from "./helpers/llm-labs/getModelByProviderAndName";
import { printChatCompletionStream } from "./helpers/printChatCompletionStream";
import { printModel } from "./helpers/printModel";

(async () => {
  const client = getClient("/sandbox/1/1/sandbox-1");
  // const models = await client.models.list();
  // const model = getModelByProviderAndName(
  //   models,
  //   "AMAZON_BEDROCK",
  //   "meta.llama3-8b-instruct-v1:0"
  // )!;
  // printModel(model);
  const response = await client.chat.completions.create({
    stream: true,
    // model: "",
    model: undefined as any,
    messages: [{ role: "user", content: "Hello!" }],
  });

  await printChatCompletionStream(response);
  // console.log(response.choices[0].message.content);
})();
