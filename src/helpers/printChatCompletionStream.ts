import { OpenAI } from "openai";
import { Stream } from "openai/streaming";

export async function printChatCompletionStream(
  stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
) {
  for await (const chunk of stream) {
    let content;
    if ((content = chunk.choices[0]?.delta?.content)) {
      process.stdout.write(content.toString());
    }
  }
  process.stdout.write("\n");
}
