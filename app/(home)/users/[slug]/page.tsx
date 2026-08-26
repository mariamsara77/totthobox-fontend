import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ContentItem {
    type_label: string;
    icon: string;
    title: string;
    description: string;
    created_at: string;
    url: string;
    thumbnail: string | null;
}

interface UserProfileData {
    profile: {
        id: number;
        name: string;
        slug: string;
        avatar: string;
        is_online: boolean;
        is_verified_admin: boolean;
        role_label: string;
        location: string | null;
        bio: string | null;
        education: string | null;
        class_level: string | null;
    };
    contents: ContentItem[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        has_more: boolean;
    };
}

async function getProfileData(slug: string): Promise<UserProfileData | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.totthobox.com'}/api/users/${slug}/profile`;
        console.log('Fetching:', url);           // ← URL দেখুন

        const res = await fetch(url, { cache: 'no-store' });
        console.log('Status:', res.status);      // ← status দেখুন

        if (!res.ok) {
            const text = await res.text();
            console.error('API Error body:', text);
            return null;
        }

        const json = await res.json();
        console.log('API Response:', JSON.stringify(json, null, 2));
        return json.success ? json.data : null;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export default async function UserProfilePage({ 
    params 
}: { 
    params: Promise<{ slug: string }> 
}) {
    const { slug } = await params;   // ← await করতে হবে
    const data = await getProfileData(slug);

    if (!data) {
        notFound();
    }

    const { profile, contents } = data;

    return (
        <main className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Profile Header */}
            <header className="overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative">
                        <div className="size-32 md:size-40 rounded-full overflow-hidden relative border border-zinc-200 dark:border-zinc-400/25 bg-zinc-100 bg-zinc-400/10 flex items-center justify-center text-4xl font-bold text-zinc-600 dark:text-zinc-300">
                            {profile.avatar ? (
                                <Image
                                    src={profile.avatar}
                                    alt={profile.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                profile.name.charAt(0)
                            )}
                            <span className={`absolute bottom-2 right-2 size-4 rounded-full border-2 border-white dark:border-zinc-400/25 ${profile.is_online ? 'bg-zinc-400/25' : 'bg-zinc-400'}`} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex items-center gap-4 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {profile.name}
                                </h1>
                                {profile.is_verified_admin && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-400/25 dark:bg-zinc-400/25 opacity-50 dark:opacity-50">
                                        ভেরিফাইড এডমিন
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                            {profile.location && (
                                <div className="flex items-center gap-2">
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.75c0-1.196-.904-2.17-2.112-2.25a41.642 41.642 0 0 0-11.076 0C4.904 6.58 4 7.554 4 8.75v3.739c0 .734.331 1.41.875 1.661m16.5 0h-16.5" /></svg>
                                <span>{profile.role_label}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link href={`/messages/${profile.slug}`} className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-sm font-medium bg-zinc-400/10 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition">
                                মেসেজ পাঠান
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* About & Contact */}
            <section className="mt-8 space-y-8">
                {profile.bio && (
                    <div>
                        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                            {profile.name} সম্পর্কে
                        </h2>
                        <div className="mt-2 leading-relaxed text-sm text-zinc-600 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: profile.bio }} />
                    </div>
                )}

                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-400/25 bg-zinc-50/50 bg-zinc-400/10 space-y-4">
                    <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">যোগাযোগের তথ্য</h2>
                    <div className="space-y-4">
                        {profile.location && (
                            <div>
                                <span className="block font-medium text-zinc-800 dark:text-zinc-200 text-sm">ঠিকানা</span>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile.location}</p>
                            </div>
                        )}
                        {profile.education && (
                            <div>
                                <span className="block font-medium text-zinc-800 dark:text-zinc-200 text-sm">শিক্ষা</span>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile.education}</p>
                                {profile.class_level && (
                                    <p className="text-xs text-zinc-500 mt-1">শ্রেণী: {profile.class_level}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <hr className="my-8 border-zinc-200 dark:border-zinc-400/25" />

            {/* Published Content */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-zinc-400/25 dark:bg-zinc-400/25 rounded-xl">
                        <svg className="size-6 opacity-50 dark:opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v9.75A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25V9a2.25 2.25 0 0 0-1.5-2.122M12 11.25v4.5m-2.25-2.25h4.5" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
                        প্রকাশিত কন্টেন্ট সমূহ
                    </h2>
                </div>

                <div className="space-y-6">
                    {contents.length > 0 ? (
                        contents.map((item, index) => (
                            <article key={index} className="p-4 rounded-2xl border border-zinc-400/10 bg-zinc-400/10 transition-all space-y-3.5">
                                <div className="flex gap-4 items-start">
                                    {item.thumbnail && (
                                        <div className="relative size-12 rounded-full overflow-hidden shrink-0 bg-zinc-200 bg-zinc-400/10">
                                            <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-400/25 dark:bg-zinc-400/25 opacity-50 dark:opacity-50">
                                                {item.type_label}
                                            </span>
                                            <time className="text-xs text-zinc-500 font-medium shrink-0">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </time>
                                        </div>

                                        <div className="space-y-1 mt-1">
                                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                                {item.title}
                                            </h3>
                                            <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                {item.description || 'কোনো সংক্ষিপ্ত বিবরণ দেওয়া নেই।'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between border-t border-zinc-400/25">
                                    <Link href={item.url} className="text-sm font-medium opacity-50 dark:opacity-50 hover:underline inline-flex items-center gap-1">
                                        বিস্তারিত দেখুন &rarr;
                                    </Link>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-400/25 rounded-2xl">
                            <h3 className="text-base font-medium text-zinc-500">কোনো তথ্য পাওয়া যায়নি</h3>
                            <p className="text-sm text-zinc-400 mt-1">এখনো কোনো কন্টেন্ট প্রকাশ করা হয়নি।</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}