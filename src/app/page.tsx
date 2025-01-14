"use client";

import HeroSection from "@/components/landing/HeroSection";
import { SearchFlight } from "@/components/SearchFlight";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600/50 via-pink-500/50 to-orange-400/50">
      <HeroSection />

      <SearchFlight />

      {/* Footer */}

      <footer className="mt-12 text-center text-white">
        <p>© 2024 CheapSearch. This was built for the sake of learning.</p>
      </footer>
    </main>
  );
}
