import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { renderToStaticMarkup } from "npm:@usewaypoint/email-builder";
import {
  newMeetingGuest,
  newMeetingGuestInformation,
} from "../_shared/email_templates/new_meeting_guest.ts";
import { newMeetingHost } from "../_shared/email_templates/new_meeting_host.ts";
import { deleteMeetingHost } from "../_shared/email_templates/delete_meeting_host.ts";
import { deleteMeetingGuest } from "../_shared/email_templates/delete_meeting_guest.ts";
import {
  preMeetingGuest,
  preMeetingGuestWithNotification,
} from "../_shared/email_templates/pre_meeting_guest.ts";
import { preMeetingHost } from "../_shared/email_templates/pre_meeting_host.ts";
import { postMeetingGuest } from "../_shared/email_templates/post_meeting_guest.ts";
import { Liquid } from "npm:liquidjs";
import dayjs from "npm:dayjs";
import { Resend } from "npm:resend";

const newMeetingSchema = {
  host_name: true,
  host_email: true,
  guest_name: true,
  guest_email: true,
  created_at: true,
  meeting_type: true,
  start_time: true,
  end_time: true,
  duration: true,
  type_description: true,
  url_id: true,
};

const preMeetingGuestSchema = {
  host_name: true,
  host_email: true,
  guest_name: true,
  guest_email: true,
  created_at: true,
  meeting_type: true,
  start_time: true,
  end_time: true,
  duration: true,
  type_description: true,
  url_id: true,
  pre_meeting_notif: true,
};

const preMeetingHostSchema = {
  host_name: true,
  host_email: true,
  guest_name: true,
  guest_email: true,
  created_at: true,
  meeting_type: true,
  start_time: true,
  end_time: true,
  duration: true,
  type_description: true,
  url_id: true,
};

const postMeetingSchema = {
  host_name: true,
  host_email: true,
  guest_name: true,
  guest_email: true,
  created_at: true,
  meeting_type: true,
  start_time: true,
  end_time: true,
  duration: true,
  online_url: true,
  type_description: true,
  url_id: true,
  post_meeting_notif: true,
};

const deleteMeetingSchema = {
  host_name: true,
  guest_name: true,
  guest_email: true,
  host_email: true,
  meeting_type: true,
  start_time: true,
  end_time: true,
  duration: true,
};

function isValid(obj: any, schema: any) {
  return [...Object.keys(schema)].every((k) => k in obj);
}

