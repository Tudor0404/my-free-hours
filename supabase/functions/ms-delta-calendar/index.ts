import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/database.types.ts";
import add_events from "../_shared/outlook/add_events.ts";

serve(async (req: Request) => {
  try {
    const { id } = await req.json();

    if (!id) {
      throw new Error("User ID not provided", { cause: 400 });
    }

    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData } = await supabaseClient
      .from("user")
      .select("ms_provider_token, delta_link")
      .eq("user_id", id)
      .single();

    if (!userData || !userData.ms_provider_token || !userData.delta_link) {
      throw new Error("Unable to fetch user's information", { cause: 500 });
    }

    const res = await fetch(userData.delta_link, {
      method: "GET",
      headers: {
        Authorization: userData.ms_provider_token || "",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        // invalid access token
        await supabaseClient.from("user").update({ ms_provider_token: null })
          .eq("user_id", id);
      } else {
        // invalid odata link, reset flow
        await supabaseClient.from("user").update({ delta_link: null }).eq(
          "user_id",
          id,
        );
      }

      throw new Error("Unable to access Microsoft Graph API");
    }

    const data = await res.json();

    if (
      !data.hasOwnProperty("value") || !data.hasOwnProperty("@odata.deltaLink")
    ) {
      throw new Error("Invalid response from Microsoft Graph API");
    }

    const toRemove: any = data["value"].filter((event: any) =>
      event.hasOwnProperty("@removed")
    );
    const toAdd = data["value"].filter((event: any) =>
      !event.hasOwnProperty("@removed")
    );

    let numAdded = 0;
    if (toAdd.length > 0) {
      numAdded = await add_events(supabaseClient, id, toAdd);
    }
    const { data: deleteData, error: deleteError } = await supabaseClient.from(
      "calendar_event",
    )
      .delete().in("id", toRemove.map((event: any) => event.id)).select(
        "booking_url",
      );

    if (numAdded === -1 || deleteError) {
      await supabaseClient.from("user").update({ delta_link: null }).eq(
        "user_id",
        id,
      );
      throw new Error("Unable to update events");
      // reset flow
    } else if (deleteData.length > 0) {
      await supabaseClient.from("booking").delete().in(
        "booking_url",
        deleteData.map((event: any) => event.booking_url),
      );
    }

    await supabaseClient.from("user").update({
      delta_link: data["@odata.deltaLink"],
    }).eq("user_id", id);

    return new Response(
      `${numAdded} events added, ${toRemove.length} events removed`,
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: e.cause ? e.cause : 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});
