'use client';

import { useState, useEffect } from 'react';
import { Heart, Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  featured: boolean;
  website_url: string | null;
  total_contributions: number;
}

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', website_url: '', featured: false });

  const fetchCharities = async () => {
    const res = await fetch('/api/charities');
    const json = await res.json();
    if (json.success) setCharities(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">Charity Management</h2>
          <p className="text-sm text-dark-400">Add, edit, and manage partner charities</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '', category: '', website_url: '', featured: false }); }}
          className="btn-primary text-sm gap-1"
        >
          <Plus className="w-4 h-4" /> Add Charity
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="card border-accent-500/30">
          <h3 className="font-display font-semibold text-white mb-4">
            {editing ? 'Edit Charity' : 'Add New Charity'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                placeholder="Charity name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
                placeholder="e.g. Youth & Education"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field min-h-[80px]"
                placeholder="Brief description of the charity..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Website URL</label>
              <input
                type="url"
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded bg-dark-800 border-dark-600"
              />
              <label htmlFor="featured" className="text-sm text-dark-300">Featured charity</label>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-accent text-sm gap-1">
              <Save className="w-4 h-4" /> {editing ? 'Update' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm gap-1">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Charity list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {charities.map((charity) => (
          <div key={charity.id} className="card flex items-start justify-between group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400/20 to-pink-400/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-white text-sm">{charity.name}</h4>
                  {charity.featured && (
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                <span className="text-xs text-dark-500">{charity.category}</span>
                <p className="text-xs text-dark-400 mt-1">{charity.description}</p>
                <span className="text-xs text-brand-400 font-semibold mt-1 block">
                  £{charity.total_contributions.toLocaleString()} raised
                </span>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditing(charity.id);
                  setForm({
                    name: charity.name,
                    description: charity.description,
                    category: charity.category,
                    website_url: charity.website_url || '',
                    featured: charity.featured,
                  });
                  setShowForm(true);
                }}
                className="p-1.5 rounded-lg text-dark-500 hover:text-white hover:bg-dark-700"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
