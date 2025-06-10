import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (context, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret)
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable!");

    const svixId = request.headers.get("svix-id");
    const svixSignature = request.headers.get("svix-signature");
    const svixTimestamp = request.headers.get("svix-timestamp");

    if (!svixId || !svixSignature || !svixTimestamp) {
      return new Response("Error occurred -- no svix headers", { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const webhook = new Webhook(webhookSecret);
    let event: any;

    try {
      event = webhook.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (error) {
      console.error(error);
      return new Response("Error occurred!", { status: 400 });
    }

    const eventType = event.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      const email = email_addresses[0].email_address;
      const fullname = `${first_name} ${last_name}`.trim();

      try {
        const payload = {
          email,
          fullname,
          image: image_url,
          clerkId: id,
          username: email.split("@")[0],
        };

        await context.runMutation(api.users.createUser, payload);
      } catch (error) {
        console.error(error);
        return new Response("Error creating user!", { status: 500 });
      }
    }
    return new Response("Webhook processed successfully!", { status: 200 });
  }),
});

export default http;
