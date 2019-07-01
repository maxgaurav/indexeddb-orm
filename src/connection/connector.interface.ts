import {MigrationInterface} from "../migration/migration.interface.js";
import {ModelKeysInterface, TransactionModes} from "../models/model.interface.js";

export interface ConnectorInterface {

  connect(): Promise<ModelKeysInterface>;

  destroy(databaseName: string): Promise<boolean>;

  indexedDB(): IDBFactory;

  getMigration(): MigrationInterface | null;

  getDatabase(): IDBDatabase | null;

  openTransaction(mode: TransactionModes): { models: ModelKeysInterface, transaction: IDBTransaction };
}

