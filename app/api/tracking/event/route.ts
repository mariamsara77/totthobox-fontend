// app/api/tracking/event/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      category = 'interaction',
      action = 'click',
      js_visitor_id,
      session_id,
      payload = {},
    } = body;

    // ============================================
    // এখানে তোমার DB লজিক লিখবে
    // উদাহরণ (Prisma):
    //
    // const visitor = await getOrCreateVisitor({
    //   jsVisitorId: js_visitor_id,
    //   ip: req.ip || req.headers.get('x-forwarded-for'),
    //   userAgent: req.headers.get('user-agent'),
    // });
    //
    // if (category === 'system') {
    //   await updateVisitorSpecs(visitor, payload);
    // }
    //
    // await prisma.trackingEvent.create({
    //   data: {
    //     visitorId: visitor.id,
    //     category,
    //     action,
    //     label: payload.label || null,
    //     payload,
    //     sessionId: session_id,
    //   },
    // });
    // ============================================

    console.log('[Tracking Event]', { category, action, js_visitor_id, payload });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Tracking Error:', error);
    // সবসময় 200 দাও যাতে ক্লায়েন্ট রিট্রাই না করে
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}