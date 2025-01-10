// lib/services/valuejet.ts
import { format } from "date-fns";
import { load } from "cheerio";
import { scrapper } from "../helper";
import { ValueJetFlight, ValueJetSearchParams } from "@/types/valuejet";

export class ValueJetService {
  private readonly BASE_URL = "https://flyvaluejet.com/flight-result";

  private buildRequestInfo(params: ValueJetSearchParams): string {
    return `dep:${params.dep},arr:${params.arr},on:${format(
      params.departure,
      "yyyy-MM-dd"
    )},till:,p.a:${params.adults},p.c:${params.children},p.i:${params.infants}`;
  }
  async searchFlights(params: ValueJetSearchParams): Promise<{
    flightsData: ValueJetFlight[];
    url: string;
  }> {
    try {
      const requestInfo = this.buildRequestInfo(params);
      const url = `${this.BASE_URL}?requestInfo=${requestInfo}`;
      const html = await scrapper({
        url,
        flightType: "valuejet",
      });

      return {
        flightsData: this.parseFlights(html),
        url,
      };
    } catch (error) {
      // console.error("ValueJet API Error:", error);
      throw error;
    }
  }

  parseFlights(html: string): ValueJetFlight[] {
    const $ = load(html);
    const flights: ValueJetFlight[] = [];

    // Parse flight dates and prices first
    const dateGrid = $(".grid.grid-cols-5.gap-0.items-center.px-6");
    const datePrices: Record<string, string> = {};
    const selectedDate = {
      date: "",
      price: "",
    };

    dateGrid
      .find(".w-full.focus\\:shadow-outline.col-span-1")
      .each((_, dateEl) => {
        const dateDiv = $(dateEl).find("div");
        const date = dateDiv.find("span").first().text().trim();
        const price = dateDiv.find("span").last().text().trim();

        if (dateDiv.hasClass("bg-primary")) {
          selectedDate.date = date;
          selectedDate.price = price;
        } else {
          datePrices[date] = price;
        }
      });

    $(".flex.flex-col.w-full.border.border-gray-200.rounded-lg").each(
      (_, card) => {
        const flightNumber = $(card)
          .find(".font-roboto.flex.flex-col.basis-3 p")
          .first()
          .text()
          .trim();

        // Departure details with airport code
        const departureEl = $(card).find(".flex.basis-1.flex-col.pb-1").first();
        const departureFull = departureEl
          .find(".text-sm.font-normal")
          .text()
          .split("(");
        const departureLocation = departureFull[0].trim();
        const departureAirport = departureFull[1]?.replace(")", "").trim();

        // Arrival details with airport code
        const arrivalEl = $(card).find(".flex.basis-1.flex-col.items-end.pb-1");
        const arrivalFull = arrivalEl
          .find(".text-sm.font-normal")
          .text()
          .split("(");
        const arrivalLocation = arrivalFull[0].trim();
        const arrivalAirport = arrivalFull[1]?.replace(")", "").trim();

        // Flight duration
        const duration = $(card).find("p:contains('hour')").text().trim();

        // Base price - handle multiple price elements correctly
        const priceText = $(card)
          .find("button.bg-primary.text-white")
          .first()
          .text()
          .trim();
        const basePrice = priceText.match(/₦[\d,]+/)?.[0] || "";

        // Flight info and status
        const flightInfo = {
          status: "",
          statusUrl: "",
        };

        const statusLink = $(card).find("a[href*='flightradar24.com']");
        if (statusLink.length) {
          flightInfo.statusUrl = statusLink.attr("href") || "";
          flightInfo.status = "Scheduled";
        }

        flights.push({
          flightNumber,
          departure: {
            time: departureEl
              .find(".text-primary.text-2xl.font-semibold")
              .text()
              .trim(),
            period: departureEl
              .find(".text-sm.font-semibold")
              .last()
              .text()
              .trim(),
            location: departureLocation,
            airport: departureAirport,
          },
          arrival: {
            time: arrivalEl
              .find(".text-primary.text-2xl.font-semibold")
              .text()
              .trim(),
            period: arrivalEl
              .find(".text-sm.font-semibold")
              .last()
              .text()
              .trim(),
            location: arrivalLocation,
            airport: arrivalAirport,
          },
          duration,
          basePrice,
          flightInfo,
          selectedDate: selectedDate.date
            ? {
                date: selectedDate.date,
                price: selectedDate.price,
              }
            : undefined,
          otherDates: Object.entries(datePrices).map(([date, price]) => ({
            date,
            price,
          })),
        });
      }
    );

    return flights;
  }
}
