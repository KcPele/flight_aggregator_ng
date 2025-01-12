import React from "react";
import { AzmanAirResponse } from "@/types/azmanair";
interface AzmanAirProps {
  data: AzmanAirResponse;
}
const AzmanAir = ({ data }: AzmanAirProps) => {
  console.log(data);
  return <div>AzmanAir</div>;
};

export default AzmanAir;
