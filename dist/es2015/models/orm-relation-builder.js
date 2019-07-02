import { QueryBuilder } from "./query-builder.js";
import { HasOne } from "../relations/has-one.js";
import { RelationTypes } from "./model.interface.js";
import { HasMany } from "../relations/has-many.js";
import { HasManyMulti } from "../relations/has-many-multi.js";
import { HasManyThroughMulti } from "../relations/has-many-through-multi.js";
export class OrmRelationBuilder extends QueryBuilder {
    /**
     * Returns has one relation
     * @param model
     * @param foreignKey
     * @param localKey
     * @param parentKeyName
     */
    hasOne(model, foreignKey, localKey, parentKeyName) {
        const current = this;
        const relation = this.convertToRelation(model, RelationTypes.HasOne, foreignKey);
        if (localKey) {
            relation.localKey = localKey;
        }
        if (parentKeyName) {
            relation.attributeName = parentKeyName;
        }
        return new HasOne(this.db, this.connector, current, relation);
    }
    /**
     * Returns has many relation
     * @param model
     * @param foreignKey
     * @param localKey
     * @param parentKeyName
     */
    hasMany(model, foreignKey, localKey, parentKeyName) {
        const current = this;
        const relation = this.convertToRelation(model, RelationTypes.HasMany, foreignKey);
        if (localKey) {
            relation.localKey = localKey;
        }
        if (parentKeyName) {
            relation.attributeName = parentKeyName;
        }
        return new HasMany(this.db, this.connector, current, relation);
    }
    /**
     * Returns has many multi entry relation
     * @param model
     * @param foreignKey
     * @param localKey
     * @param parentKeyName
     */
    hasManyMultiEntry(model, foreignKey, localKey, parentKeyName) {
        const current = this;
        const relation = this.convertToRelation(model, RelationTypes.HasManyMultiEntry, foreignKey);
        if (localKey) {
            relation.localKey = localKey;
        }
        if (parentKeyName) {
            relation.attributeName = parentKeyName;
        }
        return new HasManyMulti(this.db, this.connector, current, relation);
    }
    /**
     * Returns relation has many through multi entry relation
     * @param model
     * @param foreignKey
     * @param localKey
     * @param parentKeyName
     */
    hasManyThroughMultiEntry(model, foreignKey, localKey, parentKeyName) {
        const current = this;
        const relation = this.convertToRelation(model, RelationTypes.HasManyThroughMultiEntry, foreignKey);
        if (localKey) {
            relation.localKey = localKey;
        }
        if (parentKeyName) {
            relation.attributeName = parentKeyName;
        }
        return new HasManyThroughMulti(this.db, this.connector, current, relation);
    }
    convertToRelation(modelConstructor, type, foreignKey) {
        const model = this.newModel(modelConstructor);
        return { model, type, foreignKey };
    }
    newModel(modelConstructor) {
        const table = this.connector.migrationSchema.tables.find(tableSchema => tableSchema.name === modelConstructor.TableName);
        if (!table) {
            throw new Error('Table schema not found');
        }
        return new modelConstructor(this.db, table, this.connector);
    }
}
//# sourceMappingURL=orm-relation-builder.js.map