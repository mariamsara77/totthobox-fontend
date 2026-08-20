export async function GET() {
  try {
    const res = await fetch('https://totthobox.com/sitemap.xml', {
      next: { revalidate: 3600 }, // ১ ঘণ্টার জন্য ক্যাশ থাকবে
    });

    if (!res.ok) {
      return new Response('Sitemap not found', { status: 404 });
    }

    const xml = await res.text();

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    return new Response('Error loading sitemap', { status: 500 });
  }
}