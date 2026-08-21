'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, MessageSquare, Home, LogOut, User as UserIcon } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  slug: string;
  avatar_url: string;
  initials?: string;
  roles?: { name: string }[];
}

export default function ProfileMenu() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // এক জায়গায় baseUrl
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.totthobox.com';

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // 401 / 403 হলে token মুছে ফেলুন
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } catch (error) {
        console.error('User data fetch error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [baseUrl]);

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch(`${baseUrl}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      } catch (e) {
        // ignore network error
      }
    }

    localStorage.removeItem('auth_token');
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return <div className="h-10 w-10 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-full"></div>;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 text-sm px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all shadow-sm hover:shadow-md"
      >
        <UserIcon size={16} />
        লগইন
      </Link>
    );
  }

  const isAdmin = user.roles?.some(role => ['Admin', 'Super Admin'].includes(role.name));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center focus:outline-none ring-2 ring-transparent focus:ring-emerald-500 rounded-full transition-all hover:ring-slate-300 dark:hover:ring-slate-700"
      >
        <img
          src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800"
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-400/25 py-2 animate-in fade-in slide-in-from-top-2 z-50">
          <div className="px-4 py-3 flex items-center gap-3">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover border border-zinc-400/25"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {user.name}
              </span>
              <span className="truncate text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user.email}
              </span>
            </div>
          </div>

          <div className="h-px bg-zinc-400/25 my-1"></div>

          <div className="px-2 space-y-1 mt-2">
            <Link
              href="/profile/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings size={18} className="text-slate-400" />
              Settings
            </Link>

            <Link
              href={`/messages/${user.slug}`}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <MessageSquare size={18} className="text-slate-400" />
              Messages
            </Link>
          </div>          

          <div className="h-px bg-zinc-400/25 my-2"></div>

          <div className="px-2 mb-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}