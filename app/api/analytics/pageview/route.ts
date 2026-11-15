import { NextRequest } from "next/server";
import { proxyPageView } from "@/lib/server/analytics-proxy";

export async function POST(req: NextRequest) {
  return proxyPageView(req);
}
