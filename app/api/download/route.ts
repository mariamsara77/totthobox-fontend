import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('URL is required', { status: 400 });
  }

  try {
    const target = new URL(url);
    const apiHost = new URL(
      process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.totthobox.com',
    ).hostname;
    const allowedHosts = new Set([apiHost, 'totthobox.com', 'www.totthobox.com']);

    if (target.protocol !== 'https:' || !allowedHosts.has(target.hostname)) {
      return new NextResponse('Unsupported download URL', { status: 400 });
    }

    const response = await fetch(target);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (!contentType.startsWith('image/')) {
      return new NextResponse('Only image downloads are supported', { status: 415 });
    }

    const blob = await response.blob();
    
    // ফাইলের নাম বের করা
    const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg';

    // রেসপন্স হেডারে 'attachment' সেট করে দেওয়া, যাতে ব্রাউজার সরাসরি ডাউনলোড করে
    const headers = new Headers();
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);

    return new NextResponse(blob, { status: 200, headers });
    
  } catch (error) {
    console.error('Download proxy error:', error);
    return new NextResponse('Error downloading image', { status: 500 });
  }
}