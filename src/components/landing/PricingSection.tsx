'use client';

import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Monthly',
    price: '£9.99',
    period: '/month',
    description: 'Full access with monthly flexibility.',
    features: [
      'Enter up to 5 Stableford scores',
      'Monthly prize draw entry',
      '10%+ goes to your chosen charity',
      'Full dashboard access',
      'Winner verification system',
    ],
    cta: 'Start Monthly',
    featured: false,
    href: '/signup?plan=monthly',
  },
  {
    name: 'Yearly',
    price: '£89.99',
    period: '/year',
    description: 'Save 25% with annual billing.',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Priority support',
      'Early draw notifications',
      'Exclusive charity events access',
    ],
    cta: 'Start Yearly — Save 25%',
    featured: true,
    badge: 'Best Value',
    href: '/signup?plan=yearly',
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="section-padding relative">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="max-w-xl mx-auto text-dark-400">
            One plan, two billing options. Every penny is accounted for — 50%
            prize pool, 40% platform, 10%+ charity.
          </p>
        </div>

        {/* Revenue breakdown mini-bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex rounded-full overflow-hidden h-3 bg-dark-800">
            <div className="w-[50%] bg-gradient-to-r from-brand-400 to-brand-500" title="50% Prize Pool" />
            <div className="w-[40%] bg-gradient-to-r from-blue-400 to-blue-500" title="40% Platform" />
            <div className="w-[10%] bg-gradient-to-r from-red-400 to-pink-400" title="10% Charity" />
          </div>
          <div className="flex justify-between mt-2 text-xs text-dark-400">
            <span>50% Prize Pool</span>
            <span>40% Platform</span>
            <span>10%+ Charity</span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 transition-all duration-300 relative ${
                plan.featured
                  ? 'border-brand-500/40 bg-brand-500/5 ring-1 ring-brand-500/20 hover:ring-brand-500/40'
                  : 'border-dark-700/50 bg-dark-800/30 hover:border-dark-600'
              }`}
            >
              {plan.featured && plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-500 text-xs font-bold text-white">
                  <Sparkles className="w-3 h-3" />
                  {plan.badge}
                </div>
              )}

              <h3 className="text-xl font-display font-bold text-white mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-dark-400 mb-4">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-display font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-dark-400 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-dark-300">
                    <Check className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center w-full ${
                  plan.featured ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
