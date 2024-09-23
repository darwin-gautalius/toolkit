import { WebClient } from "@slack/web-api";
// import { config } from "dotenv";
// config();

const token = process.env.SLACK_TOKEN!;

export const client = new WebClient(token);

export async function getConversations(channel: string) {
  const conversations = await client.conversations.history({
    channel,
  });
  return conversations.messages ?? [];
}

export async function getReplies(channel: string, ts: string) {
  const replies = await client.conversations.replies({ channel: channel, ts });
  return replies.messages ?? [];
}

(async () => {
  const response = await client.conversations.list();
  console.log(
    response.channels?.map(({ id, name }) => `${id}:${name}`).join("\n")
  );
})();
