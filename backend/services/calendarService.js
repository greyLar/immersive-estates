const CALENDAR_ENABLED = process.env.CALENDAR_ENABLED === 'true' || false;

async function createCalendarEvent({ title, startTime, endTime, location, description }) {
  if (CALENDAR_ENABLED && process.env.GOOGLE_CALENDAR_ID) {
    // Google Calendar API v3
    // const { google } = require('googleapis');
    // const auth = new google.auth.JWT(...);
    // const calendar = google.calendar({ version: 'v3', auth });
    // await calendar.events.insert({ calendarId: 'primary', resource: { ... } });
  } else {
    console.log(`[CALENDAR] Event: ${title} @ ${startTime}`);
    console.log(`[CALENDAR] Location: ${location}`);
    console.log(`[CALENDAR] Description: ${description?.substring(0, 100)}`);
  }
  return { success: true, title, startTime };
}

module.exports = { createCalendarEvent };
