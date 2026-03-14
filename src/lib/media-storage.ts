import { mkdir, writeFile, stat, unlink } from "fs/promises";
import path from "path";
import { del, put } from "@vercel/blob";

const isServerlessRuntime =
  process.env.VERCEL === "1" || process.cwd().startsWith("/var/task");

const DEFAULT_MEDIA_ROOT = isServerlessRuntime
  ? "/tmp/talkai-uploads"
  : path.join(process.cwd(), "data", "uploads");

export const MEDIA_ROOT =
  process.env.MEDIA_UPLOAD_DIR ?? DEFAULT_MEDIA_ROOT;

const isBlobStorageEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const getStoragePath = (storageKey: string) => {
  return path.join(MEDIA_ROOT, storageKey);
};

export const createStorageKey = (
  agentId: string,
  uploadId: string,
  extension: string
) => {
  const safeExtension = extension.replace(/[^a-z0-9]/gi, "");
  return path.posix.join("agents", agentId, `${uploadId}.${safeExtension}`);
};

export const ensureStorageDir = async (storageKey: string) => {
  const fullPath = getStoragePath(storageKey);
  const dir = path.dirname(fullPath);
  await mkdir(dir, { recursive: true });
  return fullPath;
};

export const saveMediaFile = async (storageKey: string, data: Uint8Array) => {
  if (isBlobStorageEnabled) {
    const uploaded = await put(storageKey, data, {
      access: "public",
      addRandomSuffix: false,
    });

    return {
      storageKey: uploaded.url,
      url: uploaded.url,
    };
  }

  const fullPath = await ensureStorageDir(storageKey);
  await writeFile(fullPath, data);
  return {
    storageKey,
    url: null,
  };
};

export const getMediaFileSize = async (storageKey: string) => {
  const fullPath = getStoragePath(storageKey);
  const info = await stat(fullPath);
  return info.size;
};

export const deleteMediaFile = async (storageKey: string) => {
  if (isBlobStorageEnabled) {
    try {
      await del(storageKey);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("404") || message.includes("not found")) {
        return;
      }
      throw error;
    }
  }

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
