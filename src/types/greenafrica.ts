export type greenAfricaDataType = {
  success: boolean;
  data: {
    signature: string;
    session_id: string;
    flights: {
      count: number;
      flight: Array<{
        journey: Array<{
          airlineDesignator: string;
          airlineICAOcode: string;
          airlineName: string;
          aircraftType: string;
          aircraftTypeIataCode: string;
          fltnum: string;
          fromcode: string;
          tocode: string;
          via: string;
          STD: string;
          STA: string;
          STDinUTC: string;
          STAinUTC: string;
          airlineLogo: string;
          CompanyChildAgeStart: number;
          CompanyChildAgeEnd: number;
          companyINFchargeTAX: boolean;
          deeplink: string;
          direction: string;
          websiteDiscount: number;
          flighttype: string;
          minimumPassengersForBooking: number;
          flightcode: number;
          classes: {
            [classType: string]: {
              fltflimitcurrency: string;
              flightid: number;
              freeseats: number;
              className: string;
              classCode: string;
              cabinClass: string;
              cabinCode: string;
              currency: string;
              chargeType: string;
              chargeTypeCode: string;
              baggageAllowance: number;
              baggageUnit: string;
              fare: {
                tax: string;
                adultFare: string;
                childFare: string;
                infantFare: string;
              };
              rackFare: {
                tax: string;
                taxBreakdown: {
                  [taxCode: string]: string;
                };
                adultFare: string;
                childFare: string;
                infantFare: string;
                vat: string;
                commission: number;
                vatOnTax: boolean;
                tax4forChildRE: string;
              };
              services: {
                [serviceType: string]: {
                  active: boolean;
                  text: string;
                };
              };
              fareid: number;
              type: string;
              notification: string;
              breakdown: any[];
              totalfare: number;
              product: string;
              AmountDifference: number;
              AdditionalAmount: number;
              ExtraAmount: number;
            };
          };
          rules: any[];
          departureTerminal: string;
          arrivalTerminal: string;
        }> | null;
      }>;
    };
  };
  message: string;
};

export interface GreenAfricaFlight {
  departureTime: string;
  arrivalTime: string;
  departurePort: string;
  arrivalPort: string;
  flightNumber: string;
  duration: string;
  price: string;
  seatsAvailable: string;
  fareTypes: {
    name: string;
    price: string;
    benefits: string[];
  }[];
}

export interface GreenAfricaSearchParams {
  origin: string;
  destination: string;
  departure: Date;
  adults: number;
  children: number;
  infants: number;
}
