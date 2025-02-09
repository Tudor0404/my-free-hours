import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../_shared/database.types.ts";

serve(async (req: Request) => {
  try {
    const {
      id,
      event_id,
    } = await req.json();

    if (
      !id || !event_id
    ) {
      throw new Error("Invalid paramters", { cause: 400 });
    }

    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const refreshRes = await supabaseClient.functions.invoke(
      "ms-refresh-token",
      {
        body: {
          id: id,
        },
      },
    );

    if (refreshRes.error) {
      throw new Error("Unable to refresh token", { cause: 500 });
    }

    const { data: userData } = await supabaseClient
      .from("user")
      .select("ms_provider_token")
      .eq("user_id", id)
      .single();

    if (!userData || !userData.ms_provider_token) {
      throw new Error("Unable to fetch user's information", { cause: 500 });
    }

    const deleteRes = await fetch(
      "https://graph.microsoft.com/v1.0/me/events/" + event_id,
      {
        headers: {
          "Authorization": userData.ms_provider_token,
        },
        method: "DELETE",
      },
    );

    if (!deleteRes.ok) {
      return new Response(JSON.stringify("successfully deleted event"), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(JSON.stringify("unsuccessfully deleted event"), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: e.cause ? e.cause : 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});
