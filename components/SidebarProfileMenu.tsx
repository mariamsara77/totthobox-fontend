'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, MessageSquare, LogOut, User as UserIcon } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  slug: string;
  avatar_url: string;
}

export default function SidebarProfileMenu({ collapsed }: { collapsed?: boolean }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://totthobox.com';

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
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } catch (error) {
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
      } catch (e) {}
    }
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return <div className="h-10 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={`flex items-center gap-3 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 ${collapsed ? 'justify-center' : ''}`}
      >
        <UserIcon size={18} />
        {!collapsed && <span>লগইন</span>}
      </Link>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 ${collapsed ? 'justify-center' : 'text-left'}`}
      >
        <img
          src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
        />
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-zinc-700 dark:text-zinc-200">{user.name}</span>
            <span className="truncate text-xs text-zinc-500">{user.email}</span>
          </div>
        )}
      </button>

      {isDropdownOpen && (
        <div className={`absolute bottom-full mb-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 ${collapsed ? 'left-14' : 'left-0'}`}>
          <div className="px-2 space-y-1">
            <Link
              href="/profile/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings size={18} className="text-zinc-400" />
              Settings
            </Link>
            <Link
              href={`/messages/${user.slug}`}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <MessageSquare size={18} className="text-zinc-400" />
              Messages
            </Link>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2"></div>
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