import Link from 'next/link';
import { Zap, Heart, Mail, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold text-white">
                Swing<span className="gradient-text">ForGood</span>
              </span>
            </Link>
            <p className="text-sm text-dark-400 mb-4">
              Every swing makes a difference. Play golf, win prizes, change lives.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center text-dark-400 hover:text-brand-400 hover:bg-dark-700 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center text-dark-400 hover:text-brand-400 hover:bg-dark-700 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center text-dark-400 hover:text-brand-400 hover:bg-dark-700 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="text-sm text-dark-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="text-sm text-dark-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#prizes" className="text-sm text-dark-400 hover:text-white transition-colors">Prizes</a></li>
              <li><Link href="/charities" className="text-sm text-dark-400 hover:text-white transition-colors">Charities</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            &copy; {new Date().getFullYear()} SwingForGood. All rights reserved.
          </p>
          <p className="text-sm text-dark-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500" /> for charity
          </p>
        </div>
      </div>
    </footer>
  );
}
