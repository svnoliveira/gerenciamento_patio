import { IPagination } from "../admin/global";
import { ICompany } from "../company/company";

export type TUserRole = "COMPANY" | "ADMIN" | "OPERATOR";

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  OPERATOR: "Operador",
  COMPANY: "Empresa",
};

export interface IUser {
  id: number;
  username: string;
  email: string;
  name: string;
  is_superuser?: boolean;
  role: TUserRole;
  company: Pick<ICompany, "id" | "name"> | null;
}

export interface IPaginatedUsers extends IPagination {
  results: IUser[];
}

export interface IRegisterPayload extends Pick<
  IUser,
  "username" | "email" | "name" | "role"
> {
  password: string;
  company_id?: number | null;
}

export interface ILoginPayload {
  username: string;
  password: string;
}

export interface IUserState {
  user: IUser | null;

  setUser: (user: IUser | null) => void;
  logout: () => void;
}
