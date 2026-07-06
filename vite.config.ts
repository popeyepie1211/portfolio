import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import { portfolio } from "./src/data/portfolio.js";
import {
  sendOwnerNotification,
  sendThankYouReply,
  validateContactSubmission,
} from "./src/lib/contactEmail.js";

function readRequestBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    request.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    request.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

async function handleContactRoute(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
  const resendApiKey = env.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const resendFromEmail = env.RESEND_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "Arya Shewale <onboarding@resend.dev>";

  if (!resendApiKey) {
    response.statusCode = 500;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ ok: false, message: "Email service is not configured." }));
    return;
  }

  let payload: unknown;

  try {
    payload = JSON.parse(await readRequestBody(request));
  } catch {
    response.statusCode = 400;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ ok: false, message: "Invalid request body." }));
    return;
  }

  const validation = validateContactSubmission(payload);

  if (!validation.ok) {
    response.statusCode = 400;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ ok: false, message: validation.message }));
    return;
  }

  if (validation.submission.website) {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ ok: true, message: "Thanks! Your message was received." }));
    return;
  }

  try {
    await sendOwnerNotification(
      {
        apiKey: resendApiKey,
        from: resendFromEmail,
        ownerEmail: portfolio.contact.email,
        siteName: portfolio.name,
      },
      validation.submission,
    );

    let thankYouMessage = "Message sent successfully.";

    try {
      await sendThankYouReply(
        {
          apiKey: resendApiKey,
          from: resendFromEmail,
          ownerEmail: portfolio.contact.email,
          siteName: portfolio.name,
        },
        validation.submission,
      );

      thankYouMessage = "Message sent successfully. A confirmation email has also been sent to you.";
    } catch (error) {
      console.warn("Contact form thank-you email failed:", error);
      thankYouMessage =
        "Message sent successfully, but the confirmation email could not be delivered right now.";
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({ ok: true, message: thankYouMessage }),
    );
  } catch (error) {
    console.error("Contact form email failed:", error);
    response.statusCode = 502;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({ ok: false, message: "I could not send your message right now. Please try again in a moment." }),
    );
  }
}

function contactFormDevPlugin(): Plugin {
  return {
    name: "contact-form-dev",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.method !== "POST" || request.url !== "/api/contact") {
          next();
          return;
        }

        await handleContactRoute(request, response);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contactFormDevPlugin()],
});
