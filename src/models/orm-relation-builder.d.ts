import { QueryBuilder } from "./query-builder.js";
import { HasOne } from "../relations/has-one.js";
import { ModelConstructorInterface, OrmRelationBuilderInterface, Relation, RelationTypes } from "./model.interface.js";
import { Connector } from "../connection/connector.js";
import { HasMany } from "../relations/has-many.js";
import { HasManyMulti } from "../relations/has-many-multi.js";
import { HasManyThroughMulti } from "../relations/has-many-through-multi.js";
export declare abstract class OrmRelationBuilder extends QueryBuilder implements OrmRelationBuilderInterface {
    abstract db: IDBDatabase;
    abstract connector: Connector;
    /**
     * Returns has one relation
     * @param model
     * @param foreignKey
     * @param localKey
     * @param parentKeyName
     */
    hasOne(model: ModelConstructorInterface, foreignKey: string, localKey?: string | undefined, parentKeyName?: string): HasOne;
    /**
     * Returns has many relation
     * @param model
     * @param foreignKey
     * @param localKey
     * @param parentKeyName
     */
    hasMany(model: ModelConstructorInterface, foreignKey: string, localKey?: string | undefined, parentKeyName?: string): HasMany;
    /**
     * Returns has many multi entry relation
     * @param model
     * @param foreignKey
     * @param localKey
     * @param parentKeyName
     */
    hasManyMultiEntry(model: ModelConstructorInterface, foreignKey: string, localKey?: string, parentKeyName?: string): HasManyMulti;
    /**
     * Returns relation has many through multi entry relation
     * @param model
     * @param foreignKey
     * @param localKey
     * @param parentKeyName
     */
    hasManyThroughMultiEntry(model: ModelConstructorInterface, foreignKey: string, localKey?: string, parentKeyName?: string): HasManyThroughMulti;
    convertToRelation(modelConstructor: ModelConstructorInterface, type: RelationTypes, foreignKey: string): Relation;
    private newModel;
}
