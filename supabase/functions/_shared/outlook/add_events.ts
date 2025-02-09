import { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import type { Event } from "npm:@microsoft/microsoft-graph-types";
import { Database } from "../database.types.ts";
import export_booking_id from "./extract_booking_id.ts";

// https://learn.microsoft.com/en-us/graph/api/resources/event?view=graph-rest-1.0

export default async function add_events(
  supabaseClient: SupabaseClient<Database>,
  user_id: string,
  events: Event[],
): Promise<number> {
  let buffer: Database["public"]["Tables"]["calendar_event"]["Row"][] = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    const id = event["id"];
    const start = event["start"];
    const end = event["end"];
    const transactionId = export_booking_id(event["transactionId"]);

    if (!id || !start || !end || !start.dateTime || !end.dateTime) {
      continue;
    }

    buffer.push({
      booking_url: transactionId,
      id: id,
      start_time: start.dateTime,
      user_id: user_id,
      end_time: end.dateTime,
    });
  }

  const { error } = await supabaseClient.from("calendar_event").upsert(buffer);

  if (error) {
    return -1;
  }

  return buffer.length;
}
