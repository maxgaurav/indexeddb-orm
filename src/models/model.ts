import {
  IndexBuilder,
  ModelInterface,
  RelationTypes,
  TransactionModes
} from "./model.interface.js";
import {Aggregate} from "./aggregate.js";
import {TableSchema} from "../migration/migration.interface.js";
import {IDBResultEvent} from "../connection/idb-event.interface.js";
import {Connector} from "../connection/connector.js";
import {HasOne} from "../relations/has-one.js";
import {HasMany} from "../relations/has-many.js";
import {HasManyMulti} from "../relations/has-many-multi.js";
import {HasManyThroughMulti} from "../relations/has-many-through-multi.js";
import {mergeDeep as _mergeDeep} from "../utils.js";

export class Model extends Aggregate implements ModelInterface {

  private transaction: IDBTransaction | null = null;

  public constructor(public db: IDBDatabase, public table: TableSchema, public connector: Connector) {
    super(db, table);
  }

  public get<T>(): Promise<T[]>;
  public get(): Promise<any[]> {
    const tables = this.relationTables(this.relations).concat(this.table.name);
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

  public first<T>(): Promise<T>;
  public first(): Promise<any> {
    const tables = this.relationTables(this.relations).concat(this.table.name);
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

        if (result || this.relations.length === 0) {
          resolve(result || null);
        }

        const relations: Promise<any>[] = this.loadRelations([result]);

        await Promise.all(relations);

        resolve(result);
      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  public find<T>(id: any): Promise<T>;
  public find(id: any): Promise<any> {
    const tables = this.relationTables(this.relations).concat(this.table.name);
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    const request = objectStore.get(id);

    return new Promise<any[]>((resolve, reject) => {

      request.addEventListener<'success'>("success", async (event) => {
        const result = (event as IDBResultEvent).target.result;

        if (result || this.relations.length === 0) {
          resolve(result || null);
        }

        const relations: Promise<any>[] = this.loadRelations([result]);

        await Promise.all(relations);

        resolve(result);
      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  public findIndex<T>(indexName: string, id: any): Promise<T>;
  public findIndex(indexName: string, id: any): Promise<any> {
    const tables = this.relationTables(this.relations).concat(this.table.name);
    const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
    const objectStore = transaction.objectStore(this.table.name);
    const request = objectStore.index(indexName).get(id);

    return new Promise<any[]>((resolve, reject) => {

      let result: any;
      request.addEventListener<'success'>("success", async (event) => {
        const result = (event as IDBResultEvent).target.result;

        if (result || this.relations.length === 0) {
          resolve(result || null);
        }

        const relations: Promise<any>[] = this.loadRelations([result]);

        await Promise.all(relations);

        resolve(result);
      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  public create<T>(data: any): Promise<T>;
  public create(data: any): Promise<any> {
    const tables = this.relationTables(this.relations).concat(this.table.name);
    const transaction = this.getTransaction(tables, TransactionModes.Write);
    const objectStore = transaction.objectStore(this.table.name);

    const request = objectStore.add(data);

    return new Promise<any[]>((resolve, reject) => {
      request.addEventListener<'success'>("success", (event) => {
        data[this.primaryId] = (event as IDBResultEvent).target.result;
        resolve(data);
      });
      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  public createMultiple<T>(entries: any[]): Promise<T[]>;
  public createMultiple(entries: any[]): Promise<any[]> {
    const tables = this.relationTables(this.relations).concat(this.table.name);
    const transaction = this.getTransaction(tables, TransactionModes.Write);
    const objectStore = transaction.objectStore(this.table.name);

    const promises: Promise<any>[] = [];
    for (const entry of entries) {
      const promise = new Promise<any[]>((resolve, reject) => {
        const request = objectStore.add(entry);
        request.addEventListener<'success'>("success", (event) => {
          entry[this.primaryId] = (event as IDBResultEvent).target.result;
          resolve(entry);
        });
        request.addEventListener<'error'>("error", (error) => {
          reject(error);
          transaction.abort();
        });
      });

      promises.push(promise);
    }

    return Promise.all(promises);
  }

  public destroy(): Promise<boolean> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.Write);
    const objectStore = transaction.objectStore(this.table.name);
    let request: IDBRequest;

    if (this.builder.length === 0 && this.indexBuilder === null) {
      throw new Error('Deletion without builder is not allowed. Call truncate if you want to delete all records.');
    }

    if (this.builder.length === 0 && this.indexBuilder !== null && this.primaryId === this.indexBuilder.index) {
      request = objectStore.delete(this.keyRange(this.indexBuilder));
    } else {
      request = this.request(objectStore);
    }

    return new Promise<boolean>((resolve, reject) => {
      const deletePromises: Promise<any>[] = [];
      request.addEventListener<'success'>("success", async (event) => {
        if (this.builder.length === 0 && this.indexBuilder !== null && this.primaryId === this.indexBuilder.index) {
          return resolve(true);
        }

        const cursor = (<IDBResultEvent>event).target.result as IDBCursorWithValue | undefined;

        if (cursor) {

          if (!this.allowedToProcess(cursor.value)) {
            return cursor.continue();
          }

          deletePromises.push(this.delete(cursor.value[this.primaryId]));
          return cursor.continue();
        }

        await Promise.all(deletePromises);
        resolve(true);

      });

      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  public async delete(id: any): Promise<boolean> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.Write);
    const objectStore = transaction.objectStore(this.table.name);
    const request = objectStore.delete(id);

    return new Promise<boolean>((resolve, reject) => {
      request.addEventListener<'success'>("success", () => resolve(true));
      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  public deleteIndex(indexName: string, value: any, isMulti: boolean = false): Promise<boolean> {
    this.indexBuilder = null;
    this.builder = [];
    if (isMulti) {
      this.whereIndex(indexName, value);
    } else {
      this.whereMultiIndexIn(indexName, [value]);
    }
    return this.destroy();
  }

  /**
   * @deprecated
   * @param id
   */
  public destroyId(id: any): Promise<boolean> {
    return this.delete(id);
  }

  public update(data: any): Promise<number> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.Write);
    const objectStore = transaction.objectStore(this.table.name);
    const request = this.request(objectStore);

    return new Promise<number>((resolve, reject) => {
      let totalUpdatedRecords = 0;
      const updatePromises: Promise<any>[] = [];
      request.addEventListener<'success'>('success', async (event) => {
        const cursor = (<IDBResultEvent>event).target.result as IDBCursorWithValue | undefined;

        if (cursor) {
          if (!this.allowedToProcess(cursor.value)) {
            return cursor.continue();
          }
          updatePromises.push(this.save(cursor.value[this.primaryId], data));
          totalUpdatedRecords++;
          cursor.continue();
        }

        await Promise.all(updatePromises);
        resolve(totalUpdatedRecords);
      });

      request.addEventListener<'error'>('error', (event) => reject(event));
    });
  }

  public async save(id: any, data: any, mergeDeep: boolean = true): Promise<any> {

    const record = await this.find<any>(id);

    if (!record) {
      return Promise.reject('No record found.');
    }

    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.Write, true);
    const objectStore = transaction.objectStore(this.table.name);
    const saveData = mergeDeep ? _mergeDeep(record, data) : data;
    saveData[this.primaryId] = id;
    const request = objectStore.put(saveData);

    return new Promise<boolean>((resolve, reject) => {
      request.addEventListener<'success'>("success", () => {
        resolve(true);
      });
      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  public getTransaction(stores: string[], mode: TransactionModes, overwrite: boolean = false): IDBTransaction {
    if (this.transaction === null || overwrite) {
      this.transaction = this.createTransaction(stores, mode);
    }
    return this.transaction;
  }

  public setTransaction(transaction: IDBTransaction): void {
    this.transaction = transaction;
  }

  public createTransaction(stores: string[], mode: TransactionModes): IDBTransaction {
    const transaction = this.db.transaction(stores, mode);
    this.setTransaction(transaction);

    return transaction;
  }

  protected request(object: IDBObjectStore): IDBRequest {
    const direction = this.cursor || undefined;

    if (this.indexBuilder) {
      const keyRange = this.keyRange(this.indexBuilder);
      const cursor = this.indexBuilder.index !== this.primaryId ? object.index(this.indexBuilder.index) : object;
      return cursor.openCursor(keyRange, direction);
    } else {
      return object.openCursor(undefined, direction);
    }

  }

  protected loadRelations(results: any[]): Promise<any>[] {
    const relationsArray: Promise<any>[] = [];

    for (const relation of this.relations) {
      let loader: HasOne | HasMany | HasManyMulti | HasManyThroughMulti;
      switch (relation.type) {
        case RelationTypes.HasOne:
          loader = new HasOne(this.db, this.connector, this, relation);
          relationsArray.push(loader.get(results));
          break;
        case RelationTypes.HasMany:
          loader = new HasMany(this.db, this.connector, this, relation);
          relationsArray.push(loader.get(results));
          break;
        case RelationTypes.HasManyMultiEntry:
          loader = new HasManyMulti(this.db, this.connector, this, relation);
          relationsArray.push(loader.get(results));
          break;
        case RelationTypes.HasManyThroughMultiEntry:
          loader = new HasManyThroughMulti(this.db, this.connector, this, relation);
          relationsArray.push(loader.get(results));
          break;
        default:
          throw new Error(`Unknown relation ${relation.type}`);
      }
    }

    return relationsArray;
  }

  public get primaryId(): string {
    return this.table.primary || '_id';
  }

}
