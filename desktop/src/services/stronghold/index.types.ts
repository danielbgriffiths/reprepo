export interface StrongholdService {
  insert: (key: string, value: string) => Promise<void>;
  read: (key: string) => Promise<string | undefined>;
  save: () => Promise<void>;
  remove: (key: string) => Promise<void>;
}
