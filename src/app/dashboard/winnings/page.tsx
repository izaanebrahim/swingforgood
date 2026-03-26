'use client';

import { useState, useEffect } from 'react';
import { Trophy, Upload, CheckCircle2, Clock, Banknote } from 'lucide-react';

interface WinnerEntry {
  id: string;
  match_type: number;
  matched_numbers: number[];
  prize_amount: number;
  proof_url: string | null;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
  draw: { month: number; year: number; winning_numbers: number[] } | null;
}

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<WinnerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // In a production app, this would be a dedicated winners API endpoint
      // For now we'll show placeholder state
      setLoading(false);
    };
    fetchData();
  }, []);

  const statusConfig = {
    pending: { label: 'Pending Verification', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    approved: { label: 'Approved', icon: CheckCircle2, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    paid: { label: 'Paid Out', icon: Banknote, color: 'text-green-400', bg: 'bg-green-500/10' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-display font-bold text-white">Winnings</h2>
        <p className="text-sm text-dark-400">
          Your draw results, prizes, and payout status
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-display font-bold text-white">
            £{winnings.reduce((s, w) => s + w.prize_amount, 0).toFixed(2)}
          </div>
          <div className="text-xs text-dark-500">Total Winnings</div>
        </div>
        <div className="card text-center">
          <CheckCircle2 className="w-5 h-5 text-brand-400 mx-auto mb-2" />
          <div className="text-2xl font-display font-bold text-white">
            {winnings.filter((w) => w.status === 'paid').length}
          </div>
          <div className="text-xs text-dark-500">Paid Out</div>
        </div>
        <div className="card text-center">
          <Clock className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-display font-bold text-white">
            {winnings.filter((w) => w.status === 'pending').length}
          </div>
          <div className="text-xs text-dark-500">Pending</div>
        </div>
      </div>

      {/* Winnings list */}
      {winnings.length === 0 ? (
        <div className="card text-center py-16">
          <Trophy className="w-12 h-12 text-dark-700 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-dark-400 mb-2">
            No Winnings Yet
          </h3>
          <p className="text-sm text-dark-500 max-w-sm mx-auto">
            Keep your scores up to date and stay in the monthly draws. Winners are
            announced at the end of each month!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {winnings.map((w) => {
            const config = statusConfig[w.status];
            return (
              <div key={w.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center">
                    <span className="text-lg font-display font-bold text-amber-400">
                      {w.match_type}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {w.match_type}-Number Match
                    </div>
                    <div className="text-xs text-dark-500">
                      Matched: {w.matched_numbers.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-display font-bold text-brand-400">
                    £{w.prize_amount.toFixed(2)}
                  </div>
                  <div className={`inline-flex items-center gap-1 text-xs font-medium ${config.color} ${config.bg} px-2 py-0.5 rounded-full`}>
                    <config.icon className="w-3 h-3" />
                    {config.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload proof info */}
      {winnings.some((w) => w.status === 'pending') && (
        <div className="card border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <Upload className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Upload Proof</p>
              <p className="text-xs text-dark-400">
                For pending wins, please upload proof (scorecard screenshot) to verify your win.
                Admin will review and approve your payout.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
