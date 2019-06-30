import {MigrationInterface, TableColumn, TableSchema} from "./migration.interface.js";

export class Migration implements MigrationInterface {
  constructor(public tables: TableSchema[], public db: IDBDatabase, public transaction: IDBTransaction | null) {
  }

  public async run(): Promise<TableSchema[]> {
    for (const table of this.tables) {
      if (!this.db.objectStoreNames.contains(table.name)) {
        table.objectStore = this.createObjectStore(table);

      } else {
        table.objectStore = (this.transaction as IDBTransaction).objectStore(table.name);
      }

      this.createColumns(table, table.objectStore);
      this.dropOldColumns(table, table.objectStore);
    }

    for (const tableName of this.allStoreNames()) {
      if (!this.tables.find(table => table.name === tableName)) {
        this.db.deleteObjectStore(tableName);
      }
    }

    return this.tables;
  }

  public createIndex(column: TableColumn, objectStore: IDBObjectStore): IDBIndex {
    const attributes = column.attributes || {};
    const index = column.index || column.name;
    return objectStore.createIndex(column.name, index, attributes);
  }

  public dropIndex(column: string, objectStore: IDBObjectStore): boolean {
    objectStore.deleteIndex(column);

    return true;
  }

  public createObjectStore(schema: TableSchema): IDBObjectStore {
    let primary = schema.primary || '_id';

    return this.db.createObjectStore(schema.name, {
      keyPath: primary,
      autoIncrement: true
    });
  }

  public dropObjectStore(schema: TableSchema): boolean {
    return true;
  }

  protected createColumns(table: TableSchema, objectStore: IDBObjectStore) {
    for (const column of table.columns) {

      if (!objectStore.indexNames.contains(column.name)) {
        column.dbIndex = this.createIndex(column, objectStore);
      }
    }
  }

  protected dropOldColumns(table: TableSchema, objectStore: IDBObjectStore) {
    const indexNames = objectStore.indexNames;
    for (let i = 0; i < indexNames.length; i++) {
      if (!table.columns.find(column => column.name === indexNames[i])) {
        this.dropIndex(indexNames[i], objectStore);
      }
    }

  }

  private allStoreNames(): string[] {
    const names: string[] = [];

    for (let i = 0; i < this.db.objectStoreNames.length; i++) {
      names.push(this.db.objectStoreNames[i]);
    }

    return names;
  }

  public listObjectStores(): IDBObjectStore[] {
    const stores: IDBObjectStore[] = [];
    for (const tableName of this.allStoreNames()) {
      stores.push((this.transaction as IDBTransaction).objectStore(tableName));
    }

    return stores;
  }
}
