import { AirPeaceResponse } from "@/types/airpeace";
import { ArikAirResponse } from "@/types/arikair";
import { GreenAfricaResponse } from "@/types/greenafrica";
import { IbomAirResponse } from "@/types/ibomair";
import { MaxAirResponse } from "@/types/maxair";
import { OverlandResponse } from "@/types/overland";
import { UnitedNigeriaResponse } from "@/types/unitednigeria";
import { ValueJetResponse } from "@/types/valuejet";

export const transformedAirPeaceFlights = (data: AirPeaceResponse) => {
  return data.flights.map((flight) => {
    // Get the lowest price from available fares
    const lowestFare = flight.fares.reduce((min, fare) =>
      parseFloat(fare.price) < parseFloat(min.price) ? fare : min
    );

    return {
      departureTime: `${flight.departure.time} ${flight.departure.date}`,
      arrivalTime: `${flight.arrival.time} ${flight.arrival.date}`,
      type: lowestFare.fareType,
      price: lowestFare.price,
      url: data.url,
      provider: data.provider,
    };
  });
};

export const transformedArikAirFlights = (data: ArikAirResponse) => {
  return data.flights.map((flight) => ({
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    type: "ECONOMY", // Arik Air typically defaults to economy
    price: flight.price,
    url: data.url,
    provider: data.provider,
  }));
};

export const transformedGreenAfricaFlights = (data: GreenAfricaResponse) => {
  return data.flights.map((flight) => {
    // Get lowest fare from fareTypes
    const lowestFare = flight.fareTypes.reduce((min, fare) =>
      parseFloat(fare.price) < parseFloat(min.price) ? fare : min
    );

    return {
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      type: lowestFare.name,
      price: lowestFare.price,
      url: data.url,
      provider: data.provider,
    };
  });
};

export const transformedIbomAirFlights = (data: IbomAirResponse) => {
  return data.flights.map((flight) => {
    const lowestFare = flight.fares.reduce((min, fare) =>
      parseFloat(fare.price) < parseFloat(min.price) ? fare : min
    );

    return {
      departureTime: `${flight.departure.time} ${flight.departure.date}`,
      arrivalTime: `${flight.arrival.time} ${flight.arrival.date}`,
      type: lowestFare.fareType,
      price: lowestFare.price,
      url: data.url,
      provider: data.provider,
    };
  });
};

export const transformedOverlandFlights = (data: OverlandResponse) => {
  return data.flights.map((flight) => {
    const availableFares = flight.fareClasses.filter((fare) => fare.available);

    // Ensure availableFares is not empty
    const lowestFare = availableFares.length
      ? availableFares.reduce((min, fare) =>
          fare.price < min.price ? fare : min
        )
      : null;

    return {
      departureTime: `${flight.departureTime} ${flight.departureDate}`,
      arrivalTime: `${flight.arrivalTime} ${flight.arrivalDate}`,
      type: lowestFare?.fareClass,
      price: lowestFare?.price.toString(),
      url: data.url,
      provider: data.provider,
    };
  });
};

export const transformedValueJetFlights = (data: ValueJetResponse) => {
  return data.flights.map((flight) => {
    const departureTime = `${flight.departure.time} ${flight.departure.period}`;
    const arrivalTime = `${flight.arrival.time} ${flight.arrival.period}`;

    return {
      departureTime,
      arrivalTime,
      type: "STANDARD", // ValueJet typically offers standard fares
      price: flight.selectedDate?.price || flight.basePrice,
      url: data.url,
      provider: data.provider,
    };
  });
};

export const transformedMaxAirFlights = (data: MaxAirResponse) => {
  return data.flights.map((flight) => {
    return {
      departureTime: `${flight.departureTime} ${flight.departureCity}`,
      arrivalTime: `${flight.arrivalTime} ${flight.arrivalCity}`,
      type: flight.class,
      price: flight.price,
      url: data.url,
      provider: data.provider,
    };
  });
};

export const transformedUnitedNigeriaFlights = (
  data: UnitedNigeriaResponse
) => {
  return data.flights.map((flight) => {
    return {
      departureTime: `${flight.departureTime} ${flight.departureCity}`,
      arrivalTime: `${flight.arrivalTime} ${flight.arrivalCity}`,
      type: flight.class,
      price: flight.price,
      url: data.url,
      provider: data.provider,
    };
  });
};
