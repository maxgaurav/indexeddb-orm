import { ModelConstructorInterface } from "../models/model.interface.js";
export declare const DEFAULT_SYNC_COLUMN_NAME = "syncOn";
export interface MigrationInterface {
    run(): Promise<TableSchema[]>;
    createObjectStore(schema: TableSchema): IDBObjectStore;
    dropObjectStore(schema: TableSchema): boolean;
    createIndex(column: TableColumn, objectStore: IDBObjectStore): IDBIndex;
    dropIndex(column: string, objectStore: IDBObjectStore): boolean;
    listObjectStores(): IDBObjectStore[];
    setupSyncColumn(schema: TableSchema, objectStore: IDBObjectStore): void;
}
export interface TableColumn {
    name: string;
    index: string[] | string;
    attributes?: IDBIndexParameters;
    dbIndex?: IDBIndex | null;
}
export interface TableSchema {
    name: string;
    columns: TableColumn[];
    ormClass?: ModelConstructorInterface;
    primary?: string;
    objectStore?: IDBObjectStore | null;
    syncColumn?: boolean;
    syncColumnName?: string;
}
export interface Database {
    name: string;
    version: number;
    tables: TableSchema[];
}