serve(async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const engine = new Liquid();
    const resend = new Resend(Deno.env.get("RESEND"));

    const { data } = await supabaseClient.schema("pgmq_public").rpc("read", {
      queue_name: "email",
      sleep_seconds: 0,
      n: 50,
    });

    if (data.error) {
      return new Response(
        `Unable to retrieve item in email queue, sent 0 emails in total.`,
        {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        },
      );
    }

    let successCounter = 0;
    let errorCounter = 0;

    for (let i = 0; i < data.length; i++) {
      const message = data[i];
      const messageID = message["msg_id"];
      const messageData = message["message"]["data"];
      const messageType = message["message"]["type"];

      // compose email

      let guestEmail: string = "";
      let hostEmail: string = "";

      let deleteMessage = true;

      try {
        switch (messageType) {
          case "new_meeting": {
            if (!isValid(messageData, newMeetingSchema)) {
              throw new Error("Invalid data recieved");
            }

            hostEmail = renderToStaticMarkup(newMeetingHost, {
              rootBlockId: "root",
            });

            hostEmail = await engine.parseAndRender(hostEmail, {
              host_name: messageData["host_name"],
              guest_name: messageData["guest_name"],
              date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
              meeting_type: messageData["online_url"] === null
                ? "in person"
                : "online",
              start_time: dayjs(messageData["start_time"]).format(
                "DD/MM/YYYY, h:mm a",
              ),
              end_time: dayjs(messageData["end_time"]).format(
                "DD/MM/YYYY, h:mm a",
              ),
              duration: messageData["duration"] + " minutes",
              online_url: messageData["online_url"] || "-",
              dashboard_url: Deno.env.get("WEBSITE_URL") + "dashboard",
              guest_email: messageData["guest_email"] || "not given",
              meeting_url: Deno.env.get("WEBSITE_URL") + "booking/" +
                messageData["url_id"],
            });

            const { error: emailErrorHost } = await resend.emails.send({
              from: "MyFreeHours <no-reply@myfreehours.app>",
              to: [messageData["host_email"]],
              subject: "New Booking with " + messageData["guest_name"],
              html: hostEmail,
            });

            if (emailErrorHost) {
              deleteMessage = false;
            }

            if (messageData["guest_email"]) {
              if (messageData["pre_meeting_message"] === "") {
                guestEmail = renderToStaticMarkup(newMeetingGuest, {
                  rootBlockId: "root",
                });

                guestEmail = await engine.parseAndRender(guestEmail, {
                  host_name: messageData["host_name"],
                  guest_name: messageData["guest_name"],
                  date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
                  meeting_type: messageData["online_url"] === null
                    ? "in person"
                    : "online",
                  start_time: dayjs(messageData["start_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                  end_time: dayjs(messageData["end_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                  duration: messageData["duration"] + " minutes",
                  online_url: messageData["online_url"] || "-",
                  meeting_url: Deno.env.get("WEBSITE_URL") + "booking/" +
                    messageData["url_id"],
                });
              } else {
                guestEmail = renderToStaticMarkup(newMeetingGuestInformation, {
                  rootBlockId: "root",
                });

                guestEmail = await engine.parseAndRender(guestEmail, {
                  host_name: messageData["host_name"],
                  guest_name: messageData["guest_name"],
                  date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
                  meeting_type: messageData["online_url"] === null
                    ? "in person"
                    : "online",
                  start_time: dayjs(messageData["start_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                  end_time: dayjs(messageData["end_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                  duration: messageData["duration"] + " minutes",
                  online_url: messageData["online_url"] || "-",
                  meeting_url: Deno.env.get("WEBSITE_URL") + "booking/" +
                    messageData["url_id"],
                  meeting_information: messageData["type_description"],
                });
              }

              const { error: emailErrorGuest } = await resend.emails.send({
                from: "MyFreeHours <no-reply@myfreehours.app>",
                to: [messageData["guest_email"]],
                subject: "Booking Confirmation with " +
                  messageData["host_name"],
                html: guestEmail,
              });

              if (emailErrorGuest) {
                deleteMessage = false;
              }
            }

            break;
          }
          case "delete_meeting": {
            if (!isValid(messageData, deleteMeetingSchema)) {
              throw new Error("Invalid data recieved");
            }

            hostEmail = renderToStaticMarkup(deleteMeetingHost, {
              rootBlockId: "root",
            });

            hostEmail = await engine.parseAndRender(hostEmail, {
              host_name: messageData["host_name"],
              guest_name: messageData["guest_name"],
              date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
              meeting_type: messageData["online_url"] === null
                ? "in person"
                : "online",
              start_time: dayjs(messageData["start_time"]).format(
                "DD/MM/YYYY, h:mm a",
              ),
              end_time: dayjs(messageData["end_time"]).format(
                "DD/MM/YYYY, h:mm a",
              ),
              duration: messageData["duration"] + " minutes",
              dashboard_url: Deno.env.get("WEBSITE_URL") + "dashboard",
              guest_email: messageData["guest_email"] || "not given",
            });

            const { error: emailErrorHost } = await resend.emails.send({
              from: "MyFreeHours <no-reply@myfreehours.app>",
              to: [messageData["host_email"]],
              subject: "Booking with " + messageData["guest_name"] +
                " Cancelled",
              html: hostEmail,
            });

            if (emailErrorHost) {
              deleteMessage = false;
            }

            if (messageData["guest_email"]) {
              guestEmail = renderToStaticMarkup(deleteMeetingGuest, {
                rootBlockId: "root",
              });

              guestEmail = await engine.parseAndRender(guestEmail, {
                host_name: messageData["host_name"],
                guest_name: messageData["guest_name"],
                date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
                meeting_type: messageData["online_url"] === null
                  ? "in person"
                  : "online",
                start_time: dayjs(messageData["start_time"]).format(
                  "DD/MM/YYYY, h:mm a",
                ),
                end_time: dayjs(messageData["end_time"]).format(
                  "DD/MM/YYYY, h:mm a",
                ),
                duration: messageData["duration"] + " minutes",
              });

              const { error: emailErrorGuest } = await resend.emails.send({
                from: "MyFreeHours <no-reply@myfreehours.app>",
                to: [messageData["guest_email"]],
                subject: "Booking with " + messageData["host_name"] +
                  " Cancelled",
                html: guestEmail,
              });

              if (emailErrorGuest) {
                deleteMessage = false;
              }
            }

            break;
          }
          case "pre_meeting_guest": {
            if (!isValid(messageData, preMeetingGuestSchema)) {
              throw new Error("Invalid data recieved");
            }

            if (messageData["guest_email"]) {
              if (messageData["pre_meeting_notif"] === "") {
                guestEmail = renderToStaticMarkup(preMeetingGuest, {
                  rootBlockId: "root",
                });

                guestEmail = await engine.parseAndRender(guestEmail, {
                  host_name: messageData["host_name"],
                  guest_name: messageData["guest_name"],
                  date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
                  meeting_type: messageData["online_url"] === null
                    ? "in person"
                    : "online",
                  start_time: dayjs(messageData["start_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                  end_time: dayjs(messageData["end_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                  duration: messageData["duration"] + " minutes",
                  online_url: messageData["online_url"] || "-",
                  meeting_url: Deno.env.get("WEBSITE_URL") + "booking/" +
                    messageData["url_id"],
                  date_time: dayjs(messageData["start_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                });
              } else {
                guestEmail = renderToStaticMarkup(
                  preMeetingGuestWithNotification,
                  {
                    rootBlockId: "root",
                  },
                );

                guestEmail = await engine.parseAndRender(guestEmail, {
                  host_name: messageData["host_name"],
                  guest_name: messageData["guest_name"],
                  date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
                  meeting_type: messageData["online_url"] === null
                    ? "in person"
                    : "online",
                  start_time: dayjs(messageData["start_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                  end_time: dayjs(messageData["end_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                  duration: messageData["duration"] + " minutes",
                  online_url: messageData["online_url"] || "-",
                  meeting_url: Deno.env.get("WEBSITE_URL") + "booking/" +
                    messageData["url_id"],
                  pre_meeting_notif: messageData["pre_meeting_notif"],
                  date_time: dayjs(messageData["start_time"]).format(
                    "DD/MM/YYYY, h:mm a",
                  ),
                });
              }

              const { error: emailErrorGuest } = await resend.emails.send({
                from: "MyFreeHours <no-reply@myfreehours.app>",
                to: [messageData["guest_email"]],
                subject: "Booking with " + messageData["host_name"] +
                  " Reminder",
                html: guestEmail,
              });

              if (emailErrorGuest) {
                deleteMessage = false;
              }
            }

            break;
          }
          case "pre_meeting_host": {
            if (!isValid(messageData, preMeetingHostSchema)) {
              throw new Error("Invalid data recieved");
            }

            hostEmail = renderToStaticMarkup(preMeetingHost, {
              rootBlockId: "root",
            });

            hostEmail = await engine.parseAndRender(hostEmail, {
              host_name: messageData["host_name"],
              guest_name: messageData["guest_name"],
              date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
              meeting_type: messageData["online_url"] === null
                ? "in person"
                : "online",
              start_time: dayjs(messageData["start_time"]).format(
                "DD/MM/YYYY, h:mm a",
              ),
              end_time: dayjs(messageData["end_time"]).format(
                "DD/MM/YYYY, h:mm a",
              ),
              duration: messageData["duration"] + " minutes",
              online_url: messageData["online_url"] || "-",
              dashboard_url: Deno.env.get("WEBSITE_URL") + "dashboard",
              guest_email: messageData["guest_email"] || "not given",
              meeting_url: Deno.env.get("WEBSITE_URL") + "booking/" +
                messageData["url_id"],
              date_time: dayjs(messageData["start_time"]).format(
                "DD/MM/YYYY, h:mm a",
              ),
            });

            const { error: emailErrorHost } = await resend.emails.send({
              from: "MyFreeHours <no-reply@myfreehours.app>",
              to: [messageData["host_email"]],
              subject: "Booking with " + messageData["guest_name"] +
                " Reminder",
              html: hostEmail,
            });

            if (emailErrorHost) {
              deleteMessage = false;
            }

            break;
          }
          case "post_meeting": {
            if (!isValid(messageData, postMeetingSchema)) {
              throw new Error("Invalid data recieved");
            }

            if (messageData["guest_email"]) {
              guestEmail = renderToStaticMarkup(postMeetingGuest, {
                rootBlockId: "root",
              });

              guestEmail = await engine.parseAndRender(guestEmail, {
                host_name: messageData["host_name"],
                guest_name: messageData["guest_name"],
                date: dayjs(messageData["start_time"]).format("D MMMM YYYY"),
                meeting_type: messageData["online_url"] === null
                  ? "in person"
                  : "online",
                start_time: dayjs(messageData["start_time"]).format(
                  "DD/MM/YYYY, h:mm a",
                ),
                end_time: dayjs(messageData["end_time"]).format(
                  "DD/MM/YYYY, h:mm a",
                ),
                duration: messageData["duration"] + " minutes",
                online_url: messageData["online_url"] || "-",
                meeting_url: Deno.env.get("WEBSITE_URL") + "booking/" +
                  messageData["url_id"],
                post_meeting_notif: messageData["post_meeting_notif"],
              });

              const { error: emailErrorGuest } = await resend.emails.send({
                from: "MyFreeHours <no-reply@myfreehours.app>",
                to: [messageData["guest_email"]],
                subject: "Post Meeting Message",
                html: guestEmail,
              });

              if (emailErrorGuest) {
                deleteMessage = false;
              }
            }

            break;
          }
          default:
            // do not throw error to delete message from queue
            break;
        }
      } catch (e) {
        if (e instanceof Error) {
          return new Response(e.message, { status: 500 });
        }
      }

      // delete email
      if (deleteMessage) {
        await supabaseClient.schema("pgmq_public").rpc("delete", {
          queue_name: "email",
          message_id: messageID,
        });

        successCounter++;
      } else {
        errorCounter++;
      }
    }

    return new Response(
      `Processed email queue, ${successCounter} successful emails sent, ${errorCounter} unsuccessful`,
    );
  } catch (e) {
    console.log(JSON.stringify(e));
    if (e instanceof Error) {
      return new Response(e.message, { status: 500 });
    }
    return new Response("An error has occurred", { status: 500 });
  }
});
