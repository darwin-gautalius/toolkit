import { readDatabaseThisWeek, updateTag } from "./notion";

main();

export default async function main() {
  const response = await readDatabaseThisWeek();
  const pages = response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Name.title
      .map((title: any) => `${title.plain_text}`)
      .join("\n"),
    date: page.properties.Date.date.start,
    tags: page.properties.Tags.select,
  }));

  const untagged = pages.filter((page) => !page.tags || page.tags.length === 0);

  for (const page of untagged) {
    const tag = getTags(page.title);
    if (tag) {
      console.log("updating", tag.padEnd(10), page.title);
      await updateTag(page.id, tag);
    }
  }
}

function getTags(task: string) {
  const meetingTags = [
    "discuss",
    "meeting",
    "1:1",
    "sprint planning",
    "sprint retrospective",
    "weekly",
    "feature deep dive",
    "task prioritization",
    "task estimation",
    "golf",
    "design review",
    "roadmap planning",
    "Proteus ",
    "Epic Update",
    "Brownbag",
    "optimus",
    "neptune",
    "sync",
    "talks",
    "gl talk",
  ];
  task = task.toLowerCase();
  if (task.startsWith("review")) {
    return "review";
  }
  const isMeeting = meetingTags.some((tag) => task.includes(tag));
  if (isMeeting) {
    return "meeting";
  }
  if (
    task.startsWith("#") ||
    task.startsWith("implement") ||
    task.startsWith("prepare QA") ||
    task.startsWith("breakdown task") ||
    task.startsWith("investigate")
  ) {
    return "task";
  }
  return "";
}
