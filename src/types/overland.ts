// types/overland.ts

export interface OverlandCalendarDay {
  daynumber: string;
  fullDate: string;
  fare: number | false;
  highlight: boolean;
  farebackup: boolean;
  flight: boolean;
}

export interface OverlandCalendarMonth {
  year: string;
  monthname: string;
  monthnumber: string;
  days: OverlandCalendarDay[];
}

export interface OverlandFlightData {
  hasResults: boolean;
  calendar: OverlandCalendarMonth[];
}

export interface OverlandSearchParams {
  type: 'OW' | 'RT';
  adults: number;
  children: number;
  infants: number;
  fromDst: string;
  toDst: string;
}