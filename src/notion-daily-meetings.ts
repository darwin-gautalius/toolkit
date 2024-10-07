import { insertTasks } from "./notion";
import { getRelativeDateArgument } from "./helpers/arguments/getRelativeDateArgument";
import { readCalendar } from "./services/google/readCalendar";
import { TAGS } from "./tag";

(async () => {
  const day = getRelativeDateArgument();
  const items = await readCalendar(day.startOf("day"), day.endOf("day"));
  console.log(items.join("\n"));
  insertTasks(items, day.format("YYYY-MM-DD"), TAGS.MEETING);
})();
