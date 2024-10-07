import { readDatabaseThisWeek, updateTag } from "./notion";
import { getTag } from "./tag";

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
    const tag = getTag(page.title);
    if (tag) {
      console.log("updating", tag.padEnd(10), page.title);
      await updateTag(page.id, tag);
    }
  }
}
