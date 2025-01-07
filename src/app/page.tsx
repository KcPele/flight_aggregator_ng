"use client";
import { AirPeaceSearch } from "@/components/AirPeaceSearch";

export default function Home() {
  const handleTest = async () => {
    // const response = await fetch(
    //   "/api/flights/ibomair?" +
    //     new URLSearchParams({
    //       tripType: "ONE_WAY",
    //       depPort: "LOS",
    //       arrPort: "ABV",
    //       date: "2025-01-10", // ISO date string
    //       adult: "1",
    //       child: "0",
    //       infant: "0",
    //       accountCode: "", // optional
    //     })
    // );
    const response = await fetch(
      "/api/flights/arikair?" +
        new URLSearchParams({
          tripType: "ONE_WAY",
          depPort: "LOS",
          arrPort: "ABV",
          date: "2025-02-10", // ISO date string
          adult: "1",
          child: "0",
          infant: "0",
        })
    );
    // const response = await fetch(
    //   "/api/flights/overland?" +
    //     new URLSearchParams({
    //       type: "OW",
    //       fromDst: "LOS",
    //       toDst: "ABV",
    //       adults: "1",
    //       children: "0",
    //       infants: "0",
    //     })
    // );

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
