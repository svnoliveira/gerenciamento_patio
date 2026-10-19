export const DOCUMENT_FILE_ACCEPT = ".pdf,.doc,.docx,.txt";
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

export const DOCUMENT_FILE_MAX_MB = 15;

export function validateDocumentFile(file: File): string | null {
  const dot = file.name.lastIndexOf(".");
  const extension = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return "Tipo de arquivo não permitido. Use PDF, DOC, DOCX ou TXT.";
  }
  if (file.size > DOCUMENT_FILE_MAX_MB * 1024 * 1024) {
    return `O arquivo não pode ser maior que ${DOCUMENT_FILE_MAX_MB} MB.`;
  }
  return null;
}
