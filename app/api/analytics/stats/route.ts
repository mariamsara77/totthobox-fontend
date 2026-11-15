import { proxyStats } from "@/lib/server/analytics-proxy";

export async function GET() {
  return proxyStats();
}
