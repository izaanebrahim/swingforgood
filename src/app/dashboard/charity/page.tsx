'use client';

import { useState, useEffect } from 'react';
import { Heart, Search, ExternalLink, Check } from 'lucide-react';

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  logo_url: string | null;
  website_url: string | null;
  featured: boolean;
  total_contributions: number;
}

export default function CharityPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contribution, setContribution] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [charitiesRes, profileRes] = await Promise.all([
        fetch('/api/charities'),
        fetch('/api/user/profile'),
      ]);
      const charitiesJson = await charitiesRes.json();
      const profileJson = await profileRes.json();

      if (charitiesJson.success) setCharities(charitiesJson.data || []);
      if (profileJson.success) {
        setSelectedId(profileJson.data.charity_id);
        setContribution(profileJson.data.contribution_percentage);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (charityId: string, pct?: number) => {
    setSaving(true);
    const res = await fetch('/api/user/charity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        charity_id: charityId,
        contribution_percentage: pct ?? contribution,
      }),
    });
    const json = await res.json();
    if (json.success) {
      setSelectedId(charityId);
      setSavedMsg('Saved!');
      setTimeout(() => setSavedMsg(''), 2000);
    }
    setSaving(false);
  };

  const filtered = charities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-white">My Charity</h2>
        <p className="text-sm text-dark-400">
          Choose a charity and set your contribution percentage (minimum 10%)
        </p>
      </div>

      {/* Contribution slider */}
      <div className="card border-red-500/20 bg-red-500/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Contribution Percentage</h3>
          <span className="text-2xl font-display font-bold text-red-400">{contribution}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={contribution}
          onChange={(e) => setContribution(parseInt(e.target.value))}
          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
        <div className="flex justify-between text-xs text-dark-500 mt-1">
          <span>10% (Minimum)</span>
          <span>100%</span>
        </div>
        {selectedId && (
          <button
            onClick={() => handleSave(selectedId)}
            disabled={saving}
            className="btn-primary text-xs mt-3 px-4 py-2"
          >
            {saving ? 'Saving...' : 'Update Contribution'}
          </button>
        )}
        {savedMsg && <span className="text-xs text-brand-400 ml-3">{savedMsg}</span>}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Search charities..."
        />
      </div>

      {/* Charity list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((charity) => {
          const isSelected = charity.id === selectedId;
          return (
            <div
              key={charity.id}
              className={`card cursor-pointer transition-all ${
                isSelected
                  ? 'border-red-500/40 bg-red-500/5 ring-1 ring-red-500/20'
                  : 'hover:border-dark-600'
              }`}
              onClick={() => handleSave(charity.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400/20 to-pink-400/20 flex items-center justify-center">
                    <Heart className={`w-5 h-5 ${isSelected ? 'text-red-400 fill-red-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white text-sm">{charity.name}</h4>
                    <span className="text-xs text-dark-500">{charity.category}</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs text-dark-400 mb-3">{charity.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-400 font-semibold">
                  £{charity.total_contributions.toLocaleString()} raised
                </span>
                {charity.website_url && (
                  <a
                    href={charity.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-500 hover:text-brand-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
