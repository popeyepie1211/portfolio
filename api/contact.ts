import {
  sendOwnerNotification,
  sendThankYouReply,
  validateContactSubmission,
} from "../src/lib/contactEmail.js";
type HeaderValue = number | string | readonly string[];

type ContactRequest = {
  method?: string;
  body?: unknown;
};

type ContactResponse = {
  statusCode: number;
  setHeader(name: string, value: HeaderValue): void;
  end(body?: string): void;
};

const serverEnv =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

const RESEND_API_KEY = serverEnv.RESEND_API_KEY;
const RESEND_FROM_EMAIL = serverEnv.RESEND_FROM_EMAIL ?? "Arya Shewale <onboarding@resend.dev>";
const OWNER_EMAIL = "aryashewale18@gmail.com";
const SITE_NAME = "Arya Shewale";

function sendJson(
  response: ContactResponse,
  statusCode: number,
  body: Record<string, unknown>,
): void {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
}

function parseBody(body: unknown): unknown {
  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body ?? {};
}

export default async function handler(request: ContactRequest, response: ContactResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { ok: false, message: "Method not allowed." });
  }

  if (!RESEND_API_KEY) {
    return sendJson(response, 500, { ok: false, message: "Email service is not configured." });
  }

  let body: unknown;

  try {
    body = parseBody(request.body);
  } catch {
    return sendJson(response, 400, { ok: false, message: "Invalid request body." });
  }

  const validation = validateContactSubmission(body);

  if (validation.ok === false) {
    return sendJson(response, 400, { ok: false, message: validation.message });
  }

  if (validation.submission.website) {
    return sendJson(response, 200, { ok: true, message: "Thanks! Your message was received." });
  }

  try {
    await sendOwnerNotification(
      {
        apiKey: RESEND_API_KEY,
        from: RESEND_FROM_EMAIL,
        ownerEmail: OWNER_EMAIL,
        siteName: SITE_NAME,
      },
      validation.submission,
    );

    let thankYouMessage = "Message sent successfully.";

    try {
      await sendThankYouReply(
        {
          apiKey: RESEND_API_KEY,
          from: RESEND_FROM_EMAIL,
          ownerEmail: OWNER_EMAIL,
          siteName: SITE_NAME,
        },
        validation.submission,
      );

      thankYouMessage = "Message sent successfully. A confirmation email has also been sent to you.";
    } catch (error) {
      console.warn("Contact form thank-you email failed:", error);
      thankYouMessage =
        "Message sent successfully, but the confirmation email could not be delivered right now.";
    }

    return sendJson(response, 200, {
      ok: true,
      message: thankYouMessage,
    });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return sendJson(response, 502, {
      ok: false,
      message: "I could not send your message right now. Please try again in a moment.",
    });
  }
}
