import {MigrationInterface} from "../migration/migration.interface.js";

export interface ConnectorInterface {

  connect(): Promise<any>;

  destroy(): Promise<boolean>;

  indexedDB(): IDBFactory;

  getMigration(): MigrationInterface | null;

  getDatabase(): IDBDatabase | null;
}

