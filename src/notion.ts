import { Client } from "@notionhq/client";
import dayjs from "dayjs";

const databaseId = process.env.NOTION_DATABASE_ID!;
const weeklyDatabaseId = process.env.NOTION_WEEKLY_DATABASE_ID!;

export const client = new Client({ auth: process.env.NOTION_TOKEN! });

export async function insertTasks(
  tasks: string[],
  taskDate: string,
  tag: string
) {
  for (const task of tasks) {
    await createPage(databaseId, {
      Name: title(task),
      Tags: singleSelect(tag),
      Date: date(taskDate),
    });
  }
}

export function updateTag(page_id: string, tag: string) {
  return updatePage(page_id, {
    Tags: singleSelect(tag),
  });
}

export function updatePage(page_id: string, properties: Record<string, any>) {
  console.log("updating", page_id, properties);
  return client.pages.update({
    page_id,
    auth: process.env.NOTION_TOKEN!,
    properties,
  });
}

export function createPage(database_id: string, properties: any) {
  console.log("creating", database_id, properties);
  return client.pages.create({
    parent: { database_id },
    auth: process.env.NOTION_TOKEN!,
    properties,
  });
}

export function readWeeklyDatabaseThisWeek() {
  return client.databases.query({
    database_id: weeklyDatabaseId,
    auth: process.env.NOTION_TOKEN!,
    filter: {
      property: "Created time",
      date: {
        this_week: {},
      },
    },
  });
}

export async function tryCreateWeeklyPageByTitle(pageTitle: string) {
  const response = await readWeeklyDatabaseThisWeek();
  let page = response.results.find(
    (page: any) => page.properties.Name.title[0].plain_text === pageTitle
  );
  if (!page) {
    page = await createPage(weeklyDatabaseId, {
      Name: title(pageTitle),
    });
  }
  return { page, link: `https://www.notion.so/${page.id.replace(/-/g, "")}` };
}

export function readDatabaseThisWeek() {
  return client.databases.query({
    database_id: databaseId,
    auth: process.env.NOTION_TOKEN!,
    filter: {
      property: "Date",
      date: {
        this_week: {},
      },
    },
  });
}

export function readDatabaseWithinDate(date: dayjs.ConfigType) {
  return client.databases.query({
    database_id: databaseId,
    auth: process.env.NOTION_TOKEN!,
    filter: {
      property: "Date",
      date: {
        equals: dayjs(date).format("YYYY-MM-DD"),
        // before: "",
        // after: "",
        // on_or_before: "",
        // on_or_after: "",
        // this_week: {},
        // past_week: {},
        // past_month: {},
        // past_year: {},
        // next_week: {},
        // next_month: {},
        // next_year: {},
      },
    },
  });
}

export function date(start: string, end?: string) {
  return { date: { start, end } };
}

export function multiSelect(names: string[]) {
  return {
    multi_select: names.map((name) => ({ name })),
  };
}

export function singleSelect(name?: string | null) {
  if (!name) {
    return undefined;
  }
  return {
    select: { name },
  };
}

export function title(content: string) {
  return {
    title: [{ type: "text", text: { content } }],
  };
}
