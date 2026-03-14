import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import { and, eq } from "drizzle-orm";
import { get as getBlob } from "@vercel/blob";

import { db } from "@/db";
import { mediaUploads } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  getBlobAccessMode,
  getStoragePath,
} from "@/lib/media-storage";

export const runtime = "nodejs";

interface Params {
  params: Promise<{
    uploadId: string;
  }>;
}

const parseRange = (rangeHeader: string, size: number) => {
  const matches = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!matches) return null;
  const start = matches[1] ? Number(matches[1]) : 0;
  const end = matches[2] ? Number(matches[2]) : size - 1;
  if (Number.isNaN(start) || Number.isNaN(end) || start > end) return null;
  return { start, end };
};

export async function GET(req: NextRequest, { params }: Params) {
  const { uploadId } = await params;
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const [upload] = await db
    .select()
    .from(mediaUploads)
    .where(and(eq(mediaUploads.id, uploadId), eq(mediaUploads.userId, session.user.id)));

  if (!upload || !upload.storageKey) {
    return NextResponse.json(
      { error: "Media asset not found." },
      { status: 404 }
    );
  }

  const isBlobStorageKey =
    upload.storageKey.startsWith("http://") ||
    upload.storageKey.startsWith("https://");

  if (isBlobStorageKey) {
    const range = req.headers.get("range");
    const accessMode = getBlobAccessMode();
    const blobResult = await getBlob(upload.storageKey, {
      access: accessMode,
      useCache: accessMode === "public",
      headers: range ? { Range: range } : undefined,
    });

    if (!blobResult || !blobResult.stream) {
      return NextResponse.json(
        { error: "Media asset not found." },
        { status: 404 }
      );
    }

    const responseHeaders = new Headers();
    const contentType =
      blobResult.blob.contentType ?? upload.mime ?? "application/octet-stream";
    responseHeaders.set("Content-Type", contentType);

    const contentLength = blobResult.headers.get("content-length");
    if (contentLength) responseHeaders.set("Content-Length", contentLength);

    const contentRange = blobResult.headers.get("content-range");
    if (contentRange) responseHeaders.set("Content-Range", contentRange);

    const acceptRanges = blobResult.headers.get("accept-ranges");
    if (acceptRanges) responseHeaders.set("Accept-Ranges", acceptRanges);

    responseHeaders.set("Cache-Control", "private, max-age=600");

    return new NextResponse(blobResult.stream, {
      status: contentRange ? 206 : 200,
      headers: responseHeaders,
    });
  }

  const filePath = getStoragePath(upload.storageKey);
  const fileStat = await stat(filePath);
  const size = fileStat.size;
  const range = req.headers.get("range");
  const mime = upload.mime ?? "application/octet-stream";

  if (range) {
    const parsed = parseRange(range, size);
    if (!parsed) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${size}`,
        },
      });
    }

    const { start, end } = parsed;
    const stream = createReadStream(filePath, { start, end });
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        "Content-Type": mime,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=600",
      },
    });
  }

  const stream = createReadStream(filePath);
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=600",
    },
  });
}
