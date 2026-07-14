"use client";

import { toast } from "sonner";
import {
  getMe,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "../actions/api/client/auth";

import { useUserStore } from "../stores/useUserStore";
import { ILoginPayload, IRegisterPayload } from "../interface/user/user";

export function useAuth() {
  const { user, setUser } = useUserStore();

  const register = async (data: IRegisterPayload) => {
    try {
      await registerRequest(data);
      toast("Registrado com sucesso! Faça login para continuar.");
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registro falhou";
      toast(message);
      return false;
    }
  };

  const login = async (data: ILoginPayload) => {
    try {
      await loginRequest(data);
      const userData = await getMe();
      setUser(userData);
      toast("Logado com sucesso!");
      return true;
    } catch (error: unknown) {
      console.log(error);
      toast("Login falhou");
      return false;
    }
  };

  const initializeAuth = async () => {
    try {
      const userData = await getMe();
      if (userData) {
        setUser(userData);
      }
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await logoutRequest();
    toast("Desconectado");
    setUser(null);
  };

  return { user, login, logout, initializeAuth, register };
}
