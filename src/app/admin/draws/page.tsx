'use client';

import { useState } from 'react';
import { Trophy, Play, Eye, Send, Sparkles } from 'lucide-react';

interface DrawResult {
  simulation?: boolean;
  winning_numbers?: number[];
  total_prize_pool?: number;
  jackpot_amount?: number;
  match_4_amount?: number;
  match_3_amount?: number;
  potential_winners?: { user_id: string; match_type: number; matched: number[] }[];
  subscriber_count?: number;
  winners_count?: number;
  has_jackpot_winner?: boolean;
  draw?: Record<string, unknown>;
}

export default function AdminDrawsPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DrawResult | null>(null);
  const [error, setError] = useState('');

  const handleAction = async (action: 'simulate' | 'run' | 'publish') => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year, action }),
      });
      const json = await res.json();

      if (json.success) {
        setResult(json.data);
      } else {
        setError(json.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-display font-bold text-white">Draw Management</h2>
        <p className="text-sm text-dark-400">Configure, simulate, and run monthly prize draws</p>
      </div>

      {/* Month/Year selector */}
      <div className="card">
        <h3 className="font-display font-semibold text-white mb-4">Select Draw Period</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="input-field"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="input-field"
              min={2024}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAction('simulate')}
            disabled={loading}
            className="btn-secondary text-sm gap-1 disabled:opacity-50"
          >
            <Eye className="w-4 h-4" /> Simulate Draw
          </button>
          <button
            onClick={() => handleAction('run')}
            disabled={loading}
            className="btn-primary text-sm gap-1 disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> Run Draw
          </button>
          <button
            onClick={() => handleAction('publish')}
            disabled={loading}
            className="btn-accent text-sm gap-1 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Publish Results
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="card border-brand-500/30 bg-brand-500/5">
          <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            {result.simulation ? 'Simulation Results' : 'Draw Results'}
          </h3>

          {/* Winning numbers */}
          {result.winning_numbers && (
            <div className="mb-6">
              <span className="text-xs font-semibold text-dark-400 uppercase mb-3 block">Winning Numbers</span>
              <div className="flex gap-3">
                {result.winning_numbers.map((num, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl font-display font-bold text-white shadow-lg shadow-amber-500/30"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-dark-800/50 rounded-xl p-3 text-center">
              <div className="text-xs text-dark-400 mb-1">Prize Pool</div>
              <div className="text-lg font-display font-bold text-white">
                £{(result.total_prize_pool || 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3 text-center">
              <div className="text-xs text-dark-400 mb-1">5-Match (40%)</div>
              <div className="text-lg font-display font-bold text-amber-400">
                £{(result.jackpot_amount || 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3 text-center">
              <div className="text-xs text-dark-400 mb-1">4-Match (35%)</div>
              <div className="text-lg font-display font-bold text-brand-400">
                £{(result.match_4_amount || 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3 text-center">
              <div className="text-xs text-dark-400 mb-1">3-Match (25%)</div>
              <div className="text-lg font-display font-bold text-accent-400">
                £{(result.match_3_amount || 0).toFixed(2)}
              </div>
            </div>
          </div>

          {result.simulation && result.potential_winners && (
            <div>
              <span className="text-xs font-semibold text-dark-400 uppercase mb-2 block">
                Potential Winners: {result.potential_winners.length}
              </span>
            </div>
          )}

          {result.winners_count !== undefined && (
            <div className="text-sm text-dark-300">
              <strong className="text-white">{result.winners_count}</strong> winners found.{' '}
              {result.has_jackpot_winner
                ? '🎉 Jackpot winner!'
                : '💰 Jackpot rolls over to next month.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
