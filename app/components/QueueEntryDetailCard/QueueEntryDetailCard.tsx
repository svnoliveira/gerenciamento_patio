import Image from "next/image";
import {
  Building2,
  User,
  IdCard,
  Phone,
  Package,
  Truck as TruckIcon,
  Boxes,
  ArrowLeftRight,
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import {
  STATUS_LABELS,
  JOB_LABELS,
  IQueueEntry,
  IQueueEntryPublic,
} from "@/app/interface/queue_entry/queue_entry";
import { STATUS_COLORS } from "@/lib/statusColors";
import { formatDate } from "@/lib/formatDate";
import { formatDuration } from "@/lib/formatDuration";

export function QueueEntryDetailCard({
  entry,
}: {
  entry: IQueueEntry | IQueueEntryPublic;
}) {
  const isFull = "company_name" in entry;

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden py-0 gap-0">
      {/* Status accent bar */}
      <div className={`h-2 w-full ${STATUS_COLORS[entry.status]}`} />

      <CardHeader className="flex flex-col gap-3 pt-5 pb-4">
        <div className="flex items-center justify-between w-full">
          <span className="text-4xl font-bold tracking-tight">
            Placa: {entry.truck_plate}
          </span>
          {entry.queue_order !== null && (
            <Badge variant="secondary" className="px-4 py-2 text-xl">
              #{entry.queue_order}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`px-4 py-2 text-lg ${STATUS_COLORS[entry.status]}`}
          >
            {STATUS_LABELS[entry.status] ?? entry.status}
          </Badge>
          {entry.area?.name && (
            <Badge variant="secondary" className="px-4 py-2 text-lg">
              {entry.area.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 pb-6">
        {isFull && (
          <>
            <Separator />

            <div className="grid grid-cols-1 gap-4">
              <Field
                icon={Building2}
                label="Empresa"
                value={entry.company_name}
              />
              <Field icon={User} label="Motorista" value={entry.truck_driver} />
              <Field icon={IdCard} label="CPF" value={entry.truck_cpf} />
              <Field
                icon={Phone}
                label="Telefone"
                value={entry.truck_cellphone}
              />
              <Field
                icon={Package}
                label="Produto"
                value={entry.truck_product}
              />
              <Field
                icon={TruckIcon}
                label="Tipo de veículo"
                value={entry.truck_type}
              />
              <Field
                icon={Boxes}
                label="Tipo de carga"
                value={entry.truck_cargo_type}
              />
              <Field
                icon={ArrowLeftRight}
                label="Operação"
                value={entry.job ? JOB_LABELS[entry.job] : null}
              />
            </div>

            <Separator />

            <div className="space-y-3 rounded-xl bg-muted/40 p-4">
              <TimeRow label="Criado em" value={formatDate(entry.created_at)} />
              <TimeRow label="Chegada" value={formatDate(entry.arrival_time)} />
              <TimeRow
                label="Início operação"
                value={formatDate(entry.start_time)}
              />
              <TimeRow
                label="Aguardando NF"
                value={formatDate(entry.awaiting_conclusion_time)}
              />
              <TimeRow label="Fim" value={formatDate(entry.end_time)} />
              <TimeRow
                label="Última atualização"
                value={formatDate(entry.updated_at)}
              />
            </div>

            <div className="space-y-3 rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
              <TimeRow
                label="Tempo até chegada"
                value={formatDuration(entry.created_at, entry.arrival_time)}
              />
              <TimeRow
                label="Tempo em espera"
                value={formatDuration(entry.arrival_time, entry.start_time)}
              />
              <TimeRow
                label="Tempo em operação"
                value={formatDuration(
                  entry.start_time,
                  entry.awaiting_conclusion_time,
                )}
              />
              <TimeRow
                label="Tempo aguardando NF"
                value={formatDuration(
                  entry.awaiting_conclusion_time,
                  entry.end_time,
                )}
              />
              <TimeRow
                label="Tempo total"
                value={formatDuration(entry.created_at, entry.end_time)}
              />
            </div>

            <Separator />
          </>
        )}

        {entry.photo && (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border shadow-sm">
            <Image
              src={entry.photo}
              alt={`Foto do caminhão ${entry.truck_plate}`}
              fill
              className="object-cover"
              sizes="(max-width: 500px) 100vw, 448px"
            />
          </div>
        )}

        {isFull && entry.document_photo && (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border shadow-sm">
            <Image
              src={entry.document_photo}
              alt={`Foto do documento ${entry.truck_plate}`}
              fill
              className="object-cover"
              sizes="(max-width: 500px) 100vw, 448px"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-md bg-muted p-1.5 text-muted-foreground">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function TimeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-lg">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
