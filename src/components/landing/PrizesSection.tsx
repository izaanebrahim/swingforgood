'use client';

import { Trophy, Sparkles, Star } from 'lucide-react';

const tiers = [
  {
    match: '5-Number Match',
    percentage: '40%',
    description: 'The jackpot! Match all 5 numbers and take home the biggest prize. Rolls over if unclaimed.',
    icon: Trophy,
    color: 'from-amber-400 to-yellow-500',
    borderColor: 'border-amber-500/30',
    bgGlow: 'bg-amber-500/5',
    featured: true,
  },
  {
    match: '4-Number Match',
    percentage: '35%',
    description: 'Match 4 of your 5 scores for a generous share of the prize pool.',
    icon: Sparkles,
    color: 'from-brand-400 to-brand-500',
    borderColor: 'border-brand-500/30',
    bgGlow: 'bg-brand-500/5',
    featured: false,
  },
  {
    match: '3-Number Match',
    percentage: '25%',
    description: 'Match 3 scores to win. The most common tier with great rewards.',
    icon: Star,
    color: 'from-accent-400 to-accent-500',
    borderColor: 'border-accent-500/30',
    bgGlow: 'bg-accent-500/5',
    featured: false,
  },
];

export default function PrizesSection() {
  return (
    <section id="prizes" className="section-padding relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Prize Pool
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Your Scores Are Your{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Winning Numbers
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-dark-400">
            50% of all subscription revenue feeds the monthly prize pool.
            The more players, the bigger the prizes.
          </p>
        </div>

        {/* Prize tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.match}
              className={`rounded-2xl border ${tier.borderColor} ${tier.bgGlow} backdrop-blur-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                tier.featured
                  ? 'md:-mt-4 md:mb-4 ring-1 ring-amber-500/20'
                  : ''
              }`}
            >
              {tier.featured && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-4">
                  <Trophy className="w-3 h-3" /> JACKPOT
                </div>
              )}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                <tier.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-1">
                {tier.match}
              </h3>
              <div className="text-4xl font-display font-bold gradient-text mb-3">
                {tier.percentage}
              </div>
              <p className="text-sm text-dark-400">{tier.description}</p>
            </div>
          ))}
        </div>

        {/* Rollover note */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">
              Jackpot rolls over to next month if no 5-match winner!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
