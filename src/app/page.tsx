"use client";

import { SearchFlight } from "@/components/SearchFlight";
import { PlaneLanding } from "lucide-react";
import { Plane } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Glassmorphism background elements */}
      <div className="relative min-h-screen flex flex-col items-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PlaneLanding className="w-12 h-12 text-slate-300" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
              SkySearch
            </h1>
            <Plane className="w-12 h-12 text-slate-300" />
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Find the best flight deals across multiple airlines in Nigeria.
            Compare prices and book your next journey with ease.
          </p>
        </div>

        {/* Main search container */}
        <div className="w-full max-w-4xl bg-slate-800/50 rounded-lg border border-slate-700 p-8">
          <SearchFlight />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500">
          <p>© 2024 SkySearch. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
