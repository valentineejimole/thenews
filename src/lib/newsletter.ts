import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type NewsletterProvider =
  | "file"
  | "supabase"
  | "resend"
  | "mailchimp"
  | "convertkit"
  | "beehiiv";

type SubscribeResult =
  | { status: "invalid" }
  | { status: "duplicate" }
  | { status: "created" };

type SubscriberRecord = {
  email: string;
  createdAt: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getProvider(): NewsletterProvider {
  const provider =
    process.env.NEWSLETTER_PROVIDER?.toLowerCase() ??
    (isSupabaseConfigured() ? "supabase" : "file");

  switch (provider) {
    case "file":
    case "supabase":
    case "resend":
    case "mailchimp":
    case "convertkit":
    case "beehiiv":
      return provider;
    default:
      return "file";
  }
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(normalizeEmail(email));
}

function getSubscriberFilePath() {
  return path.join(process.cwd(), "data", "newsletter-subscribers.json");
}

async function ensureSubscriberFile() {
  const filePath = getSubscriberFilePath();
  const dirPath = path.dirname(filePath);

  await mkdir(dirPath, { recursive: true });

  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, "[]\n", "utf8");
  }

  return filePath;
}

async function readSubscribers() {
  const filePath = await ensureSubscriberFile();
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as SubscriberRecord[];

  return Array.isArray(parsed) ? parsed : [];
}

async function writeSubscribers(subscribers: SubscriberRecord[]) {
  const filePath = await ensureSubscriberFile();
  await writeFile(filePath, `${JSON.stringify(subscribers, null, 2)}\n`, "utf8");
}

async function subscribeWithFile(email: string): Promise<SubscribeResult> {
  const subscribers = await readSubscribers();
  const normalizedEmail = normalizeEmail(email);

  const exists = subscribers.some(
    (subscriber) => normalizeEmail(subscriber.email) === normalizedEmail,
  );

  if (exists) {
    return { status: "duplicate" as const };
  }

  subscribers.push({
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  });

  await writeSubscribers(subscribers);

  return { status: "created" as const };
}

async function subscribeWithExternalProvider(
  email: string,
  provider: NewsletterProvider,
): Promise<SubscribeResult> {
  switch (provider) {
    case "supabase":
      {
        const supabase = await createSupabaseServerClient();

        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        const { error } = await supabase
          .from("newsletter_subscribers")
          .insert({ email: normalizeEmail(email) });

        if (!error) {
          return { status: "created" as const };
        }

        if (error.code === "23505") {
          return { status: "duplicate" as const };
        }

        throw new Error(error.message);
      }
    case "resend":
      // Connect Resend Audiences here using:
      // - RESEND_API_KEY
      // - RESEND_AUDIENCE_ID
      break;
    case "mailchimp":
      // Connect Mailchimp here using:
      // - MAILCHIMP_API_KEY
      // - MAILCHIMP_AUDIENCE_ID
      // - MAILCHIMP_SERVER_PREFIX
      break;
    case "convertkit":
      // Connect ConvertKit here using:
      // - CONVERTKIT_API_KEY
      // - CONVERTKIT_FORM_ID
      break;
    case "beehiiv":
      // Connect Beehiiv here using:
      // - BEEHIIV_API_KEY
      // - BEEHIIV_PUBLICATION_ID
      break;
    default:
      break;
  }

  throw new Error(`Newsletter provider "${provider}" is not configured yet.`);
}

export async function subscribeToNewsletter(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
    return { status: "invalid" as const };
  }

  const provider = getProvider();

  if (provider === "file") {
    return subscribeWithFile(normalizedEmail);
  }

  return subscribeWithExternalProvider(normalizedEmail, provider);
}
