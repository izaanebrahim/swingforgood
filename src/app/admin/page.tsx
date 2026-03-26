'use client';

import { useState, useEffect } from 'react';
import { Users, Trophy, Heart, Banknote, TrendingUp } from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalPrizePool: 0,
    totalCharityContributions: 0,
    totalDraws: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from a dedicated admin stats endpoint
    setLoading(false);
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, color: 'text-blue-400', bg: 'from-blue-400/20 to-blue-600/20' },
    { label: 'Active Subscribers', value: stats.activeSubscribers.toString(), icon: TrendingUp, color: 'text-brand-400', bg: 'from-brand-400/20 to-brand-600/20' },
    { label: 'Total Prize Pool', value: `£${stats.totalPrizePool.toLocaleString()}`, icon: Trophy, color: 'text-amber-400', bg: 'from-amber-400/20 to-amber-600/20' },
    { label: 'Charity Contributions', value: `£${stats.totalCharityContributions.toLocaleString()}`, icon: Heart, color: 'text-red-400', bg: 'from-red-400/20 to-red-600/20' },
    { label: 'Total Draws', value: stats.totalDraws.toString(), icon: Banknote, color: 'text-green-400', bg: 'from-green-400/20 to-green-600/20' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-white">Admin Overview</h2>
        <p className="text-sm text-dark-400">Platform analytics and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-dark-400 uppercase">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="card">
        <h3 className="font-display font-semibold text-white mb-4">Recent Activity</h3>
        <div className="text-sm text-dark-500 text-center py-8">
          Activity feed will populate as users interact with the platform.
        </div>
      </div>
    </div>
  );
}
