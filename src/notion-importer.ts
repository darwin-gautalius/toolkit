//#region Notion Helpers
import { Client } from "@notionhq/client";

export class NotionClient {
  private notion: Client;
  constructor(notionAuthToken: string) {
    this.notion = new Client({ auth: notionAuthToken });
  }

  async createPage(database_id: string, properties: any) {
    return this.notion.pages.create({
      parent: {
        type: "database_id",
        database_id,
      },
      properties,
    });
  }
}

export function title(content: string) {
  return { title: [{ type: "text", text: { content } }] };
}

export function text(content: string) {
  return { rich_text: [{ type: "text", text: { content } }] };
}

export function numeric(value: number) {
  return { number: value };
}

export function date(start: Date, end?: Date, time_zone?: string) {
  return {
    date: {
      start: start.toISOString(),
      end: end?.toISOString(),
      time_zone,
    },
  };
}

export function url(value: string) {
  return { url: value };
}

export function multiSelect(names: string[]) {
  return { multi_select: names.map((name) => option(name)) };
}

export function singleSelect(name: string) {
  return { select: option(name) };
}

function option(name: string, id?: string, color?: Color) {
  return { name, id, color };
}

type Color =
  | "blue"
  | "brown"
  | "default"
  | "gray"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "yellow";

//#endregion

//#region Data Structure

interface Row {
  Date: string;
  City: string;
  "Time Start": string;
  "Time End": string;
  Schedule: string;
  Cost: string;
  Route: string;
  Notes: string;
  "Booking Link": string;
}

function pickNonEmpty(rowA: Row, rowB: Row, key: keyof Row) {
  return rowA[key] || rowB[key];
}

function emptyRow(): Row {
  return {
    Date: "",
    City: "",
    "Time Start": "",
    "Time End": "",
    Schedule: "",
    Cost: "",
    Route: "",
    Notes: "",
    "Booking Link": "",
  };
}

//#endregion

//#region Data Processing

import { readFileSync } from "fs";
import { parse } from "papaparse";

function loadFile(path: string) {
  const data = readFileSync(path, { encoding: "utf-8" });
  const rows = parse<Row>(data, { header: true }).data;
  return rows;
}

function processRows(rows: Row[]) {
  let temp = emptyRow();
  let reducedRows: Row[] = [];
  function flush() {
    if (temp && temp.Schedule.length) {
      reducedRows.push(temp);
    }
    temp = {
      ...emptyRow(),
      Date: temp.Date,
      City: temp.City,
    };
  }

  function mergeWithTemp(row: Row) {
    if (!temp) return row;
    return {
      Date: pickNonEmpty(row, temp, "Date"),
      City: pickNonEmpty(row, temp, "City"),
      "Time Start": pickNonEmpty(temp, row, "Time Start"),
      "Time End": pickNonEmpty(row, temp, "Time End"),
      Schedule: pickNonEmpty(row, temp, "Schedule"),
      Cost: pickNonEmpty(row, temp, "Cost"),
      Route: pickNonEmpty(row, temp, "Route"),
      Notes: pickNonEmpty(row, temp, "Notes"),
      "Booking Link": pickNonEmpty(row, temp, "Booking Link"),
    };
  }

  rows.forEach((current) => {
    if (current.Schedule.length) {
      flush();
    }
    temp = mergeWithTemp(current);
  });
  flush();
  return reducedRows;
}

function convertRowToPageProperties(row: Row) {
  const timezones: Record<string, { offset: string; timezone: string }> = {
    Jakarta: { offset: "+07:00", timezone: "Asia/Jakarta" },
    Singapore: { offset: "+08:00", timezone: "Asia/Singapore" },
    "South Korea: Incheon": { offset: "+09:00", timezone: "Asia/Seoul" },
    "South Korea: Busan": { offset: "+09:00", timezone: "Asia/Seoul" },
    "South Korea: Seoul": { offset: "+09:00", timezone: "Asia/Seoul" },
    "South Korea: Suwon": { offset: "+09:00", timezone: "Asia/Seoul" },
    "South Korea: Gapyeong": { offset: "+09:00", timezone: "Asia/Seoul" },
  };

  return {
    Schedule: title(row.Schedule),
    Date: getDate(row),
    Cost: getCost(row),
    Route: Optional(row.Route, url),
    Notes: Optional(row.Notes, text),
    "Booking Link": Optional(row["Booking Link"], url),
  };

  function Optional<T, U>(
    value: T | "",
    convert: (val: T) => U
  ): U | undefined {
    if (value === "") {
      return undefined;
    }

    return convert(value);
  }

  function getDate(row: Row) {
    const timezone = timezones[row.City];
    const startDate = new Date(
      `${row.Date}, ${row["Time Start"]}${timezone.offset}`
    );
    const endDate = new Date(
      `${row.Date}, ${row["Time End"]}${timezone.offset}`
    );
    if (startDate > endDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    console.log(row.Date, row["Time Start"], row["Time End"]);
    return date(startDate, endDate);
  }

  function getCost(row: Row) {
    if (row.Cost) {
      const sanitized = row.Cost.replace("₩", "").split(",").join("");
      const parsed = +sanitized;
      return numeric(parsed);
    }
    return undefined;
  }
}

import { join } from "path";

//#endregion

async function main() {
  const authToken = process.env.NOTION_TOKEN!;
  const pageId = process.env.NOTION_PAGE_ID!;
  const notionClient = new NotionClient(authToken);
  console.log("parsing file...");
  const parsed = loadFile(join(__dirname, "./data.csv"));
  console.log("processing rows...");
  const processedRows = processRows(parsed);
  console.log(`collected ${processedRows.length} items...`);

  const offset = 0;
  for (const index in processedRows.slice(offset)) {
    console.log(
      `sending row ${+index + offset + 1} of ${processedRows.length}...`
    );
    const properties = convertRowToPageProperties(processedRows[index]);
    await notionClient.createPage(pageId, properties);
  }

  console.log("done!");
}

main().then(() => process.exit(0));
