import {AggregateInterface, IndexBuilder, QueryTypes, TransactionModes} from "./model.interface.js";
import {TableSchema} from "../migration/migration.interface.js";
import {QueryBuilder} from "./query-builder.js";
import {IDBResultEvent} from "../connection/idb-event.interface.js";

export abstract class Aggregate extends QueryBuilder implements AggregateInterface {

  public constructor(public db: IDBDatabase, public table: TableSchema) {
    super();
  }

  protected abstract request(objectStore: IDBObjectStore): IDBRequest;

  protected abstract getTransaction(stores: string[], mode: TransactionModes, overwrite?: boolean): IDBTransaction;

  public count(): Promise<number> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    let request: IDBRequest;

    if (this.builder.length === 0 && this.indexBuilder === null) {
      request = objectStore.count();
    } else if (this.builder.length === 0 && this.indexBuilder !== null) {
      request = objectStore.count(this.keyRange(<IndexBuilder>this.indexBuilder));
    } else {
      request = this.request(objectStore);
    }

    return new Promise<number>((resolve, reject) => {
      let count = 0;
      request.addEventListener<'success'>("success", async (event) => {
        if (this.builder.length === 0) {
          return resolve((event as IDBResultEvent).target.result);
        }

        const cursor = (<IDBResultEvent>event).target.result as IDBCursorWithValue | undefined;

        if (cursor) {

          if (!this.allowedToProcess(cursor.value)) {
            return cursor.continue();
          }
          count++;
          return cursor.continue();
        }

        resolve(count);

      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  public average(attribute: string): Promise<number> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    const request = this.request(objectStore);

    return new Promise<number>((resolve, reject) => {
      let count = 0;
      let total = 0;
      request.addEventListener<'success'>("success", async (event) => {
        const cursor = (<IDBResultEvent>event).target.result as IDBCursorWithValue | undefined;

        if (cursor) {

          if (!this.allowedToProcess(cursor.value)) {
            return cursor.continue();
          }
          if (!isNaN(parseFloat(cursor.value[attribute]))) {
            total += parseFloat(cursor.value[attribute]);
            count++;
          }

          return cursor.continue();
        }

        resolve(total / count);

      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }


  public reduce(func: (value: any, result: any) => any, defaultCarry: any): Promise<any>;
  public reduce<T>(func: (value: any, result: any) => any, defaultCarry: any): Promise<T>;
  public reduce<T extends any, U extends any>(func: (value: U, result: any) => any, defaultCarry: any): Promise<T> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    const request = this.request(objectStore);

    return new Promise<T>((resolve, reject) => {
      let result = defaultCarry;
      request.addEventListener<'success'>("success", async (event) => {
        const cursor = (<IDBResultEvent>event).target.result as IDBCursorWithValue | undefined;

        if (cursor) {

          if (!this.allowedToProcess(cursor.value)) {
            return cursor.continue();
          }

          result = func(cursor.value, result);
          return cursor.continue();
        }

        resolve(result);

      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }
}
