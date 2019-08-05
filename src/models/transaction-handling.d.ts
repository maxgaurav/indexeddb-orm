import { TransactionModes } from "./model.interface.js";
import { OrmRelationBuilder } from "./orm-relation-builder.js";
export declare abstract class TransactionHandling extends OrmRelationBuilder implements TransactionHandling {
    protected transaction: IDBTransaction | null;
    /**
     * Retrieves current transaction and if ne transaction exists then creates new one.
     *
     * @param stores
     * @param mode
     * @param overwrite
     */
    getTransaction(stores: string[], mode: TransactionModes, overwrite?: boolean): IDBTransaction;
    /**
     * Sets transaction for the model
     * @param transaction
     */
    setTransaction(transaction: IDBTransaction): void;
    /**
     * Creates new transaction
     * @param stores
     * @param mode
     */
    createTransaction(stores: string[], mode: TransactionModes): IDBTransaction;
}
