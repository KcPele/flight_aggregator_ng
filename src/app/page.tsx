"use client";

import { SearchFlight } from "@/components/SearchFlight";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Flight Search</h1>
      <SearchFlight />
    </main>
  );
}
