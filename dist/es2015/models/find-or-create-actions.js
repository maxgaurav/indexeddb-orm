import { BaseWriteActions } from "./base-write-actions.js";
import { TransactionModes } from "./model.interface.js";
import { InvalidTransaction } from "../errors/invalid-transaction.js";
export class FindOrCreateActions extends BaseWriteActions {
    async firstOrCreate(data) {
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
    async findOrCreate(id, data) {
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
    async findIndexOrCreate(indexName, id, data) {
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
}
//# sourceMappingURL=find-or-create-actions.js.map