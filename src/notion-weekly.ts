import dayjs from "dayjs";
import {
  createPage,
  readDatabaseThisWeek,
  readWeeklyDatabaseThisWeek,
  title,
  tryCreateWeeklyPageByTitle,
} from "./notion";

const weeklyDatabaseId = process.env.NOTION_WEEKLY_DATABASE_ID!;
main();

export default async function main() {
  const { startOfWeek, endOfWeek, weekRange } = getWeekRange();
  const subject = `[Weekly Report: Darwin] ${weekRange}, ${endOfWeek.year()}\n`;

  const { link } = await tryCreateWeeklyPageByTitle(weekRange);
  const greeting = `Hi all, here is my [weekly report](${link}):\n`;

  const tasksResponse = await readDatabaseThisWeek();
  const pages = tasksResponse.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Name.title
      .map((title: any) => `${title.plain_text}`)
      .join("\n"),
    date: page.properties.Date.date.start,
    tags: page.properties.Tags.select,
  }));
  // Group pages by tags
  const groupedPages = pages.reduce((acc: Record<string, any[]>, page) => {
    const tagName = page.tags ? page.tags.name : "Untagged";
    if (!acc[tagName]) {
      acc[tagName] = [];
    }
    acc[tagName].push(page);
    return acc;
  }, {});

  const tagHeaders = {
    issue: "Issues",
    task: "Tasks",
    review: "Reviews",
    meeting: "Meetings/Discussions",
    reading: "Business, Leadership, Management, Technology",
  };

  const tags: Array<keyof typeof tagHeaders> = [
    "issue",
    "task",
    "review",
    "meeting",
    "reading",
  ];

  // Create a formatted string with grouped pages
  const formattedGroups = tags
    .map((tag) => {
      let content =
        groupedPages[tag]
          ?.map((page) => `- ${page.title.split(/\s+/).join(" ")}`)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => a.localeCompare(b))
          .join("\n") ?? "- N/A";

      const sectionHeader = tagHeaders[tag as keyof typeof tagHeaders] || tag;
      return `## ${sectionHeader}\n${content}`;
    })
    .join("\n\n");

  const body = `${greeting}\n${formattedGroups}`;
  console.log(subject);
  console.log(body);
}

function getWeekRange() {
  const startOfWeek = dayjs().startOf("week").add(1, "day"); // Monday
  const endOfWeek = startOfWeek.add(4, "day"); // Friday
  return {
    startOfWeek,
    endOfWeek,
    weekRange: `${startOfWeek.format("MMMM DD")} - ${endOfWeek.format(
      "MMMM DD"
    )}`,
  };
}
