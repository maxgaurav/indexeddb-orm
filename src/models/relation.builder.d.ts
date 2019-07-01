import { ModelInterface, QueryBuilderInterface, Relation, RelationQueryBuilder, RelationTypes } from "./model.interface.js";
export declare class RelationBuilder implements RelationQueryBuilder {
    /**
     * Array of relations to be loaded
     */
    relations: Relation[];
    /**
     * Returns list of relation tables required by the model action
     * @param relations
     */
    relationTables(relations: Relation[]): string[];
    /**
     * Returns relation table name for the model being added as relation
     * @param model
     */
    relationTableName(model: ModelInterface | string): string;
    /**
     * Adds relation to be fetched
     * @param relations
     */
    with(relations: Relation[]): RelationQueryBuilder | ModelInterface;
    /**
     * Adds relation to be fetched
     *
     * @deprecated
     * @param modelName
     * @param type
     * @param localKey
     * @param foreignKey
     * @param func
     */
    relation(modelName: string, type: RelationTypes, localKey: string, foreignKey: string, func?: (builder: QueryBuilderInterface) => QueryBuilderInterface): RelationQueryBuilder | ModelInterface;
}
