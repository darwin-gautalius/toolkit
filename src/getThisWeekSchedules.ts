function getThisWeekSchedule() {
  const excludeKeywords = ["Set Agenda or Cancel", "Lunch Time"];
  const oneOnOneKeywords = ["1:1", "Darwin / ", " / Darwin"];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return new Array(6)
    .fill(0)
    .map((_, index) => {
      const nodes = document.querySelectorAll(
        `[data-column-index="${index + 1}"] [data-eventchip]`
      );
      const schedules = Array.from(nodes)
        .map((node) => {
          let text = node.innerText
            .split("\n")
            .slice(1, -1)
            .filter((t) => !t.startsWith(","))
            .join(" ");

          if (is1o1(text)) {
            return normalize1on1(text);
          }
          return text;
        })
        .filter((text) =>
          excludeKeywords.every((keyword) => !text.includes(keyword))
        );
      return [`## ${days[index]}`, ...schedules].join("\n");
    })
    .join("\n\n");

  function is1o1(text) {
    return oneOnOneKeywords.some((keyword) => text.includes(keyword));
  }

  function normalize1on1(text) {
    const name = eliminateSubstrings(text, [
      ...oneOnOneKeywords,
      "(",
      ")",
      "-",
      "/",
      "Darwin",
    ]).trim();
    return `1:1 with ${name}`;
  }

  function eliminateSubstrings(str, arr) {
    const result = arr.reduce((acc, cur) => acc.split(cur).join(""), str);
    return result;
  }
}
getThisWeekSchedule();
