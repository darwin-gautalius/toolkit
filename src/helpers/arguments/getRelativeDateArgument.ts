import dayjs from "dayjs";

export function getRelativeDateArgument(argIndex: number = 0) {
  const args = process.argv.slice(2);
  const dateNumber = args[argIndex];

  const relativeDay = parseInt(dateNumber, 10);

  const day = dayjs().subtract(relativeDay, "day");
  console.log(day.format("dddd, D MMMM YYYY"));

  return day;
}
