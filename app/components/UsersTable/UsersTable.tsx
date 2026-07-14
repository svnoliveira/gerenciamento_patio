import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { IPaginatedUsers, IUser, ROLE_LABELS } from "@/app/interface/user/user";
import { cn } from "@/lib/utils";

export function UsersTable({
  data,
  selectedId,
  onSelect,
}: {
  data: IPaginatedUsers | null;
  selectedId: number | null;
  onSelect: (user: IUser) => void;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Posição</TableHead>
            <TableHead>Empresa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data?.results.map((user) => (
              <TableRow
                key={user.id}
                className={cn(
                  "cursor-pointer",
                  selectedId === user.id && "bg-muted",
                )}
                onClick={() => onSelect(user)}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{ROLE_LABELS[user.role] ?? user.role}</TableCell>
                <TableCell>{user.company?.name ?? "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
