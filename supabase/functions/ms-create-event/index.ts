import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/database.types.ts";
import type { Event as CalendarEvent } from "npm:@microsoft/microsoft-graph-types";

serve(async (req: Request) => {
  try {
    const {
      start,
      end,
      subject,
      body,
      isOnline,
      guestEmail,
      guestName,
      bookingUrl,
      url_id,
    } = await req.json();

    if (
      !start || !end || !subject || !body || !isOnline || !guestName ||
      !bookingUrl || !url_id
    ) {
      throw new Error("Invalid paramters", { cause: 400 });
    }

    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userIdData, error: errrr } = await supabaseClient.from(
      "booking_page",
    )
      .select("user_id")
      .eq("url_id", url_id).single();

    if (userIdData === null) {
      throw new Error("Unable to fetch user id", {
        cause: 400,
      });
    }

    const refreshRes = await supabaseClient.functions.invoke(
      "ms-refresh-token",
      {
        body: {
          id: userIdData.user_id,
        },
      },
    );

    if (refreshRes.error) {
      throw new Error("Unable to refresh token", { cause: 500 });
    }

    const { data: userData } = await supabaseClient
      .from("user")
      .select("ms_provider_token")
      .eq("user_id", userIdData.user_id)
      .single();

    if (!userData || !userData.ms_provider_token) {
      throw new Error("Unable to fetch user's information", { cause: 500 });
    }

    const newMeetingRes = await fetch(
      "https://graph.microsoft.com/v1.0/me/events",
      {
        body: JSON.stringify({
          subject: subject,
          body: {
            contentType: "text",
            content: body,
          },
          start: {
            dateTime: start,
            timeZone: "UTC",
          },
          end: {
            dateTime: end,
            timeZone: "UTC",
          },
          attendees: [
            {
              emailAddress: {
                address: guestEmail || "",
                name: guestName,
              },
              type: "required",
            },
          ],
          transactionId: "MyFreeHours:" + bookingUrl,
          allowNewTimeProposals: false,
          isOnlineMeeting: isOnline,
        }),
        headers: {
          "Content-type": "application/json",
          "Authorization": userData.ms_provider_token,
          "Prefer": 'outlook.timezone="UTC", IdType="ImmutableId"',
        },
        method: "POST",
      },
    );
    const meetingData: CalendarEvent = await newMeetingRes.json();

    if (!newMeetingRes.ok) {
      throw new Error("Unable to create meeting", {
        cause: 500,
      });
    }

    const { data: bookingData, error: bookingError } = await supabaseClient
      .from("booking").select("id").eq("url_id", bookingUrl).single();

    if (bookingError) {
      throw new Error("Unable to create meeting", {
        cause: 500,
      });
    }

    await supabaseClient.from("online_booking")
      .insert({
        url: (meetingData.onlineMeeting?.joinUrl) || null,
        ms_id: meetingData.id || "",
        booking_id: bookingData.id,
      });

    return new Response("Created event successfully", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: e.cause ? e.cause : 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});
