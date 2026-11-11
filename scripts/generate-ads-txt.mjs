import { writeFile } from "node:fs/promises";

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
const match = clientId.match(/^ca-pub-(\d{16})$/);

const lines = [
  "# Totthobox Google AdSense seller information",
];

if (match) {
  lines.push(`google.com, pub-${match[1]}, DIRECT, f08c47fec0942fa0`);
} else {
  lines.push("# Configure NEXT_PUBLIC_ADSENSE_CLIENT with the real ca-pub ID to generate the seller entry.");
}

await writeFile(new URL("../public/ads.txt", import.meta.url), `${lines.join("\n")}\n`, "utf8");
