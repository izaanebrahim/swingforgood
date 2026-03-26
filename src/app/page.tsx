import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import PrizesSection from '@/components/landing/PrizesSection';
import CharitySection from '@/components/landing/CharitySection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <PrizesSection />
        <CharitySection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
