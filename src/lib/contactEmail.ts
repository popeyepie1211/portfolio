const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_SITE_NAME = "Arya Shewale Portfolio";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  website: string;
}

export interface ContactEmailConfig {
  apiKey: string;
  from: string;
  ownerEmail: string;
  siteName?: string;
}

interface EmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string;
}

interface ValidationSuccess {
  ok: true;
  submission: ContactSubmission;
}

interface ValidationFailure {
  ok: false;
  message: string;
}

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

function normalizeField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMessageHtml(message: string): string {
  return escapeHtml(message).replace(/\n/g, "<br />");
}

function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export function validateContactSubmission(value: unknown): ValidationSuccess | ValidationFailure {
  const payload = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const submission: ContactSubmission = {
    name: normalizeField(payload.name),
    email: normalizeField(payload.email),
    message: normalizeField(payload.message),
    website: normalizeField(payload.website),
  };

  if (submission.website) {
    return { ok: true, submission };
  }

  if (!submission.name) {
    return { ok: false, message: "Please add your name before sending the message." };
  }

  if (!submission.email) {
    return { ok: false, message: "Please add your email address before sending the message." };
  }

  if (!isValidEmail(submission.email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  if (!submission.message) {
    return { ok: false, message: "Please add a message before sending the form." };
  }

  if (submission.name.length > MAX_NAME_LENGTH) {
    return { ok: false, message: "Your name is a little too long for this form." };
  }

  if (submission.email.length > MAX_EMAIL_LENGTH) {
    return { ok: false, message: "Your email address is a little too long for this form." };
  }

  if (submission.message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, message: "Your message is too long. Please shorten it and try again." };
  }

  return { ok: true, submission };
}

function buildShell(title: string, content: string): string {
  return `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;background:#07111f;color:#e5eefb;font-family:Inter,Arial,sans-serif;">
        <div style="padding:32px 20px;background:linear-gradient(135deg,#07111f 0%,#0d1830 100%);">
          <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);border-radius:24px;background:rgba(7,17,31,0.94);box-shadow:0 24px 80px rgba(0,0,0,0.35);overflow:hidden;">
            <div style="padding:28px 28px 20px;border-bottom:1px solid rgba(255,255,255,0.08);background:linear-gradient(135deg,rgba(139,92,246,0.14),rgba(34,211,238,0.1));">
              <p style="margin:0 0 8px;text-transform:uppercase;letter-spacing:0.18em;font-size:11px;color:#9fb0d0;">${escapeHtml(DEFAULT_SITE_NAME)}</p>
              <h1 style="margin:0;font-size:28px;line-height:1.15;color:#f8fbff;">${escapeHtml(title)}</h1>
            </div>
            <div style="padding:28px;color:#dce7f7;font-size:16px;line-height:1.7;">${content}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildOwnerEmail(submission: ContactSubmission, ownerEmail: string, from: string, siteName: string): EmailPayload {
  const messageHtml = formatMessageHtml(submission.message);

  return {
    from,
    to: [ownerEmail],
    subject: `${submission.name} reached out through ${siteName}`,
    reply_to: submission.email,
    html: buildShell(
      "New contact form submission",
      `
        <p style="margin:0 0 18px;">You received a new message from the contact form.</p>
        <div style="padding:18px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0 0 10px;"><strong style="color:#f8fbff;">Name:</strong> ${escapeHtml(submission.name)}</p>
          <p style="margin:0 0 10px;"><strong style="color:#f8fbff;">Email:</strong> <a href="mailto:${escapeHtml(submission.email)}" style="color:#8be9fd;text-decoration:none;">${escapeHtml(submission.email)}</a></p>
          <p style="margin:0;"><strong style="color:#f8fbff;">Message:</strong></p>
          <div style="margin-top:10px;padding:16px;border-radius:14px;background:rgba(7,17,31,0.75);border:1px solid rgba(255,255,255,0.06);white-space:normal;">${messageHtml}</div>
        </div>
        <p style="margin:20px 0 0;color:#9fb0d0;font-size:14px;">Reply directly to this message to continue the conversation with ${escapeHtml(submission.name)}.</p>
      `,
    ),
    text: [
      "New contact form submission",
      "",
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      "",
      "Message:",
      submission.message,
      "",
      "Reply directly to this message to continue the conversation.",
    ].join("\n"),
  };
}

function buildReplyEmail(submission: ContactSubmission, from: string, siteName: string): EmailPayload {
  return {
    from,
    to: [submission.email],
    subject: `Thanks for reaching out, ${submission.name}`,
    html: buildShell(
      `Thanks, ${escapeHtml(submission.name)}`,
      `
        <p style="margin:0 0 18px;">I’ve received your message through ${escapeHtml(siteName)} and I’ll get back to you soon.</p>
        <div style="padding:18px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0 0 12px;">Your note was:</p>
          <div style="padding:16px;border-radius:14px;background:rgba(7,17,31,0.75);border:1px solid rgba(255,255,255,0.06);">${formatMessageHtml(submission.message)}</div>
        </div>
        <p style="margin:20px 0 0;color:#9fb0d0;font-size:14px;">If you need to add anything before I reply, just respond to this email.</p>
      `,
    ),
    text: [
      `Thanks, ${submission.name}`,
      "",
      `I’ve received your message through ${siteName} and I’ll get back to you soon.`,
      "",
      "Your note was:",
      submission.message,
      "",
      "If you need to add anything before I reply, just respond to this email.",
    ].join("\n"),
  };
}

export async function sendResendEmail(apiKey: string, payload: EmailPayload): Promise<void> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return;
  }

  const errorBody = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;
  const message = errorBody?.message ?? errorBody?.error ?? `Resend returned status ${response.status}`;
  throw new Error(message);
}

export async function sendContactEmails(config: ContactEmailConfig, submission: ContactSubmission): Promise<void> {
  const siteName = config.siteName ?? DEFAULT_SITE_NAME;
  await sendResendEmail(
    config.apiKey,
    buildOwnerEmail(submission, config.ownerEmail, config.from, siteName),
  );
  await sendResendEmail(config.apiKey, buildReplyEmail(submission, config.from, siteName));
}

export async function sendOwnerNotification(
  config: ContactEmailConfig,
  submission: ContactSubmission,
): Promise<void> {
  const siteName = config.siteName ?? DEFAULT_SITE_NAME;
  await sendResendEmail(
    config.apiKey,
    buildOwnerEmail(submission, config.ownerEmail, config.from, siteName),
  );
}

export async function sendThankYouReply(
  config: ContactEmailConfig,
  submission: ContactSubmission,
): Promise<void> {
  const siteName = config.siteName ?? DEFAULT_SITE_NAME;
  await sendResendEmail(config.apiKey, buildReplyEmail(submission, config.from, siteName));
}