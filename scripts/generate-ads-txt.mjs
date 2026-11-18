import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_CLIENT_ID = "ca-pub-9522604367420521";
const rawClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const clientId = rawClientId !== undefined ? rawClientId.trim() : DEFAULT_CLIENT_ID;

const adsenseDisabled =
  process.env.ADSENSE_ENABLED === "false" ||
  process.env.ADSENSE_CMP_READY === "false";

const match = !adsenseDisabled && clientId ? clientId.match(/^ca-pub-(\d{16})$/) : null;

const lines = ["# Totthobox Google AdSense seller information"];

if (match) {
  lines.push("google.com, pub-" + match[1] + ", DIRECT, f08c47fec0942fa0");
} else {
  lines.push(
    "# AdSense seller entry is omitted unless ADSENSE_ENABLED, ADSENSE_CMP_READY and a valid NEXT_PUBLIC_ADSENSE_CLIENT are configured.",
  );
}

const outputPath = resolve(
  process.argv[2] ?? fileURLToPath(new URL("../public/ads.txt", import.meta.url)),
);
await writeFile(outputPath, lines.join("\n") + "\n", "utf8");
