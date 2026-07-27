import { IPagination } from "../admin/global";
import { IArea } from "../area/area";

export type TQueueEntryJob = "Carga" | "Descarga";

export type TQueueEntryStatus =
  | "WAITING"
  | "STANDBY"
  | "INSIDE"
  | "FINISHED"
  | "CANCELLED";

export const STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  STANDBY: "Em espera",
  INSIDE: "No pátio",
  FINISHED: "Finalizado",
  CANCELLED: "Cancelado",
};

export const JOB_LABELS: Record<string, string> = {
  Carga: "Carga",
  Descarga: "Descarga",
};

export interface IQueueEntry {
  id: number;
  area: IArea | null;
  status: TQueueEntryStatus;
  job: TQueueEntryJob;
  on_standby_time: null | string;
  start_time: null | string;
  end_time: null | string;
  created_at: string;
  updated_at: string;
  queue_order: number | null;
  photo: string | null;
  company_name: string | null;
  truck_plate: string;
  truck_product: string;
  truck_driver: string;
  truck_cpf: string;
  truck_cellphone: string;
  truck_type: string;
}

export interface IQueueEntryPublic {
  id: number;
  truck_plate: string;
  queue_order: number | null;
  photo: string | null;
  status: TQueueEntryStatus;
  area: { id: number; name: string } | null;
}

export interface IPaginatedQueueEntries extends IPagination {
  results: IQueueEntry[];
}

export type TQueueFilterField =
  | { key: string; label: string; type: "text" }
  | {
      key: string;
      label: string;
      type: "select";
      options: { value: string; label: string }[];
    }
  | {
      key: string;
      label: string;
      type: "dateRange";
      afterKey: string;
      beforeKey: string;
    };

export interface IOrderingOption {
  value: string;
  label: string;
}
