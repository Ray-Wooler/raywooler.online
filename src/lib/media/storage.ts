import "server-only";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getEnv } from "@/lib/env";

function storagePath(key: string) {
  if (!/^[0-9a-f-]{36}\.(png|jpg|webp)$/.test(key)) {
    throw new Error("Invalid media storage key");
  }
  return path.join(path.resolve(getEnv().MEDIA_DIR), key);
}

export async function saveMedia(key: string, bytes: Buffer) {
  const filePath = storagePath(key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(
    path.join(/*turbopackIgnore: true*/ path.dirname(filePath), path.basename(filePath)),
    bytes,
    {
      flag: "wx",
      mode: 0o640,
    },
  );
}

export async function removeMedia(key: string) {
  await unlink(storagePath(key));
}

export async function loadMedia(key: string) {
  return readFile(storagePath(key));
}
