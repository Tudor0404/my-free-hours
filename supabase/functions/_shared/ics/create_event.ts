import {
  createEvents,
  DateArray,
  DurationObject,
  EventAttributes,
} from "npm:ics";
import { Database } from "../database.types.ts";

type CombinedBooking = Database["public"]["Views"]["combined_bookings"]["Row"];

export function convertToDateArray(dateString: string): DateArray {
  const date = new Date(dateString);
  return [
    date.getFullYear(),
    date.getMonth() + 1, // Months are 0-based in JS
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
}

function calculateDurationComponents(
  minutes: number,
): DurationObject {
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };
}

function generateActiveEvent(
  booking: CombinedBooking,
): EventAttributes {
  const event: EventAttributes = {
    start: convertToDateArray(booking.start_time || ""),
    title: booking.type_name || "Meeting",
    classification: "PRIVATE",
    uid: `${booking.booking_calendar_id}@myfreehours.app`,
    transp: "OPAQUE",
    duration: calculateDurationComponents(booking.duration || 0),
  };

  // Add URL if url_id is available
  if (booking.url_id) {
    event.url = `${Deno.env.get("WEBSITE_URL")}booking/${booking.url_id}`;
  }

  // Add description if available
  if (booking.type_description) {
    event.description = booking.type_description;
  }

  // Add organizer if host information is available
  if (booking.host_email) {
    event.organizer = {
      email: booking.host_email,
      name: booking.host_name || undefined,
    };
  }

  // Add attendee (guest) if information is available
  if (booking.guest_email || booking.guest_name) {
    event.attendees = [{
      email: booking.guest_email || undefined,
      name: booking.guest_name || undefined,
      rsvp: true,
      partstat: "ACCEPTED",
      role: "REQ-PARTICIPANT",
    }];
  }

  // Add meeting method as category
  if (booking.meeting_method) {
    event.categories = [booking.meeting_method.toUpperCase()];
  }

  return event;
}

export function generateDeletedEvent(
  booking: CombinedBooking,
): EventAttributes {
  const event: EventAttributes = {
    start: convertToDateArray(booking.start_time || ""),
    title: `[CANCELLED] ${booking.type_name || "Meeting"}`,
    status: "CANCELLED",
    classification: "PRIVATE",
    uid: `${booking.booking_calendar_id}@myfreehours.app`,
    transp: "OPAQUE",
    duration: calculateDurationComponents(booking.duration || 0),
  };

  return event;
}

export async function generateCalendar(
  bookings: CombinedBooking[],
): Promise<string> {
  const events = bookings.map((booking) =>
    booking.is_deleted
      ? generateDeletedEvent(booking)
      : generateActiveEvent(booking)
  );

  return new Promise((resolve, reject) => {
    createEvents(events, (error: Error | undefined, value: string) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}
