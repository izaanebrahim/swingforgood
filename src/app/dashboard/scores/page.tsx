'use client';

import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Calendar } from 'lucide-react';

interface Score {
  id: string;
  score: number;
  date_played: string;
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchScores = async () => {
    const res = await fetch('/api/scores');
    const json = await res.json();
    if (json.success) setScores(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAdding(true);

    const scoreNum = parseInt(newScore);
    if (scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45');
      setAdding(false);
      return;
    }

    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: scoreNum, date_played: newDate }),
    });

    const json = await res.json();
    if (!json.success) {
      setError(json.error || 'Failed to add score');
      setAdding(false);
      return;
    }

    setNewScore('');
    setShowForm(false);
    setAdding(false);
    fetchScores();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this score?')) return;
    await fetch(`/api/scores?id=${id}`, { method: 'DELETE' });
    fetchScores();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">My Scores</h2>
          <p className="text-sm text-dark-400">
            Keep your last 5 Stableford scores (1–45). These are your draw numbers!
          </p>
        </div>
        {scores.length < 5 && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm gap-1">
            <Plus className="w-4 h-4" /> Add Score
          </button>
        )}
      </div>

      {/* Add score form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card border-brand-500/30">
          <h3 className="font-display font-semibold text-white mb-4">Add New Score</h3>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                Score (1–45)
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="input-field pl-10"
                  placeholder="e.g. 32"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                Date Played
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={adding} className="btn-primary text-sm disabled:opacity-50">
              {adding ? 'Adding...' : 'Add Score'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError(''); }} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>

          {scores.length >= 4 && (
            <p className="text-xs text-amber-400 mt-3">
              ⚠️ You have {scores.length} scores. Adding this will replace your oldest score.
            </p>
          )}
        </form>
      )}

      {/* Scores list */}
      <div className="space-y-3">
        {scores.length === 0 ? (
          <div className="card text-center py-12">
            <Target className="w-10 h-10 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 font-medium">No scores yet</p>
            <p className="text-dark-500 text-sm">Add your first Stableford score to get started</p>
          </div>
        ) : (
          scores.map((s, i) => (
            <div key={s.id} className="card flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 flex items-center justify-center">
                  <span className="text-lg font-display font-bold text-brand-400">{s.score}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Score #{i + 1}</div>
                  <div className="text-xs text-dark-500">
                    {new Date(s.date_played).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="opacity-0 group-hover:opacity-100 text-dark-500 hover:text-red-400 transition-all p-2 rounded-lg hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {scores.length >= 5 && (
        <div className="card border-brand-500/20 bg-brand-500/5">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-brand-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">All 5 slots filled!</p>
              <p className="text-xs text-dark-400">
                Adding a new score will automatically replace your oldest one. These 5 numbers are your draw entry!
              </p>
              <button onClick={() => setShowForm(true)} className="btn-primary text-xs mt-3 px-4 py-2">
                <Plus className="w-3 h-3 mr-1" /> Replace Oldest Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
