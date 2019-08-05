import {FindFailActions} from "./find-fail-actions.js";
import {BaseWriteActionsInterface, TransactionModes} from "./model.interface.js";
import {IDBResultEvent} from "../connection/idb-event.interface.js";
import {InvalidTransaction} from "../errors/invalid-transaction.js";
import {mergeDeep as _mergeDeep} from "../utils.js";

export abstract class BaseWriteActions extends FindFailActions implements BaseWriteActionsInterface {
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
}
