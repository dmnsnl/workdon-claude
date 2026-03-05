export type StoredFile = {
  url: string;
  key: string;
};

export interface FileStorage {
  save(file: File): Promise<StoredFile>;
}
