import { BaseWriteActions } from './base-write-actions.js';
import {
  FindOrCreateActionInterface,
  TransactionModes,
} from './model.interface.js';
import { InvalidTransaction } from '../errors/invalid-transaction.js';

export abstract class FindOrCreateActions
  extends BaseWriteActions
  implements FindOrCreateActionInterface
{
  /**
   * Finds the first record else creates the record with accordance to builder provided for filtering
   * @param data
   * @throws InvalidTransaction
   */
  public async firstOrCreate<T>(data: any): Promise<T>;
  public async firstOrCreate(data: any): Promise<any> {
    const tables = this.tableNames(
      this.connector.migrationSchema.tables,
    ).concat(this.table.name);
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
    const tables = this.tableNames(
      this.connector.migrationSchema.tables,
    ).concat(this.table.name);
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
  public async findIndexOrCreate<T>(
    indexName: string,
    id: any,
    data: any,
  ): Promise<T>;
  public async findIndexOrCreate(
    indexName: string,
    id: any,
    data: any,
  ): Promise<any> {
    const tables = this.tableNames(
      this.connector.migrationSchema.tables,
    ).concat(this.table.name);
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
}
