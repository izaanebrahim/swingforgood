'use client';

import { useState, useEffect } from 'react';
import { Heart, Search, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      const res = await fetch('/api/charities');
      const json = await res.json();
      if (json.success) setCharities(json.data || []);
      setLoading(false);
    };
    fetchCharities();
  }, []);

  const categories = Array.from(new Set(charities.map((c) => c.category)));
  const filtered = charities.filter(
    (c) =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())) &&
      (!category || c.category === category)
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">
              Our Partners
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
              Charities We{' '}
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Support
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-dark-400">
              Every subscriber contributes to one of these amazing organizations.
              Choose the cause closest to your heart.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
                placeholder="Search charities..."
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field w-full sm:w-48"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Charity grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((charity) => (
                <div key={charity.id} className="card-hover group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400/20 to-pink-400/20 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-red-400 group-hover:fill-red-400 transition-all" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-white">{charity.name}</h3>
                        {charity.featured && (
                          <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                            Featured
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-dark-500">{charity.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-dark-400 mb-4">{charity.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brand-400 font-semibold">
                      £{charity.total_contributions.toLocaleString()} raised
                    </span>
                    {charity.website_url && (
                      <a
                        href={charity.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark-500 hover:text-brand-400 transition-colors flex items-center gap-1 text-xs"
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-dark-700 mx-auto mb-4" />
              <p className="text-dark-400">No charities found matching your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
