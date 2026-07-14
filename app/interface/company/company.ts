import { IPagination } from "../admin/global";
import { ITruck } from "../truck/truck";
import { IUser } from "../user/user";

export interface ICompany {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  users: Pick<IUser, "id" | "username" | "name" | "email" | "role">[];
  trucks: Pick<
    ITruck,
    | "id"
    | "company"
    | "plate"
    | "product"
    | "granel"
    | "bag"
    | "pallet"
    | "driver"
    | "cpf"
    | "cellphone"
    | "type"
    | "created_at"
    | "updated_at"
  >[];
}

export interface IPaginatedCompanies extends IPagination {
  results: ICompany[];
}
