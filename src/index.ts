import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
config();

import dayjs from "dayjs";
import { createPage, date, singleSelect, title } from "./notion";

const DAYS: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const databaseId = process.env.NOTION_DATABASE_ID!;

main();

export default async function main() {
  const weeklyTasks = readFileSync(join(__dirname, "./tasks.txt"), {
    encoding: "utf-8",
  });

  for (const dailyTasks of weeklyTasks.split("## ")) {
    if (!dailyTasks.trim()) {
      continue;
    }
    const [day, ...tasks] = dailyTasks.split("\n");
    // console.log(dayOfWeekToDate(day), cleanUpTask(tasks));
    await insertTasks(dayOfWeekToDate(day), cleanUpTask(tasks));
  }
}

function cleanUpTask(tasks: string[]): string[] {
  return tasks.map((x) => x.trim()).filter(Boolean);
}

function dayOfWeekToDate(dayOfWeek: string) {
  const day = DAYS[dayOfWeek];
  return dayjs().day(day).format("YYYY-MM-DD");
}

function getTags(task: string) {
  task = task.toLowerCase();
  if (task.startsWith("review")) {
    return "review";
  }
  if (
    task.includes("discuss") ||
    task.includes("meeting") ||
    task.includes("1:1") ||
    task.includes("sprint planning") ||
    task.includes("sprint retrospective") ||
    task.includes("weekly") ||
    task.includes("feature deep dive") ||
    task.includes("task prioritization") ||
    task.includes("task estimation") ||
    task.includes("golf") ||
    task.includes("design review") ||
    task.includes("roadmap planning") ||
    task.includes("Proteus ") ||
    task.includes("Epic Update") ||
    task.includes("Brownbag") ||
    task.includes("optimus") ||
    task.includes("neptune") ||
    task.includes("sync") ||
    task.includes("gl talk")
  ) {
    return "meeting";
  }
  if (
    task.startsWith("#") ||
    task.startsWith("implement") ||
    task.startsWith("prepare QA")
  ) {
    return "task";
  }
  return "";
}
