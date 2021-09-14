import { TransactionModes } from './model.interface.js';
import { OrmRelationBuilder } from './orm-relation-builder.js';

export abstract class TransactionHandling
  extends OrmRelationBuilder
  implements TransactionHandling
{
  protected transaction: IDBTransaction | null = null;

  /**
   * Retrieves current transaction and if ne transaction exists then creates new one.
   *
   * @param stores
   * @param mode
   * @param overwrite
   */
  public getTransaction(
    stores: string[],
    mode: TransactionModes,
    overwrite = false,
  ): IDBTransaction {
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
  public createTransaction(
    stores: string[],
    mode: TransactionModes,
  ): IDBTransaction {
    const transaction = this.db.transaction(stores, mode);
    this.setTransaction(transaction);

    return transaction;
  }
}
