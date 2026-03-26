'use client';

import { Heart, ExternalLink } from 'lucide-react';

const charities = [
  {
    name: 'On Course Foundation',
    description: 'Using golf to support the recovery of wounded veterans and those with disabilities.',
    category: 'Veterans & Health',
    raised: '£45,200',
  },
  {
    name: 'Golf Foundation',
    description: 'Inspiring young people through golf, promoting health, wellbeing, and personal development.',
    category: 'Youth & Education',
    raised: '£38,700',
  },
  {
    name: 'GreenStar Trust',
    description: 'Protecting biodiversity on golf courses and promoting sustainable groundskeeping practices.',
    category: 'Environment',
    raised: '£28,500',
  },
];

export default function CharitySection() {
  return (
    <section id="charities" className="section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — story */}
          <div>
            <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">
              Charity Impact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-6">
              Play With{' '}
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Purpose
              </span>
            </h2>
            <p className="text-dark-300 mb-6 leading-relaxed">
              At least 10% of every subscription goes directly to a charity of
              your choice. You&apos;re not just playing for prizes — you&apos;re
              making a real impact in the lives of people, communities, and the
              environment.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="card text-center flex-1">
                <div className="text-2xl font-display font-bold text-white">£150K+</div>
                <div className="text-xs text-dark-400">Total Raised</div>
              </div>
              <div className="card text-center flex-1">
                <div className="text-2xl font-display font-bold text-white">12</div>
                <div className="text-xs text-dark-400">Partner Charities</div>
              </div>
              <div className="card text-center flex-1">
                <div className="text-2xl font-display font-bold text-white">5,000+</div>
                <div className="text-xs text-dark-400">Donors</div>
              </div>
            </div>
            <a href="/charities" className="btn-primary gap-2">
              Explore All Charities <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Right — charity cards */}
          <div className="space-y-4">
            {charities.map((charity) => (
              <div
                key={charity.name}
                className="card-hover flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400/20 to-pink-400/20 flex items-center justify-center flex-shrink-0 group-hover:from-red-400/30 group-hover:to-pink-400/30 transition-all">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-semibold text-white">
                      {charity.name}
                    </h3>
                    <span className="text-xs text-brand-400 font-semibold">
                      {charity.raised}
                    </span>
                  </div>
                  <span className="inline-block text-xs text-dark-400 bg-dark-800 rounded-full px-2 py-0.5 mb-2">
                    {charity.category}
                  </span>
                  <p className="text-sm text-dark-400">{charity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
