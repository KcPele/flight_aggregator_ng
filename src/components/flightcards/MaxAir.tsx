import { MaxAirResponse } from "@/types/maxair";
import React from "react";
interface MaxAirProps {
  data: MaxAirResponse;
}
const MaxAir = ({ data }: MaxAirProps) => {
  console.log(data);
  return <div>MaxAir</div>;
};

export default MaxAir;
