'use client';

import { useState, useEffect } from 'react';
import { Settings, User, CreditCard, Bell, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [profile, setProfile] = useState<{
    full_name: string;
    email: string;
    subscription_status: string;
    contribution_percentage: number;
  } | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/user/profile');
      const json = await res.json();
      if (json.success) {
        setProfile(json.data);
        setFullName(json.data.full_name);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSubscribe = async (plan: string) => {
    setCheckingOut(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (json.success && json.data.url) {
        window.location.href = json.data.url;
      }
    } catch (err) {
      console.error(err);
    }
    setCheckingOut(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = profile?.subscription_status === 'active';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-display font-bold text-white">Settings</h2>
        <p className="text-sm text-dark-400">Manage your profile and subscription</p>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-brand-400" />
          <h3 className="font-display font-semibold text-white text-sm">Profile</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              className="input-field opacity-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-dark-500 mt-1">Email cannot be changed</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSaveProfile} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && <span className="text-xs text-brand-400">✓ Saved</span>}
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-brand-400" />
          <h3 className="font-display font-semibold text-white text-sm">Subscription</h3>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
              : 'bg-dark-800 text-dark-400 border border-dark-700'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>

        {!isActive && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={checkingOut}
              className="card-hover text-center"
            >
              <div className="text-lg font-display font-bold text-white">£9.99</div>
              <div className="text-xs text-dark-400">per month</div>
              <div className="btn-primary text-xs mt-3 w-full justify-center">
                {checkingOut ? 'Redirecting...' : 'Subscribe Monthly'}
              </div>
            </button>
            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={checkingOut}
              className="card-hover text-center border-brand-500/30"
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-brand-500 px-2 py-0.5 rounded-full">
                Save 25%
              </div>
              <div className="text-lg font-display font-bold text-white">£89.99</div>
              <div className="text-xs text-dark-400">per year</div>
              <div className="btn-primary text-xs mt-3 w-full justify-center">
                {checkingOut ? 'Redirecting...' : 'Subscribe Yearly'}
              </div>
            </button>
          </div>
        )}

        {isActive && (
          <p className="text-sm text-dark-400">
            Your subscription is active. To manage billing, cancel, or change plans,
            visit your Stripe billing portal.
          </p>
        )}
      </div>
    </div>
  );
}
