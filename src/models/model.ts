import {
  CursorDirection,
  DEFAULT_PRIMARY_ID,
  ModelInterface,
  ModelKeysInterface,
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
import {Relations} from "../relations/relations.js";
import {NotFound} from "../errors/not-found.js";
import {InvalidTransaction} from "../errors/invalid-transaction.js";

export class Model extends Aggregate implements ModelInterface {

  private transaction: IDBTransaction | null = null;

  public constructor(public db: IDBDatabase, public table: TableSchema, public connector: Connector) {
    super(db, table);
  }

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
   * Returns fist matching record or throws NotFound exception
   * @throws NotFound
   */
  public async firstOrFail<T>(): Promise<T>;
  public async firstOrFail(): Promise<any> {
    const record = await this.first();

    if (!record) {
      throw new NotFound();
    }

    return record;
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
   * Finds the record on primary key or throws error
   * @param id
   * @throws NotFound
   */
  public async findOrFail<T>(id: any): Promise<T | null>;
  public async findOrFail(id: any): Promise<any | null> {
    const record = await this.find(id);
    if (!record) {
      throw new NotFound();
    }

    return record;
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
   * Finds value at index or throws NotFound exception.
   * @param indexName
   * @param id
   * @throws NotFound
   */
  public async findIndexOrFail<T>(indexName: string, id: any): Promise<T>;
  public async findIndexOrFail(indexName: string, id: any): Promise<any> {
    const record = await this.findIndex(indexName, id);
    if (!record) {
      throw new NotFound();
    }

    return record;
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

  /**
   * Creates new record entry
   * @param data
   */
  public create<T>(data: any): Promise<T>;
  public create(data: any): Promise<any> {
    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
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

  /**
   * Creates multiple record entry by passing array of entries to be created
   * @param entries
   */
  public createMultiple<T>(entries: any[]): Promise<T[]>;
  public createMultiple(entries: any[]): Promise<any[]> {
    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
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

  /**
   * Finds the first record else creates the record with accordance to builder provided for filtering
   * @param data
   * @throws InvalidTransaction
   */
  public async firstOrCreate<T>(data: any): Promise<T>;
  public async firstOrCreate(data: any): Promise<any> {
    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
    const transaction = this.createTransaction(tables, TransactionModes.Write);
    if (transaction.mode !== TransactionModes.Write) {
      throw new InvalidTransaction('Transaction not in write mode');
    }

    const record = await this.first();

    if (!record) {
      return this.create(data);
    }

    return record;
  }

  /**
   * Finds the record at primary key else creates the record
   * @param id
   * @param data
   * @throws InvalidTransaction
   */
  public async findOrCreate<T>(id: any, data: any): Promise<T>;
  public async findOrCreate(id: any, data: any): Promise<any> {
    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
    const transaction = this.createTransaction(tables, TransactionModes.Write);
    if (transaction.mode !== TransactionModes.Write) {
      throw new InvalidTransaction('Transaction not in write mode');
    }

    this.setTransaction(transaction);

    const record = await this.find(id);

    if (!record) {
      return this.create(data);
    }

    return record;
  }

  /**
   * Finds the record at index else creates the record
   * @param indexName
   * @param id
   * @param data
   * @throws InvalidTransaction
   */
  public async findIndexOrCreate<T>(indexName: string, id: any, data: any): Promise<T>;
  public async findIndexOrCreate(indexName: string, id: any, data: any): Promise<any> {
    const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
    const transaction = this.createTransaction(tables, TransactionModes.Write);
    if (transaction.mode !== TransactionModes.Write) {
      throw new InvalidTransaction('Transaction not in write mode');
    }

    const record = await this.findIndex(indexName, id);

    if (!record) {
      return this.create(data);
    }

    return record;
  }

  /**
   * Deletes matching entry.
   * If no builder/index for filtering is provided then throws error.
   */
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

  /**
   * Delete record at id of primary key
   * @param id
   */
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

  /**
   * Delete records matching index.
   * @param indexName
   * @param value
   * @param isMulti
   */
  public deleteIndex(indexName: string, value: any, isMulti: boolean = false): Promise<boolean> {
    this.resetBuilder();

    if (isMulti) {
      this.whereIndex(indexName, value);
    } else {
      this.whereMultiIndexIn(indexName, [value]);
    }
    return this.destroy();
  }

  /**
   * Clears entire object store
   */
  public truncate(): Promise<boolean> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.Write);
    const objectStore = transaction.objectStore(this.table.name);
    const request = objectStore.clear();

    return new Promise<boolean>((resolve, reject) => {
      request.addEventListener<'success'>("success", () => resolve(true));
      request.addEventListener<'error'>("error", (error) => reject(error));
    });
  }

  /**
   * Delete record at id
   *
   * @deprecated
   * @param id
   */
  public destroyId(id: any): Promise<boolean> {
    return this.delete(id);
  }

  /**
   * Updates all matching records.
   * By default deep merges the input data with existing data records.
   * @param data
   * @param mergeDeep
   */
  public update(data: any, mergeDeep: boolean = true): Promise<number> {
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

          updatePromises.push(this.save(cursor.value[this.primaryId], data, mergeDeep));
          totalUpdatedRecords++;
          cursor.continue();
        }

        await Promise.all(updatePromises);
        resolve(totalUpdatedRecords);
      });

      request.addEventListener<'error'>('error', (event) => reject(event));
    });
  }

  /**
   * Updates the records at id
   * By default deep merges the input data with existing data record.
   *
   * @param id
   * @param data
   * @param mergeDeep
   * @throws NotFound
   */
  public async save(id: any, data: any, mergeDeep: boolean = true): Promise<boolean> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.Write);
    const record = await this.findOrFail<any>(id);

    if (transaction.mode !== TransactionModes.Write) {
      throw new InvalidTransaction('Transaction not in write mode');
    }

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

  /**
   * Updates all matching records at index
   * By default deep merges the input data with existing data record.
   *
   * @param indexName
   * @param id
   * @param data
   * @param mergeDeep
   * @throws NotFound
   */
  public async saveIndex(indexName: string, id: any, data: any, mergeDeep: boolean = true): Promise<boolean> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.Write);
    const record = await this.findIndexOrFail<any>(indexName, id);

    if (transaction.mode !== TransactionModes.Write) {
      throw new InvalidTransaction('Transaction not in write mode');
    }

    return this.save(record[this.primaryId], data, mergeDeep);
  }

  /**
   * Updates all matching records at index
   * By default deep merges the input data with existing data record.
   *
   * @param indexName
   * @param id
   * @param data
   * @param mergeDeep
   * @throws NotFound
   */
  public async saveAllIndex(indexName: string, id: any, data: any, mergeDeep: boolean = true): Promise<boolean> {
    const tables = [this.table.name];
    const transaction = this.getTransaction(tables, TransactionModes.Write);

    if (transaction.mode !== TransactionModes.Write) {
      throw new InvalidTransaction('Transaction not in write mode');
    }

    this.resetBuilder().whereIndex(indexName, id);

    await this.update(data, mergeDeep);
    return Promise.resolve(true);
  }

  /**
   * Syncs data at primary index and returns newly updated record
   * @param id
   * @param data
   * @param mergeDeep
   */
  public async sync<T>(id: any, data: any, mergeDeep: boolean): Promise<T>;
  public async sync(id: any, data: any, mergeDeep: boolean = true): Promise<any> {
    await this.save(id, data, mergeDeep);
    return this.find(id);
  }

  /**
   * Syncs data at index and returns newly updated record
   * @param indexName
   * @param id
   * @param data
   * @param mergeDeep
   */
  public async syncIndex<T>(indexName: string, id: any, data: any, mergeDeep: boolean): Promise<T>;
  public async syncIndex(indexName: string, id: any, data: any, mergeDeep: boolean = true): Promise<any> {
    await this.saveIndex(indexName, id, data, mergeDeep);
    return this.findIndex(indexName, id);
  }

  /**
   * Syncs data at index and returns newly updated record
   * @param indexName
   * @param id
   * @param data
   * @param mergeDeep
   */
  public async syncAllIndex<T>(indexName: string, id: any, data: any, mergeDeep: boolean): Promise<T[]>;
  public async syncAllIndex(indexName: string, id: any, data: any, mergeDeep: boolean = true): Promise<any[]> {
    await this.saveAllIndex(indexName, id, data, mergeDeep);
    return (this.resetBuilder().whereIndex(indexName, id) as Model).all();
  }

  /**
   * Retrieves current transaction and if ne transaction exists then creates new one.
   *
   * @param stores
   * @param mode
   * @param overwrite
   */
  public getTransaction(stores: string[], mode: TransactionModes, overwrite: boolean = false): IDBTransaction {
    if (this.transaction === null || overwrite) {
      this.transaction = this.createTransaction(stores, mode);
    }
    return this.transaction;
  }

  /**
   * Sets transaction for the model
   * @param transaction
   */
  public setTransaction(transaction: IDBTransaction): void {
    this.transaction = transaction;
  }

  /**
   * Creates new transaction
   * @param stores
   * @param mode
   */
  public createTransaction(stores: string[], mode: TransactionModes): IDBTransaction {
    const transaction = this.db.transaction(stores, mode);
    this.setTransaction(transaction);

    return transaction;
  }

  /**
   * Opens new transaction for all models and returns transaction instance
   * @param mode
   */
  public openTransaction(mode: TransactionModes): { models: ModelKeysInterface, transaction: IDBTransaction } {

    const transaction = this.db.transaction(this.connector.migrationSchema.tables.map(table => table.name));

    const models: { [key: string]: ModelInterface } = {};

    for (const table of this.connector.migrationSchema.tables) {

      Object.defineProperty(models, table.name, {
        get: () => {
          const model = new Model(<IDBDatabase>this.db, table, this.connector);
          model.setTransaction(transaction);
          return model;
        }
      });
    }

    return {models, transaction};
  }

  /**
   * Opens IDBRequest to perform action on object store
   * @param objectStore
   */
  protected request(objectStore: IDBObjectStore): IDBRequest {
    const direction = this.cursor || undefined;

    if (this.indexBuilder) {
      const keyRange = this.keyRange(this.indexBuilder);
      const cursor = this.indexBuilder.index !== this.primaryId ? objectStore.index(this.indexBuilder.index) : objectStore;
      return cursor.openCursor(keyRange, direction);
    } else {
      return objectStore.openCursor(undefined, direction);
    }

  }

  /**
   * Loads relations against the model results
   *
   * @param results
   */
  protected loadRelations(results: any[]): Promise<any>[] {
    const relationsArray: Promise<any>[] = [];

    for (const relation of this.relations) {
      let loader: HasOne | HasMany | HasManyMulti | HasManyThroughMulti;
      switch (relation.type) {
        case RelationTypes.HasOne:
          loader = new HasOne(this.db, this.connector, this, relation);
          relationsArray.push(loader.fetch(results));
          break;
        case RelationTypes.HasMany:
          loader = new HasMany(this.db, this.connector, this, relation);
          relationsArray.push(loader.fetch(results));
          break;
        case RelationTypes.HasManyMultiEntry:
          loader = new HasManyMulti(this.db, this.connector, this, relation);
          relationsArray.push(loader.fetch(results));
          break;
        case RelationTypes.HasManyThroughMultiEntry:
          loader = new HasManyThroughMulti(this.db, this.connector, this, relation);
          relationsArray.push(loader.fetch(results));
          break;
        default:
          throw new Error(`Unknown relation ${relation.type}`);
      }
    }

    return relationsArray.concat(this.loadCustomRelations(results));
  }

  /**
   * The primary key of the model
   */
  public get primaryId(): string {
    return this.table.primary || DEFAULT_PRIMARY_ID;
  }

  protected loadCustomRelations(results: any[]): Promise<any>[] {
    const relationPromises: Promise<any>[] = [];

    for (const customRelation of this.customRelations) {

      if (!Reflect.has(this, customRelation)) {
        throw new Error(`Method ${customRelation} not defined.`);
      }

      const relation = <Relations>(Reflect.get(this, customRelation)());
      relationPromises.push(relation.fetch(results));
    }

    return relationPromises;
  }
}
