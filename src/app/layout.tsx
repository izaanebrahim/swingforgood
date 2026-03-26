import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SwingForGood — Golf That Gives Back',
  description:
    'A subscription-based golf platform combining performance tracking, monthly prize draws, and charitable giving. Play golf, win prizes, change lives.',
  keywords: ['golf', 'charity', 'prize draw', 'stableford', 'subscription'],
  openGraph: {
    title: 'SwingForGood — Golf That Gives Back',
    description:
      'Play golf, win prizes, change lives. A modern platform where every swing makes a difference.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
