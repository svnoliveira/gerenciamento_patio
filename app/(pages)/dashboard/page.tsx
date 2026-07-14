import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";
import { IUser } from "@/app/interface/user/user";

export default async function Dashboard() {
  const meRes = await serverApiFetch("/me/");
  const user: IUser = await meRes.json();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">
        Bem-vindo, {user.name}
      </h1>

      {user.role === "COMPANY" && user.company && (
        <p className="text-lg text-muted-foreground">
          Empresa:{" "}
          <span className="font-semibold text-foreground">
            {user.company.name}
          </span>
        </p>
      )}

      {(user.role === "ADMIN" || user.role === "OPERATOR") && (
        <p className="text-lg text-muted-foreground">
          {user.role === "ADMIN" ? "Administrador" : "Operador"}
        </p>
      )}
    </div>
  );
}
