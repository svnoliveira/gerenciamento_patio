import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";

export interface IBoardGroups {
  queueEntries: IQueueEntry[]; // SCHEDULED + ON_YARD + AWAITING_CONCLUSION
  areaEntries: IQueueEntry[]; // IN_OPERATION
}

export function groupBoardEntries(entries: IQueueEntry[]): IBoardGroups {
  return {
    queueEntries: entries.filter((e) => e.status !== "IN_OPERATION"),
    areaEntries: entries.filter((e) => e.status === "IN_OPERATION"),
  };
}
