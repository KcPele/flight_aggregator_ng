export type ibomairDataType = Array<{
  departure: {
    time: string;
    airport: string;
    date: string;
  };
  arrival: {
    time: string;
    airport: string;
    date: string;
  };
  flightNumber: string;
  duration: string;
  stops: string;
  fares: Array<{
    fareType: string;
    price: string;
  }>;
}>;
