import type { FileStorage } from "@/lib/storage/types";
import { LocalFileStorage } from "@/lib/storage/local-storage";

let storage: FileStorage | null = null;

export function getStorage(): FileStorage {
  if (!storage) {
    // Replace with S3/R2 adapter in production when needed.
    storage = new LocalFileStorage();
  }
  return storage;
}
