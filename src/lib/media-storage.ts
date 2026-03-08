import { mkdir, writeFile, stat, unlink } from "fs/promises";
import path from "path";

export const MEDIA_ROOT =
  process.env.MEDIA_UPLOAD_DIR ?? path.join(process.cwd(), "data", "uploads");

export const getStoragePath = (storageKey: string) => {
  return path.join(MEDIA_ROOT, storageKey);
};

export const createStorageKey = (
  agentId: string,
  uploadId: string,
  extension: string
) => {
  const safeExtension = extension.replace(/[^a-z0-9]/gi, "");
  return path.join(agentId, `${uploadId}.${safeExtension}`);
};

export const ensureStorageDir = async (storageKey: string) => {
  const fullPath = getStoragePath(storageKey);
  const dir = path.dirname(fullPath);
  await mkdir(dir, { recursive: true });
  return fullPath;
};

export const saveMediaFile = async (storageKey: string, data: Uint8Array) => {
  const fullPath = await ensureStorageDir(storageKey);
  await writeFile(fullPath, data);
  return fullPath;
};

export const getMediaFileSize = async (storageKey: string) => {
  const fullPath = getStoragePath(storageKey);
  const info = await stat(fullPath);
  return info.size;
};

export const deleteMediaFile = async (storageKey: string) => {
  const fullPath = getStoragePath(storageKey);
  try {
    await unlink(fullPath);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") {
      throw error;
    }
  }
};
