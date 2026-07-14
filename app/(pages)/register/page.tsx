import { RegisterForm } from "@/app/components/RegisterForm/RegisterForm";

export default async function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <RegisterForm />
    </div>
  );
}
