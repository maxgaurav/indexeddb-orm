import {DEFAULT_SYNC_COLUMN_NAME, MigrationInterface, TableColumn, TableSchema} from "./migration.interface.js";
import {DEFAULT_PRIMARY_ID} from "../models/model.interface.js";

export class Migration implements MigrationInterface {
  constructor(public tables: TableSchema[], public db: IDBDatabase, public transaction: IDBTransaction | null) {
  }

  /**
   * Runs the migration action to update the database with new stores or deletes unwanted stored and then creates or
   * drops indexes for the stores.
   */
  public async run(): Promise<TableSchema[]> {
    for (const table of this.tables) {
      if (!this.db.objectStoreNames.contains(table.name)) {
        table.objectStore = this.createObjectStore(table);

      } else {
        table.objectStore = (this.transaction as IDBTransaction).objectStore(table.name);
      }

      this.createColumns(table, table.objectStore);
      this.dropOldColumns(table, table.objectStore);
      this.setupSyncColumn(table, table.objectStore);
    }

    for (const tableName of this.allStoreNames()) {
      if (!this.tables.find(table => table.name === tableName)) {
        this.db.deleteObjectStore(tableName);
      }
    }

    return this.tables;
  }

  /**
   * Creates an index in object store
   * @param column
   * @param objectStore
   */
  public createIndex(column: TableColumn, objectStore: IDBObjectStore): IDBIndex {
    const attributes = column.attributes || {};
    const index = column.index || column.name;
    return objectStore.createIndex(column.name, index, attributes);
  }

  /**
   * Drops an index in object store
   * @param column
   * @param objectStore
   */
  public dropIndex(column: string, objectStore: IDBObjectStore): boolean {
    objectStore.deleteIndex(column);

    return true;
  }

  /**
   * Creates new object store
   * @param schema
   */
  public createObjectStore(schema: TableSchema): IDBObjectStore {
    let primary = schema.primary || DEFAULT_PRIMARY_ID;

    return this.db.createObjectStore(schema.name, {
      keyPath: primary,
      autoIncrement: true
    });
  }

  /**
   * Drops existing object store
   * @param schema
   */
  public dropObjectStore(schema: TableSchema): boolean {
    return true;
  }

  /**
   * Creates various indexes on object store
   * @param table
   * @param objectStore
   */
  protected createColumns(table: TableSchema, objectStore: IDBObjectStore) {
    for (const column of table.columns) {

      if (!objectStore.indexNames.contains(column.name)) {
        column.dbIndex = this.createIndex(column, objectStore);
      }
    }
  }

  /**
   * Drops indexes in object store
   * @param table
   * @param objectStore
   */
  protected dropOldColumns(table: TableSchema, objectStore: IDBObjectStore) {
    const indexNames = objectStore.indexNames;
    for (let i = 0; i < indexNames.length; i++) {
      if (!table.columns.find(column => column.name === indexNames[i])) {
        this.dropIndex(indexNames[i], objectStore);
      }
    }

  }

  /**
   * Returns a list of all object store names which are in current database
   */
  private allStoreNames(): string[] {
    const names: string[] = [];

    for (let i = 0; i < this.db.objectStoreNames.length; i++) {
      names.push(this.db.objectStoreNames[i]);
    }

    return names;
  }

  /**
   * Returns all object store instances in database
   */
  public listObjectStores(): IDBObjectStore[] {
    const stores: IDBObjectStore[] = [];
    for (const tableName of this.allStoreNames()) {
      stores.push((this.transaction as IDBTransaction).objectStore(tableName));
    }

    return stores;
  }

  /**
   * Returns true if column is to be created
   * @param schema
   * @param objectStore
   */
  public setupSyncColumn(schema: TableSchema, objectStore: IDBObjectStore): void {
    const columnName = schema.syncColumnName || DEFAULT_SYNC_COLUMN_NAME;

    if (schema.syncColumn) {
      if (!objectStore.indexNames.contains(columnName)) {
        this.createIndex({
          name: columnName,
          index: columnName
        }, objectStore);
      }

    } else {
      if (objectStore.indexNames.contains(columnName)) {
        this.dropIndex(columnName, objectStore);
      }
    }
  }
}
