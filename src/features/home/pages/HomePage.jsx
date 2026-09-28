import React from 'react';
import HeroSection from '../components/HeroSection';
import RecentListingsSection from '../components/RecentListingsSection';
import MapSection from '../components/MapSection';
import ProcessSection from '../components/ProcessSection';
import DualCtaSection from '../components/DualCtaSection';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection />
      <RecentListingsSection />
      <MapSection />
      <ProcessSection />
      <DualCtaSection />
    </div>
  );
}

