export type overlandDataType = {
  hasResults: boolean;
  calendar: Array<{
    year: string;
    monthname: string;
    monthnumber: string;
    days: Array<{
      daynumber: string;
      fullDate: string;
      fare: number | false;
      highlight: boolean;
      farebackup: boolean;
      flight: boolean;
    }>;
  }>;
};
