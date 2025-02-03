import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { generateCalendar } from "../_shared/ics/create_event.ts";
import { Database } from "../_shared/database.types.ts";

serve(async (req: Request) => {
  const { id } = await req.json();

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID not provided" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const { data: bookings, error } = await supabaseClient.rpc(
      "get_bookings_by_calendar_id",
    );

    if (error) throw error;

    const calendarContent = await generateCalendar(bookings);

    return new Response(calendarContent, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": 'attachment; filename="calendar.ics"',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate calendar" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
});
