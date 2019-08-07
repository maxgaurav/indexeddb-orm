import {ConnectorInterface} from "./connector.interface.js";
import {Database, MigrationInterface, TableSchema} from "../migration/migration.interface.js";
import {DBSuccessEvent, DBVersionChangeEvent} from "./idb-event.interface.js";
import {Migration} from "../migration/migration.js";
import {ModelInterface, ModelKeysInterface, TransactionModes} from "../models/model.interface.js";
import {Model} from "../models/model.js";

/**
 *
 */
export class Connector implements ConnectorInterface {

  /**
   * Database open request
   */
  private dbOpenConnection: IDBOpenDBRequest | null = null;

  /**
   * Migration builder instance
   */
  protected migration: Migration | null = null;

  /**
   * IndexedDB Database instance
   */
  protected database: IDBDatabase | null = null;

  public constructor(public migrationSchema: Database) {
  }

  /**
   * Create/Update and connects the database
   */
  public connect(): Promise<ModelKeysInterface> {
    this.dbOpenConnection = this.indexedDB().open(this.migrationSchema.name, this.migrationSchema.version);

    return new Promise((resolve, reject) => {

      if (this.dbOpenConnection === null) {
        throw new Error('Database connection did not open');
      }

      this.dbOpenConnection.addEventListener('success', (event) => {
        const models = this.completeHandler(event as DBSuccessEvent);
        resolve(models);
      });

      this.dbOpenConnection.addEventListener('error', (event) => {
        reject(event);
      });

      this.dbOpenConnection.addEventListener('upgradeneeded', async (event) => {
        await this.migrateHandler(event as DBVersionChangeEvent);
      });
    });
  }

  /**
   * Deletes the database
   */
  public destroy(databaseName: string): Promise<boolean> {
    const request = this.indexedDB().deleteDatabase(databaseName);
    return new Promise((resolve, reject) => {
      request.addEventListener('success', () => resolve(true));
      request.addEventListener('error', (e) => reject(e));
    });

  }

  /**
   * Returns the IDBFactory.
   */
  public indexedDB(): IDBFactory {
    const idb = indexedDB || self.indexedDB || (self as any).mozIndexedDB || (self as any).webkitIndexedDB || (self as any).msIndexedDB;
    if (!idb) {
      throw new Error("IndexedDB constructor not found in environment");
    }

    return idb;
  }

  /**
   * Called when database version is updated. Runs migrations to update schema structure
   * @param event
   */
  public async migrateHandler(event: DBVersionChangeEvent): Promise<boolean> {
    const migration = new Migration(this.migrationSchema.tables, event.target.result, event.target.transaction);
    this.migrationSchema.tables = await migration.run();
    return true;
  }

  /**
   * Called when connection to database is successful. Creates various models for the tables.
   * @param event
   */
  protected completeHandler(event: DBSuccessEvent): { [key: string]: ModelInterface } {
    const storeNames = this.migrationSchema.tables.map(table => table.name);
    const transaction = event.target.transaction || event.target.result.transaction(storeNames);
    this.database = event.target.result;

    const migration = new Migration(this.migrationSchema.tables, event.target.result, transaction);
    this.migration = migration;

    const stores = migration.listObjectStores();
    const models: { [key: string]: ModelInterface } = {};

    for (const store of stores) {
      const table = <TableSchema>this.migrationSchema.tables.find(schema => schema.name === store.name);


      Object.defineProperty(models, store.name, {
        get: () => {

          if (table.ormClass) {
            return new table.ormClass(event.target.result, table, this);
          } else {
            return new Model(event.target.result, table, this);
          }
        }
      });
    }

    return models;
  }

  /**
   * Returns migration instance
   */
  public getMigration(): MigrationInterface | null {
    return this.migration;
  }

  /**
   * Returns database instance
   */
  public getDatabase(): IDBDatabase | null {
    return this.database;
  }

  /**
   * Opens a transaction to allow fine control on commits.
   * @param mode
   */
  public openTransaction(mode: TransactionModes): {models: ModelKeysInterface, transaction: IDBTransaction} {
    if (this.database === null) {
      throw new Error('First initialize the connection using connect.');
    }

    const transaction = this.database.transaction(this.migrationSchema.tables.map(table => table.name));

    const models: { [key: string]: ModelInterface } = {};

    for (const table of this.migrationSchema.tables) {

      Object.defineProperty(models, table.name, {
        get: () => {
          const model = new Model(<IDBDatabase>this.database, table, this);
          model.setTransaction(transaction);
          return model;
        }
      });
    }

    return {models, transaction};
  }
}
