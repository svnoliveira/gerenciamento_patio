import { IQueueEntry } from "@/app/interface/queue_entry/queue_entry";

export function groupQueueEntries(entries: IQueueEntry[]) {
  const waiting = entries.filter(
    (e) => (e.status === "WAITING" || e.status === "STANDBY") && !e.area,
  );

  const byArea = new Map<number, IQueueEntry[]>();
  entries.forEach((e) => {
    const insideThisArea =
      e.area && (e.status === "INSIDE" || e.status === "STANDBY");
    if (insideThisArea) {
      const list = byArea.get(e.area!.id) ?? [];
      list.push(e);
      byArea.set(e.area!.id, list);
    }
  });

  return { waiting, byArea };
}
