import { NextRequest, NextResponse } from "next/server";

type TrackingActivity = {
  type: string;
  key: string;
  value: unknown;
  timestamp: number;
  id: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeActivities(value: unknown): TrackingActivity[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is TrackingActivity => {
    if (!isRecord(item)) return false;

    return (
      typeof item.type === "string" &&
      typeof item.key === "string" &&
      typeof item.timestamp === "number" &&
      (typeof item.id === "string" || item.id === null)
    );
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        { status: "error", message: "Invalid sync payload." },
        { status: 400 },
      );
    }

    const directActivities = normalizeActivities(body.activities);
    const nestedPayload = isRecord(body.payload) ? body.payload : null;
    const nestedActivities = normalizeActivities(nestedPayload?.activities);
    const activities = directActivities.length
      ? directActivities
      : nestedActivities;

    if (!activities.length) {
      return NextResponse.json(
        { status: "success", synced: 0 },
        { status: 202 },
      );
    }

    // Persistence belongs to the configured analytics/backend service.
    return NextResponse.json(
      { status: "success", synced: activities.length },
      { status: 202 },
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "Unable to process tracking sync." },
      { status: 400 },
    );
  }
}
