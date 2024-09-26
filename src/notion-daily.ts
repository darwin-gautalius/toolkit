import { config } from "dotenv";
config();

import { readDatabaseWithinDate } from "./notion";
import dayjs from "dayjs";

const args = process.argv.slice(2);
const dateNumber = args[0];

if (!dateNumber) {
  console.error("Please provide a dateNumber as a command line argument.");
  process.exit(1);
}

main(parseInt(dateNumber));

export default async function main(dateNumber: number) {
  const day = dayjs().subtract(dateNumber, "day");
  console.log(day.format("dddd, D MMMM YYYY"));
  console.log(
    (await readDatabaseWithinDate(day)).results
      .map((page: any) =>
        page.properties.Name.title
          .map((title: any) => title.text.content)
          .join("")
      )
      .reverse()
      .join("\n")
  );
}
