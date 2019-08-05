import { OrmRelationBuilder } from "./orm-relation-builder.js";
export class TransactionHandling extends OrmRelationBuilder {
    constructor() {
        super(...arguments);
        this.transaction = null;
    }
    /**
     * Retrieves current transaction and if ne transaction exists then creates new one.
     *
     * @param stores
     * @param mode
     * @param overwrite
     */
    getTransaction(stores, mode, overwrite = false) {
        if (this.transaction === null || overwrite) {
            this.transaction = this.createTransaction(stores, mode);
        }
        return this.transaction;
    }
    /**
     * Sets transaction for the model
     * @param transaction
     */
    setTransaction(transaction) {
        this.transaction = transaction;
    }
    /**
     * Creates new transaction
     * @param stores
     * @param mode
     */
    createTransaction(stores, mode) {
        const transaction = this.db.transaction(stores, mode);
        this.setTransaction(transaction);
        return transaction;
    }
}
//# sourceMappingURL=transaction-handling.js.map