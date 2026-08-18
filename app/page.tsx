import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-zinc-950 dark:text-gray-100 font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight">
              Tottho<span className="text-gray-900 dark:text-white">box</span>
            </span>
          </div>

          <nav className="hidden md:flex space-x-6 font-medium text-sm">
            <a href="#" className="hover:text-emerald-600 transition-colors">
              হোম
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              সকল তথ্য
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              সেবা সমূহ
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              আমাদের সম্পর্কে
            </a>
          </nav>

          <div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
              যোগাযোগ
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <section className="bg-emerald-600 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            প্রয়োজনীয় সব তথ্য ও সেবা এক জায়গায়
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg">
            আপনার প্রয়োজনীয় যেকোনো সেবার তথ্য অনুসন্ধান করুন সহজেই।
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="কী খুঁজছেন? (যেমন: হাসপাতাল, সার্ভিস...)"
              className="w-full px-4 py-3 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-emerald-300 shadow-inner"
            />
            <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              খুঁজুন
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold border-l-4 border-emerald-600 pl-3">
            সর্বশেষ আপডেট ও সেবাসমূহ
          </h2>
          <a
            href="#"
            className="text-emerald-600 font-semibold hover:underline text-sm"
          >
            সব দেখুন &rarr;
          </a>
        </div>

        {/* Feature / Content Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-emerald-50 dark:bg-zinc-800 rounded-xl mb-4 flex items-center justify-center text-emerald-600 font-bold">
                কন্টেন্ট প্রিভিউ {item}
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                ক্যাটাগরি
              </span>
              <h3 className="text-xl font-bold mt-1 mb-2">
                সেবা বা তথ্যের শিরোনাম এখানে আসবে
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                এখানে আপনার তথ্যবাক্স সাইটের সার্ভিস বা পোস্টের সংক্ষিপ্ত বিবরণ
                থাকবে।
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 py-8 mt-12 text-center text-sm text-gray-500">
        <p>© 2026 Totthobox. সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
