"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/hooks/auth";
import { getCsrfCookie } from "../actions/api/client/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    getCsrfCookie().then(() => initializeAuth());
  }, []);

  return children;
}
