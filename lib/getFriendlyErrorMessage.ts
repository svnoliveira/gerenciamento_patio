export function getFriendlyErrorMessage(
  status: number,
  fallbackDetail?: string,
): string {
  if (status === 401) {
    return "Sua sessão expirou. Faça login novamente.";
  }
  if (status === 403) {
    return "Você não tem permissão para realizar esta ação.";
  }
  if (status === 404) {
    return "Registro não encontrado.";
  }
  if (status >= 500) {
    return "Ocorreu um erro inesperado no servidor. Tente novamente em instantes.";
  }

  return fallbackDetail ?? "Ocorreu um erro inesperado.";
}
