import { ModelInterface, QueryBuilderInterface, Relation } from "../models/model.interface.js";
import { QueryBuilder } from "../models/query-builder.js";
import { Connector } from "../connection/connector.js";
import { RelationInterface } from "./relation.interface.js";
export declare abstract class Relations extends QueryBuilder implements RelationInterface, QueryBuilderInterface {
    /**
     * IDBDatabase
     */
    abstract db: IDBDatabase;
    /**
     * Connection instance
     */
    abstract connector: Connector;
    /**
     * Binds childRelation result to parent result.
     * @param parentResults
     * @param relationResults
     * @param relation
     */
    abstract bindResults(parentResults: any | any[], relationResults: any[], relation: Relation): Promise<any>;
    /**
     * Fetches childRelation results
     * @param results
     */
    abstract fetch(results: any[]): Promise<any[]>;
    /**
     * Sets builder values created through callback function
     * @param model
     * @param relation
     */
    filteredModel(model: ModelInterface, relation: Relation): ModelInterface;
    bindBuilder(model: ModelInterface): ModelInterface;
    /**
     * Retrieves th childRelation model instance
     * @param relation
     */
    getRelationModel(relation: Relation): ModelInterface;
    /**
     * Retrieves the local key of parent model
     * @param model
     * @param relation
     */
    getLocalKey(model: ModelInterface, relation: Relation): string;
    /**
     * Returns the attribute name by which childRelation is to be attached with parent model
     * @param model
     * @param relation
     */
    getAttributeName(model: ModelInterface, relation: Relation): string;
}
