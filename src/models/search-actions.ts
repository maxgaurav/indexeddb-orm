import {Aggregate} from "./aggregate.js";
import {BaseSearchActionsInterface, TransactionModes} from "./model.interface.js";
import {IDBResultEvent} from "../connection/idb-event.interface.js";

export abstract class SearchActions extends Aggregate implements BaseSearchActionsInterface {

  protected abstract loadRelations(results: any[]): Promise<any>[];

  protected abstract loadCustomRelations(results: any[]): Promise<any>[];

  /**
   * Returns list of all matching records.
   */
  public all<T>(): Promise<T[]>;
  public all(): Promise<any[]> {
    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    const request = this.request(objectStore);

    return new Promise<any[]>((resolve, reject) => {

      let results: any[] = [];
      request.addEventListener<'success'>("success", async (event) => {
        const cursor = (<IDBResultEvent>event).target.result as IDBCursorWithValue | undefined;

        if (cursor) {

          if (!this.allowedToProcess(cursor.value)) {
            return cursor.continue();
          }
          results.push(cursor.value);
          return cursor.continue();
        }

        if (results.length === 0 || this.relations.length === 0) {
          resolve(results);
        }

        const relations: Promise<any>[] = this.loadRelations(results);

        await Promise.all(relations);

        resolve(results);
      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });

  }

  /**
   * Returns fist matching record
   */
  public first<T>(): Promise<T>;
  public first(): Promise<any> {
    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    const request = this.request(objectStore);

    return new Promise<any[]>((resolve, reject) => {

      let result: any;
      request.addEventListener<'success'>("success", async (event) => {
        const cursor = (<IDBResultEvent>event).target.result as IDBCursorWithValue | undefined;

        if (cursor) {

          if (!this.allowedToProcess(cursor.value)) {
            return cursor.continue();
          }
          result = cursor.value;
        }

        if (!result || this.relations.length === 0) {
          resolve(result || null);
        }

        const relations: Promise<any>[] = this.loadRelations([result]);

        await Promise.all(relations);

        resolve(result);
      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  /**
   * Finds the record on primary key or returns null
   * @param id
   */
  public find<T>(id: any): Promise<T | null>;
  public find(id: any): Promise<any | null> {
    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    const request = objectStore.get(id);

    return new Promise<any[]>((resolve, reject) => {

      request.addEventListener<'success'>("success", async (event) => {
        const result = (event as IDBResultEvent).target.result;

        if (!result || this.relations.length === 0) {
          resolve(result || null);
        }

        const relations: Promise<any>[] = this.loadRelations([result]);

        await Promise.all(relations);

        resolve(result || null);
      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  /**
   * Finds value at index.
   * @param indexName
   * @param id
   */
  public findIndex<T>(indexName: string, id: any): Promise<T>;
  public findIndex(indexName: string, id: any): Promise<any> {

    this.resetBuilder();

    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    const request = objectStore.index(indexName).get(id);

    return new Promise<any[]>((resolve, reject) => {

      request.addEventListener<'success'>("success", async (event) => {
        const result = (event as IDBResultEvent).target.result;

        if (!result || this.relations.length === 0) {
          resolve(result || null);
        }

        const relations: Promise<any>[] = this.loadRelations([result]);

        await Promise.all(relations);

        resolve(result);
      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  /**
   * Finds all values for the index
   *
   * @param indexName
   * @param id
   */
  public findAllIndex<T>(indexName: string, id: any): Promise<T[]>;
  public findAllIndex(indexName: string, id: any): Promise<any[]> {
    this.resetBuilder();
    this.whereIndex(indexName, id);
    return this.all();
  }

}
