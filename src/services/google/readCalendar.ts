import { google } from "googleapis";
import dayjs from "dayjs";

const skippedEvents = ["Daily Meeting Golf", "Zenhub pulse check"];

export function readCalendar(start: dayjs.Dayjs, end: dayjs.Dayjs) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({ refresh_token: process.env.GOOGLE_PERSONAL_TOKEN });

  const calendar = google.calendar({ version: "v3", auth });

  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: "primary",
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      },
      (err, res) => {
        if (err) return reject(err);
        const events = res?.data.items || [];
        const filteredEvents = events
          .filter(
            (event) =>
              event.status !== "cancelled" &&
              !!event.attendees?.find(
                (attendee) =>
                  attendee.email === "darwin@datasaur.ai" &&
                  attendee.responseStatus !== "declined"
              ) &&
              !skippedEvents.includes(event.summary || "")
          )
          .map((event) => event.summary);
        resolve(filteredEvents);
      }
    );
  });
}
