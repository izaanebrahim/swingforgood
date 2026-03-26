'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Zap, LayoutDashboard, Users, Trophy, Heart,
  Settings, ArrowLeft, Menu, X, ChevronRight, BarChart3
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const adminItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Draws', href: '/admin/draws', icon: Trophy },
  { name: 'Charities', href: '/admin/charities', icon: Heart },
  { name: 'Winners', href: '/admin/winners', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const res = await fetch('/api/user/profile');
      const json = await res.json();
      if (json.success && json.data.role === 'admin') {
        setAuthorized(true);
      } else {
        router.push('/dashboard');
      }
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">Admin Panel</span>
          </div>
          <button className="lg:hidden text-dark-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {adminItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-800">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-dark-800 flex items-center px-4 lg:px-8 bg-dark-950/80 backdrop-blur-xl sticky top-0 z-30">
          <button className="lg:hidden text-dark-400 hover:text-white mr-4" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-semibold text-white">
            {adminItems.find((i) => i.href === pathname)?.name || 'Admin'}
          </h1>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
