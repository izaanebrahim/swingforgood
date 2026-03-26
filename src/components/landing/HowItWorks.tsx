'use client';

import { UserPlus, Target, Trophy, Heart } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Subscribe & Join',
    description: 'Choose a monthly or yearly plan. Pick a charity you care about and set your contribution percentage.',
    color: 'from-brand-400 to-brand-600',
    shadowColor: 'shadow-brand-500/20',
  },
  {
    icon: Target,
    title: 'Enter Your Scores',
    description: 'Submit your latest Stableford scores (1–45). Keep your last 5 scores up to date to stay in the draw.',
    color: 'from-blue-400 to-blue-600',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    icon: Trophy,
    title: 'Win Monthly Prizes',
    description: 'Your scores become your lottery numbers. Match 3, 4, or all 5 to win a share of the prize pool.',
    color: 'from-amber-400 to-amber-600',
    shadowColor: 'shadow-amber-500/20',
  },
  {
    icon: Heart,
    title: 'Give Back',
    description: 'A minimum of 10% of every subscription goes directly to your chosen charity. Every swing matters.',
    color: 'from-red-400 to-red-600',
    shadowColor: 'shadow-red-500/20',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Four Simple Steps to{' '}
            <span className="gradient-text">Play & Give</span>
          </h2>
          <p className="max-w-xl mx-auto text-dark-400">
            SwingForGood transforms your regular golf rounds into opportunities
            to win big and support causes that matter.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="card-hover relative group"
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-xs font-bold text-dark-300">
                {index + 1}
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg ${step.shadowColor} group-hover:scale-110 transition-transform duration-300`}
              >
                <step.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-display font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-dark-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
