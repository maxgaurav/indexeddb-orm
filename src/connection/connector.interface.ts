export interface ConnectorInterface {
  dbOpenConnection: IDBOpenDBRequest | null;

  connect(): Promise<any>;

  destroy(): Promise<boolean>;

  indexedDB(): IDBFactory;
}


