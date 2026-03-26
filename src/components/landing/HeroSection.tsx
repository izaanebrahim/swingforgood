'use client';

import Link from 'next/link';
import { ArrowRight, Trophy, Heart, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="text-sm font-medium text-brand-300">
            Monthly draws now live — March 2026
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 animate-slide-up">
          Every Swing{' '}
          <span className="gradient-text">Makes a Difference</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-dark-300 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Enter your golf scores, compete in monthly prize draws, and contribute
          to charities you care about. Golf has never felt this good.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/signup" className="btn-primary text-base px-8 py-4 gap-2">
            Start Playing for Good
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
            See How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card text-center">
            <Trophy className="w-6 h-6 text-brand-400 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-white">£25,000+</div>
            <div className="text-sm text-dark-400">Prize Pool Monthly</div>
          </div>
          <div className="card text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-white">£150K+</div>
            <div className="text-sm text-dark-400">Raised for Charity</div>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-6 h-6 text-accent-400 mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-white">5,000+</div>
            <div className="text-sm text-dark-400">Active Golfers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
