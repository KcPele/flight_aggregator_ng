"use client";

export default function Home() {
  const handleTest = async () => {
    const response = await fetch(
      "/api/flights/valuejet?" +
        new URLSearchParams({
          origin: "LOS",
          destination: "ABV",
          departure: "2025-01-20",
          adult: "1",
          child: "0",
          infant: "0",
        })
    );

    const data = await response.json();
    console.log(data);
  };
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Flight Search</h1>
      <button onClick={handleTest}>Test</button>
    </main>
  );
}
