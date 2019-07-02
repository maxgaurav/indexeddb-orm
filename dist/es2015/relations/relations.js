import { DEFAULT_PRIMARY_ID, } from "../models/model.interface.js";
import { Model } from "../models/model.js";
import { QueryBuilder } from "../models/query-builder.js";
export class Relations extends QueryBuilder {
    /**
     * Sets builder values created through callback function
     * @param model
     * @param relation
     */
    filteredModel(model, relation) {
        model = this.bindBuilder(model);
        const builder = new QueryBuilder();
        if (relation.func) {
            const query = relation.func(builder);
            model.builder = model.builder.concat(query.builder);
            model.with(builder.relations);
        }
        return model;
    }
    bindBuilder(model) {
        model.builder = model.builder.concat(this.builder);
        model.with(this.relations);
        return model;
    }
    /**
     * Retrieves th childRelation model instance
     * @param relation
     */
    getRelationModel(relation) {
        let model;
        if (typeof relation.model === "string") {
            const tableSchema = this.connector.migrationSchema.tables.find(table => table.name === relation.model);
            if (!tableSchema) {
                throw new Error('Table schema not found');
            }
            model = new Model(this.db, tableSchema, this.connector);
        }
        else {
            model = relation.model;
        }
        return model;
    }
    /**
     * Retrieves the local key of parent model
     * @param model
     * @param relation
     */
    getLocalKey(model, relation) {
        const primaryKey = model.table.primary || DEFAULT_PRIMARY_ID;
        return relation.localKey ? relation.localKey : primaryKey;
    }
    /**
     * Returns the attribute name by which childRelation is to be attached with parent model
     * @param model
     * @param relation
     */
    getAttributeName(model, relation) {
        return relation.attributeName || model.table.name;
    }
}
//# sourceMappingURL=relations.js.map