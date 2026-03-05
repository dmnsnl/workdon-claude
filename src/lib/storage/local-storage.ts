import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { FileStorage, StoredFile } from "@/lib/storage/types";

export class LocalFileStorage implements FileStorage {
  constructor(
    private readonly rootDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    )
  ) {}

  async save(file: File): Promise<StoredFile> {
    await mkdir(this.rootDir, { recursive: true });

    const ext = path.extname(file.name) || ".bin";
    const key = `${Date.now()}-${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const fullPath = path.join(this.rootDir, key);

    await writeFile(fullPath, buffer);

    return {
      key,
      url: `/uploads/${key}`,
    };
  }
}
