import { ModelInterface, QueryBuilderInterface, Relation, RelationQueryBuilder, RelationTypes } from "./model.interface.js";
import { TableSchema } from "../migration/migration.interface.js";
export declare abstract class RelationBuilder implements RelationQueryBuilder {
    /**
     * Array of relations to be loaded
     */
    relations: Relation[];
    /**
     * Custom relations list
     */
    customRelations: string[];
    /**
     * Returns list of childRelation tables required by the model action
     * @param tables
     */
    tableNames(tables: TableSchema[]): string[];
    /**
     * Adds childRelation to be fetched
     * @param relations
     */
    with(relations: Relation[]): RelationQueryBuilder | ModelInterface;
    /**
     * Adds childRelation to be fetched
     *
     * @deprecated
     * @param modelName
     * @param type
     * @param localKey
     * @param foreignKey
     * @param func
     */
    relation(modelName: string, type: RelationTypes, localKey: string, foreignKey: string, func?: (builder: QueryBuilderInterface) => QueryBuilderInterface): RelationQueryBuilder | ModelInterface;
    /**
     * Adds custom relations
     * @param relations
     */
    withCustom(relations: string[]): RelationQueryBuilder | ModelInterface;
}
