const PROVIDER_MAP: Record<string, string> = {
  "gmail.com": "https://mail.google.com/",
  "yahoo.com": "https://mail.yahoo.com/",
  "outlook.com": "https://outlook.live.com/",
  "hotmail.com": "https://outlook.live.com/",
  "live.com": "https://outlook.live.com/",
  "icloud.com": "https://www.icloud.com/mail",
};

export function getMailProviderUrl(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return PROVIDER_MAP[domain] ?? `mailto:${email}`;
}