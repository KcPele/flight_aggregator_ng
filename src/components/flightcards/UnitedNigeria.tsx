import React from "react";
import { UnitedNigeriaResponse } from "@/types/unitednigeria";
interface UnitedNigeriaProps {
  data: UnitedNigeriaResponse;
}
const UnitedNigeria = ({ data }: UnitedNigeriaProps) => {
  console.log(data);
  return <div>UnitedNigeria</div>;
};

export default UnitedNigeria;
