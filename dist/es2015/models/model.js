import { DEFAULT_PRIMARY_ID, RelationTypes } from "./model.interface.js";
import { DEFAULT_SYNC_COLUMN_NAME } from "../migration/migration.interface.js";
import { FindOrCreateActions } from "./find-or-create-actions.js";
import { HasOne } from "../relations/has-one.js";
import { HasMany } from "../relations/has-many.js";
import { HasManyMulti } from "../relations/has-many-multi.js";
import { HasManyThroughMulti } from "../relations/has-many-through-multi.js";
import { mergeDeep as mergeDeepUtil } from "../utils.js";
export class Model extends FindOrCreateActions {
    constructor(db, table, connector) {
        super(db, table);
        this.db = db;
        this.table = table;
        this.connector = connector;
        this.transaction = null;
    }
    async sync(id, data, mergeDeep = true) {
        await this.save(id, this.syncObj(data), mergeDeep);
        return this.find(id);
    }
    async syncIndex(indexName, id, data, mergeDeep = true) {
        await this.saveIndex(indexName, id, this.syncObj(data), mergeDeep);
        return this.findIndex(indexName, id);
    }
    async syncAllIndex(indexName, id, data, mergeDeep = true) {
        await this.saveAllIndex(indexName, id, this.syncObj(data), mergeDeep);
        return this.resetBuilder().whereIndex(indexName, id).all();
    }
    /**
     * Opens new transaction for all models and returns transaction instance
     * @param mode
     */
    openTransaction(mode) {
        const transaction = this.db.transaction(this.connector.migrationSchema.tables.map(table => table.name));
        const models = {};
        for (const table of this.connector.migrationSchema.tables) {
            Object.defineProperty(models, table.name, {
                get: () => {
                    let model;
                    if (this.table.ormClass) {
                        model = new this.table.ormClass(this.db, table, this.connector);
                    }
                    else {
                        model = new Model(this.db, table, this.connector);
                    }
                    model.setTransaction(transaction);
                    return model;
                }
            });
        }
        return { models, transaction };
    }
    /**
     * Loads relations against the model results
     *
     * @param results
     */
    loadRelations(results) {
        const relationsArray = [];
        for (const relation of this.relations) {
            let loader;
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
    get primaryId() {
        return this.table.primary || DEFAULT_PRIMARY_ID;
    }
    /**
     * Loads custom relation created in the ORM classes extending the base model class
     * @param results
     */
    loadCustomRelations(results) {
        const relationPromises = [];
        for (const customRelation of this.customRelations) {
            if (!Reflect.has(this, customRelation)) {
                throw new Error(`Method ${customRelation} not defined.`);
            }
            const relation = (Reflect.get(this, customRelation)());
            relationPromises.push(relation.fetch(results));
        }
        return relationPromises;
    }
    /**
     * Adds sync column if table requires to have sync date
     * @param data
     */
    syncObj(data) {
        if (this.table.syncColumn) {
            const attr = this.table.syncColumnName || DEFAULT_SYNC_COLUMN_NAME;
            const obj = {};
            obj[attr] = new Date();
            return mergeDeepUtil(data, obj);
        }
        return data;
    }
}
//# sourceMappingURL=model.js.map