export type valueJetDataType = {
  data: {
    _: {
      journey_key: string;
      combinations: {
        journey_key: string;
        connection_key: string;
        bound_key: string;
        code: string;
        count: number;
        key: string;
        number: number;
        from: string;
        to: string;
        on: string;
        till: string;
        departure: {
          date_time: string;
          code: string;
        };
        arrival: {
          date_time: string;
          code: string;
        };
        basis: string;
        info: {
          equipment: string;
        };
        amount: {
          rate: number;
          base: number;
          value: number;
          taxes: {
            code: string;
            name: string;
            value: number;
          }[];
          surcharge: {
            code: string;
            name: string;
            value: number;
          }[];
          total: number;
        };
        quotes: {
          ngn: {
            rate: number;
            base: number;
            value: number;
            taxes: {
              code: string;
              name: string;
              value: number;
            }[];
            surcharge: {
              code: string;
              name: string;
              value: number;
            }[];
            total: number;
          };
        };
        duration: string;
        order: number;
      }[];
      amount: {
        rate: number;
        base: number;
        value: number;
        taxes: {
          code: string;
          name: string;
          value: number;
        }[];
        surcharge: {
          code: string;
          name: string;
          value: number;
        }[];
        total: number;
      };
      quotes: {
        ngn: {
          rate: number;
          base: number;
          value: number;
          taxes: {
            code: string;
            name: string;
            value: number;
          }[];
          surcharge: {
            code: string;
            name: string;
            value: number;
          }[];
          total: number;
        };
      };
    }[];
    bounds: {
      [key: string]: {
        name: string;
        flights: {
          [key: string]: {
            on: string;
            from: string;
            to: string;
            till: string;
            departure: {
              date_time: string;
              code: string;
            };
            arrival: {
              date_time: string;
              code: string;
            };
            duration: string;
            info: {
              equipment: string;
            };
            key: string;
            classes: {
              [key: string]: {
                code: string;
                name: string;
                count: number;
                value: number;
                combinations: string[];
              };
            };
            fares: {
              name: string;
              unit: number;
              code?: string;
              count?: number;
              value?: number;
              combinations?: string[];
            }[];
          };
        };
        itineraries: {
          [key: string]: {
            [key: string]: {
              on: string;
              from: string;
              to: string;
              till: string;
              duration: string;
              number: number;
              order: number;
              amount: {
                rate: number;
                base: number;
                value: number;
                taxes: {
                  code: string;
                  name: string;
                  value: number;
                }[];
                surcharge: {
                  code: string;
                  name: string;
                  value: number;
                }[];
                total: number;
              };
              info: {
                equipment: string;
              };
              classes: {
                [key: string]: {
                  code: string;
                  name: string;
                  count: number;
                  value: number;
                  combinations: string[];
                };
              };
              fares: {
                name: string;
                unit: number;
                code?: string;
                count?: number;
                value?: number;
                combinations?: string[];
              }[];
            };
          };
        };
      };
    };
  };
  count: number;
};
