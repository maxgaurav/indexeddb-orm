import {ConnectorInterface} from "./connector.interface.js";
import {Database, MigrationInterface, TableSchema} from "../migration/migration.interface.js";
import {DBSuccessEvent, DBVersionChangeEvent} from "./idb-event.interface.js";
import {WindowInterface} from "../window.interface.js";
import {Migration} from "../migration/migration.js";
import {ModelInterface, ModelKeysInterface} from "../models/model.interface.js";
import {Model} from "../models/model.js";

declare const window: WindowInterface;


export class Connector implements ConnectorInterface {

  private dbOpenConnection: IDBOpenDBRequest | null = null;

  protected migration: Migration | null = null;

  protected database: IDBDatabase | null = null;

  public constructor(public migrationSchema: Database) {
  }

  /**
   * Create/Update and connect the database
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

  public destroy(): Promise<boolean> {
    const request = this.indexedDB().deleteDatabase(this.migrationSchema.name);
    return new Promise((resolve, reject) => {
      request.addEventListener('success', () => resolve(true));
      request.addEventListener('error', (e) => reject(e));
    });

  }

  public indexedDB(): IDBFactory {
    return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  }

  public async migrateHandler(event: DBVersionChangeEvent): Promise<boolean> {
    const migration = new Migration(this.migrationSchema.tables, event.target.result, event.target.transaction);
    this.migrationSchema.tables = await migration.run();
    return true;
  }

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
          return new Model(event.target.result, table, this);
        }
      });
    }

    return models;
  }

  public getMigration(): MigrationInterface | null {
    return this.migration;
  }

  public getDatabase(): IDBDatabase | null {
    return this.database;
  }
}
