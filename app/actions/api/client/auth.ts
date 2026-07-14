"use client";

import {
  ILoginPayload,
  IRegisterPayload,
  IUser,
} from "@/app/interface/user/user";
import { clientApiFetch } from "./clientApiFetch";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCsrfCookie = async () => {
  await fetch(`${API_URL}/csrf/`, { credentials: "include" });
};

export const registerRequest = async (data: IRegisterPayload) => {
  const res = await clientApiFetch(`/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = await getApiErrorMessage(res, "Registro falhou.");
    throw new Error(message);
  }
};

export const loginRequest = async (data: ILoginPayload) => {
  const res = await clientApiFetch("/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = await getApiErrorMessage(res, "Login falhou.");
    throw new Error(message);
  }
};

export const getMe = async (): Promise<IUser> => {
  const res = await clientApiFetch("/me/");

  if (!res.ok) {
    const message = await getApiErrorMessage(res, "Não autênticado.");
    throw new Error(message);
  }

  return res.json();
};

export const refreshRequest = async (): Promise<boolean> => {
  const res = await clientApiFetch(`/refresh/`, {
    method: "POST",
  });
  return res.ok;
};

export const logoutRequest = async () => {
  await clientApiFetch(`/logout/`, {
    method: "POST",
  });
};
