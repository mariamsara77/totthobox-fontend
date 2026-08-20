import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('URL is required', { status: 400 });
  }

  try {
    // সার্ভার থেকে ছবিটি ফেচ করা হচ্ছে (এখানে কোনো CORS ইস্যু হবে না)
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const blob = await response.blob();
    
    // ফাইলের নাম বের করা
    const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg';

    // রেসপন্স হেডারে 'attachment' সেট করে দেওয়া, যাতে ব্রাউজার সরাসরি ডাউনলোড করে
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(blob, { status: 200, headers });
    
  } catch (error) {
    console.error('Download proxy error:', error);
    return new NextResponse('Error downloading image', { status: 500 });
  }
}