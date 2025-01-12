import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as cheerio from "cheerio";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractFlightData<T>(html: string): T[] {
  const $ = cheerio.load(html);
  const flights: T[] = [];

  // Iterate over each flight panel
  $(".flt-panel").each((_, panel) => {
    const flight = {
      departureTime: $(panel).find(".cal-Depart-time .time").text().trim(),
      arrivalTime: $(panel).find(".cal-Arrive-time .time").text().trim(),
      departureCity: $(panel).find(".cal-Depart-time .city").text().trim(),
      arrivalCity: $(panel).find(".cal-Arrive-time .city").text().trim(),
      flightDate: $(panel).find(".cal-Depart-time .flightDate").text().trim(),
      flightNumber: $(panel).find(".flightnumber").text().trim(),
      flightDuration: $(panel).find(".flightDuration").text().trim(),
      price: $(panel).find(".fare-price, .fare-price-small").text().trim(),
      class: "",
      seatsRemaining: "",
    };

    // Extract class and seat availability
    $(panel)
      .find(".flt-class")
      .each((_, classPanel) => {
        const classType = $(classPanel).find(".class-band-name").text().trim();
        const seats = $(classPanel)
          .find(".seats-count, .seats-none")
          .text()
          .trim();
        if (classType && seats) {
          flight.class = classType;
          flight.seatsRemaining = seats;
        }
      });

    flights.push(flight as T);
  });

  return flights;
}
