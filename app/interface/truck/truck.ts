import { IPagination } from "../admin/global";
import { ICompany } from "../company/company";

export type TTruckCargoType = "Granel" | "Bag" | "Pallet";
export const CARGO_TYPE_OPTIONS: { value: TTruckCargoType; label: string }[] = [
  { value: "Granel", label: "Granel" },
  { value: "Bag", label: "Bag" },
  { value: "Pallet", label: "Pallet" },
];

export const TRUCK_TYPES: string[] = [
  "3/4",
  "Toco",
  "Truck",
  "Bitruck",
  "Prancha",
  "Tanque",
  "Boiadeiro",
  "Bitrem",
  "Rodotrem",
  "Romeu e Julieta",
  "Tritrem",
  "Bi caçamba",
  "Gaiola",
  "Rodo caçamba",
  "Caminhonete",
];

export interface ITruck {
  id: string;
  company: Pick<ICompany, "id" | "name"> | null;
  plate: string;
  product: string;
  driver: string;
  cpf: string;
  cellphone: string;
  type: string;
  cargo_type: TTruckCargoType;
  created_at: string;
  updated_at: string;
}

export interface IPaginatedTrucks extends IPagination {
  results: ITruck[];
}
