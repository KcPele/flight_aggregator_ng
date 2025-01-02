"use client";
import { AirPeaceSearch } from "@/components/AirPeaceSearch";

export default function Home() {
  const handleTest = async () => {
    const response = await fetch(
      "/api/flights/arikair?" +
        new URLSearchParams({
          tripType: "ONE_WAY",
          depPort: "LOS",
          arrPort: "ABV",
          date: "2025-01-10", // ISO date string
          cabinClass: "", // optional
        })
    );

    const data = await response.json();
    console.log(data);
  };
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Air Peace Flight Search</h1>
      <AirPeaceSearch />
      <button onClick={handleTest}>Test</button>
    </main>
  );
}
