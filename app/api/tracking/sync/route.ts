// app/api/tracking/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activities = [] } = body;

    // Offline queue থেকে আসা activities সেভ করো
    // for (const act of activities) { ... }

    console.log('[Tracking Sync]', activities.length, 'items');

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}