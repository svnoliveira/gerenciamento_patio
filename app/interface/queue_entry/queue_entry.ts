import { IPagination } from "../admin/global";
import { IArea } from "../area/area";
import { TTruckCargoType } from "../truck/truck";

export type TQueueEntryJob = "Carga" | "Descarga";
export type TQueueListFilter =
  | "ALL"
  | "SCHEDULED"
  | "ON_YARD"
  | "AWAITING_CONCLUSION";

export type TQueueEntryStatus =
  | "SCHEDULED"
  | "ON_YARD"
  | "IN_OPERATION"
  | "AWAITING_CONCLUSION"
  | "FINISHED"
  | "CANCELLED";

export const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Agendado",
  ON_YARD: "No pátio",
  IN_OPERATION: "Em operação",
  AWAITING_CONCLUSION: "Aguardando NF",
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
  job: TQueueEntryJob | null;
  arrival_time: string | null;
  start_time: string | null;
  awaiting_conclusion_time: string | null;
  end_time: string | null;
  created_at: string;
  updated_at: string;
  queue_order: number | null;
  photo: string | null;
  document_photo: string | null;
  company_name: string | null;
  truck_plate: string;
  truck_product: string;
  truck_driver: string;
  truck_cpf: string;
  truck_cellphone: string;
  truck_type: string;
  truck_cargo_type: TTruckCargoType;
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

export interface IQueueEntryEstimate {
  message: string;
  estimated_minutes: number | null;
  is_reliable?: boolean;
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
