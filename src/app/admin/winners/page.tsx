'use client';

import { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Clock, Banknote, Eye, Check, X } from 'lucide-react';

interface WinnerItem {
  id: string;
  user: { full_name: string; email: string };
  match_type: number;
  matched_numbers: number[];
  prize_amount: number;
  proof_url: string | null;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  draw: { month: number; year: number };
}

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<WinnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // In production, this would fetch from /api/admin/winners
    setLoading(false);
  }, []);

  const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    approved: { label: 'Approved', icon: CheckCircle2, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
    paid: { label: 'Paid', icon: Banknote, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  };

  const filtered = filter === 'all' ? winners : winners.filter((w) => w.status === filter);

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
        <h2 className="text-xl font-display font-bold text-white">Winners Management</h2>
        <p className="text-sm text-dark-400">Verify proofs, approve and manage payouts</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'paid'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                : 'text-dark-400 hover:text-white bg-dark-800/50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Winners list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Trophy className="w-10 h-10 text-dark-700 mx-auto mb-3" />
          <p className="text-dark-400 font-medium">No winners to display</p>
          <p className="text-dark-500 text-sm">Winners will appear here after a draw is run</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((w) => {
            const config = statusConfig[w.status];
            return (
              <div key={w.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
                    <span className="text-lg font-display font-bold text-amber-400">{w.match_type}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{w.user?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-dark-500">{w.user?.email || ''}</div>
                    <div className="text-xs text-dark-500 mt-1">
                      Matched: {w.matched_numbers.join(', ')} •{' '}
                      {new Date(2000, (w.draw?.month || 1) - 1).toLocaleString('en', { month: 'long' })} {w.draw?.year}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-display font-bold text-brand-400">
                      £{w.prize_amount.toFixed(2)}
                    </div>
                    <div className={`inline-flex items-center gap-1 text-xs font-medium ${config.color} ${config.bg} px-2 py-0.5 rounded-full border`}>
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </div>
                  </div>
                  {w.status === 'pending' && (
                    <div className="flex gap-1">
                      {w.proof_url && (
                        <a href={w.proof_url} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700">
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <button className="p-2 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-brand-500/10">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {w.status === 'approved' && (
                    <button className="btn-primary text-xs px-3 py-1.5 gap-1">
                      <Banknote className="w-3 h-3" /> Mark Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
