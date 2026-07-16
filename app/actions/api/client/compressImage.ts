import imageCompression from "browser-image-compression";

export async function compressImage(file: File, plate: string): Promise<File> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

  const extension = getFileExtension(file.name, compressed.type);
  const filename = buildPhotoFilename(plate, extension);

  return new File([compressed], filename, {
    type: compressed.type || file.type,
    lastModified: Date.now(),
  });
}

function getFileExtension(originalName: string, mimeType: string): string {
  const fromName = originalName.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();

  const fromMime = mimeType.split("/").pop();
  return fromMime ? fromMime.toLowerCase() : "jpg";
}

function buildPhotoFilename(plate: string, extension: string): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  const datetime = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");

  const safePlate =
    plate.replace(/[^A-Z0-9]/gi, "").toUpperCase() || "SEMPLACA";

  return `${safePlate}-${datetime}.${extension}`;
}
