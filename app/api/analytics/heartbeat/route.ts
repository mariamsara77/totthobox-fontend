import { NextRequest } from "next/server";
import { proxyHeartbeat } from "@/lib/server/analytics-proxy";

export async function POST(req: NextRequest) {
  return proxyHeartbeat(req);
}
