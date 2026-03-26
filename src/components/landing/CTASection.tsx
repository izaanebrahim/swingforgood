'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
          Ready to Make Every{' '}
          <span className="gradient-text">Swing Count</span>?
        </h2>
        <p className="text-lg text-dark-300 mb-10 max-w-2xl mx-auto">
          Join thousands of golfers who are winning prizes and changing lives.
          Your first draw entry is just a few clicks away.
        </p>
        <Link
          href="/signup"
          className="btn-primary text-base px-10 py-4 gap-2 animate-pulse-glow"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
