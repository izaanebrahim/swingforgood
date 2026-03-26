'use client';

import { useState, useEffect } from 'react';
import { Trophy, Target, Heart, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  subscription_status: string;
  full_name: string;
  contribution_percentage: number;
  charity: { name: string } | null;
  scores: { score: number; date_played: string }[];
  winnings: { prize_amount: number; status: string; match_type: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, scoresRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/scores'),
        ]);
        const profile = await profileRes.json();
        const scores = await scoresRes.json();

        if (profile.success) {
          setData({
            ...profile.data,
            scores: scores.data || [],
            winnings: [], // Will be populated from API
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = data?.subscription_status === 'active';
  const totalWinnings = data?.winnings?.reduce((sum, w) => sum + w.prize_amount, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white">
          Welcome back, {data?.full_name?.split(' ')[0] || 'Golfer'} 👋
        </h2>
        <p className="text-dark-400 text-sm mt-1">
          Here&apos;s your SwingForGood overview
        </p>
      </div>

      {/* Subscription banner */}
      {!isActive && (
        <div className="card border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-white">Subscription Required</p>
                <p className="text-xs text-dark-400">Subscribe to enter scores and join draws</p>
              </div>
            </div>
            <Link href="/dashboard/settings" className="btn-primary text-xs px-4 py-2">
              Subscribe <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-dark-400 uppercase">Subscription</span>
            <CreditCard className="w-4 h-4 text-dark-500" />
          </div>
          <div className={`text-lg font-display font-bold ${isActive ? 'text-brand-400' : 'text-dark-500'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-dark-400 uppercase">Scores</span>
            <Target className="w-4 h-4 text-dark-500" />
          </div>
          <div className="text-lg font-display font-bold text-white">
            {data?.scores?.length || 0} / 5
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-dark-400 uppercase">Charity</span>
            <Heart className="w-4 h-4 text-dark-500" />
          </div>
          <div className="text-sm font-display font-bold text-white truncate">
            {data?.charity?.name || 'Not selected'}
          </div>
          <div className="text-xs text-dark-500">{data?.contribution_percentage}% contribution</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-dark-400 uppercase">Winnings</span>
            <Trophy className="w-4 h-4 text-dark-500" />
          </div>
          <div className="text-lg font-display font-bold text-brand-400">
            £{totalWinnings.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Scores preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-white">Recent Scores</h3>
          <Link href="/dashboard/scores" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Manage <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {data?.scores && data.scores.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {data.scores.map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-dark-800/50 border border-dark-700/50">
                <div className="text-2xl font-display font-bold text-white">{s.score}</div>
                <div className="text-xs text-dark-500 mt-1">
                  {new Date(s.date_played).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-dark-500 text-center py-8">
            No scores yet. {isActive ? 'Add your first score!' : 'Subscribe to start adding scores.'}
          </p>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/scores" className="card-hover group">
          <Target className="w-5 h-5 text-brand-400 mb-2" />
          <h4 className="font-display font-semibold text-white text-sm">Enter Scores</h4>
          <p className="text-xs text-dark-500">Add your latest Stableford scores</p>
        </Link>
        <Link href="/dashboard/charity" className="card-hover group">
          <Heart className="w-5 h-5 text-red-400 mb-2" />
          <h4 className="font-display font-semibold text-white text-sm">My Charity</h4>
          <p className="text-xs text-dark-500">View or change your selected charity</p>
        </Link>
        <Link href="/dashboard/winnings" className="card-hover group">
          <Trophy className="w-5 h-5 text-amber-400 mb-2" />
          <h4 className="font-display font-semibold text-white text-sm">Winnings</h4>
          <p className="text-xs text-dark-500">Check your prizes and draw history</p>
        </Link>
      </div>
    </div>
  );
}
