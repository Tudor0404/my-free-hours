// single_event.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { generateCalendar } from "../_shared/ics/create_event.ts";
import { Database } from "../_shared/database.types.ts";

serve(async (req: Request) => {
  try {
    let id: string | null = null;
    const contentType = req.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      // Handle JSON payload
      const json = await req.json();
      id = json.id;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Handle form data
      const form = await req.formData();
      const formId = form.get("id");
      if (typeof formId === "string") {
        id = formId;
      }
    }

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Booking URL not provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    // Retrieve the booking using the SQL function get_booking_by_url_id.
    const { data: booking, error } = await supabaseClient.rpc(
      "get_booking_by_url_id",
      { p_url_id: id },
    ).single();

    if (error || !booking) {
      return new Response(
        JSON.stringify({
          error: "Booking not found " + JSON.stringify(error) + " " + booking,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Use generateCalendar by passing an array with the booking.
    const icsContent = await generateCalendar([
      booking as Database["public"]["Views"]["combined_bookings"]["Row"],
    ]);

    return new Response(icsContent, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": 'attachment; filename="event.ics"',
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Failed to generate event " + err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
