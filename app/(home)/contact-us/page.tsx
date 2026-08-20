'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  FaceAngryIcon, 
  X, 
  Send, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Clock,
  Navigation
} from 'lucide-react';

// Mock Data for Admins
const mockAdmins = [
  {
    id: 1,
    name: 'Admin One',
    role: 'Support Team',
    slug: 'admin-one',
    isOnline: true,
    avatar: 'https://ui-avatars.com/api/?name=Admin+One&background=random'
  },
  {
    id: 2,
    name: 'Admin Two',
    role: 'Technical Support',
    slug: 'admin-two',
    isOnline: false,
    avatar: 'https://ui-avatars.com/api/?name=Admin+Two&background=random'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে ভবিষ্যতে API কল বসবে
    console.log('Form Submitted:', formData);
    setSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          যোগাযোগ করুন
        </h1>
        <p className="max-w-xl mx-auto text-base text-zinc-500 dark:text-zinc-400 text-balance">
          আপনার যেকোনো প্রশ্ন, মতামত বা সাহায্যের জন্য আমরা সবসময় প্রস্তুত। নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-lg transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">ফোন সাপোর্ট</h3>
                <p className="text-sm text-zinc-500">সরাসরি কথা বলুন</p>
              </div>
              <a href="tel:+8801340792677" className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                <Phone className="w-4 h-4" />
                +880 1340-792677
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-lg transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">WhatsApp চ্যাট</h3>
                <p className="text-sm text-zinc-500">দ্রুত উত্তর পান</p>
              </div>
              <a href="https://wa.me/8801340792677" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                <MessageCircle className="w-4 h-4" />
                চ্যাট শুরু করুন
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">মেসেজ পাঠান</h2>
            <p className="text-zinc-500 text-sm">ফর্ম পূরণ করে সরাসরি আমাদের ইনবক্সে মেসেজ পাঠান</p>
          </div>

          {sent ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-900/50">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই উত্তর দিব।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">আপনার নাম</label>
                  <input required type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="সম্পূর্ণ নাম লিখুন" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">ইমেইল</label>
                  <input required type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">বিষয়</label>
                <input required type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="মেসেজের বিষয় লিখুন" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">আপনার মেসেজ</label>
                <textarea required id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} placeholder="বিস্তারিত লিখুন..." className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-y"></textarea>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center justify-center gap-2 w-full sm:w-auto py-2 px-6 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                  <Navigation className="w-4 h-4" />
                  মেসেজ পাঠান
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Social Media */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">আমাদের সাথে যুক্ত থাকুন</h2>
          <p className="text-zinc-500 text-sm">সর্বশেষ আপডেট পেতে ফলো করুন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Facebook */}
          <a href="https://facebook.com/totthobox" target="_blank" rel="noopener noreferrer" className="group block">
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-blue-500/20">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl text-blue-600 bg-blue-50 dark:bg-blue-950/40 group-hover:scale-105 transition-transform">
                  <FaceAngryIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Facebook</h3>
                  <p className="text-sm text-zinc-500 truncate">Totthobox পেজ ফলো করুন</p>
                </div>
                <Navigation className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </a>

          {/* X (Twitter) */}
          <a href="https://x.com/totthobox" target="_blank" rel="noopener noreferrer" className="group block">
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-zinc-500/20">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white group-hover:scale-105 transition-transform">
                  <X className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">X (Twitter)</h3>
                  <p className="text-sm text-zinc-500 truncate">আপডেট ও খবর পান</p>
                </div>
                <Navigation className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          </a>

          {/* Telegram */}
          <a href="https://t.me/totthobox" target="_blank" rel="noopener noreferrer" className="group block">
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-sky-500/20">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Telegram</h3>
                  <p className="text-sm text-zinc-500 truncate">চ্যানেল জয়েন করুন</p>
                </div>
                <Navigation className="w-4 h-4 text-zinc-400 group-hover:text-sky-500 transition-colors" />
              </div>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:admin@totthobox.com" className="group block">
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-rose-500/20">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Email</h3>
                  <p className="text-sm text-zinc-500 truncate">admin@totthobox.com</p>
                </div>
                <Navigation className="w-4 h-4 text-zinc-400 group-hover:text-rose-500 transition-colors" />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Office Address */}
      <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl text-orange-600 bg-orange-50 dark:bg-orange-950/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">আমাদের ঠিকানা</h3>
              <p className="text-sm text-zinc-500">মিরপুর ডিওএইচএস, এভিনিউ-৩, ঢাকা ১২১৬</p>
            </div>
          </div>
          <a href="https://maps.google.com/?q=মিরপুর+ডিওএইচএস+এভিনিউ-৩+ঢাকা" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            ম্যাপে দেখুন
            <Navigation className="w-4 h-4" />
          </a>
        </div>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Direct Message to Admins */}
      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">সরাসরি মেসেজ পাঠান</h2>
          <p className="text-zinc-500 text-sm">আমাদের সাপোর্ট টিমের সাথে সরাসরি কথা বলুন</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockAdmins.length > 0 ? (
            mockAdmins.map((admin) => (
              <Link key={admin.id} href={`/messages/${admin.slug}`} className="block group">
                <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${admin.isOnline ? 'bg-green-500' : 'bg-zinc-400'}`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {admin.name}
                      </h3>
                      <p className="text-xs text-zinc-500">{admin.role}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-zinc-400">এই মুহূর্তে কোনো সাপোর্ট মেম্বার উপলব্ধ নেই।</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Badge */}
      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-full">
          <Clock className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            ২৪/৭ সাপোর্ট উপলব্ধ
          </span>
        </div>
      </div>
    </div>
  );
}