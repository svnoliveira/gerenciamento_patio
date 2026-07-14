import { IPagination } from "../admin/global";
import { ICompany } from "../company/company";

export interface ITruck {
  id: string;
  company: Pick<ICompany, "id" | "name"> | null;
  plate: string;
  product: string;
  granel?: string | null;
  bag?: string | null;
  pallet?: string | null;
  driver: string;
  cpf: string;
  cellphone: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface IPaginatedTrucks extends IPagination {
  results: ITruck[];
}
