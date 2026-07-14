import { IPagination } from "../admin/global";

export interface IArea {
  id: number;
  name: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface IPaginatedAreas extends IPagination {
  results: IArea[];
}
