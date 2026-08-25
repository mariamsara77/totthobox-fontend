"use client";

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white text-zinc-900">
      <section className="w-full max-w-md rounded-3xl border border-zinc-200 p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-2xl">
          📡
        </div>
        <h1 className="text-2xl font-bold">আপনি অফলাইনে আছেন</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          ইন্টারনেট সংযোগ ফিরে এলে আবার চেষ্টা করুন। আগে খোলা Totthobox পেজগুলো
          ক্যাশ থেকে ব্যবহার করা যেতে পারে।
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          আবার চেষ্টা করুন
        </button>
      </section>
    </main>
  );
}
