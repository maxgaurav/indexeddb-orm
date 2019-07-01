import { Builder, CursorDirection, IndexBuilder, ModelInterface, QueryBuilderInterface } from "./model.interface.js";
import { RelationBuilder } from "./relation.builder.js";
export declare class QueryBuilder extends RelationBuilder implements QueryBuilderInterface {
    /**
     * Index filter setting
     */
    indexBuilder: IndexBuilder | null;
    /**
     * Non indexed columns search settings
     */
    builder: Builder[];
    /**
     * Search direction and type
     */
    cursor: CursorDirection | null;
    /**
     * Search on exact index value
     * @param indexName
     * @param value
     */
    whereIndex(indexName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search on multiple indexed value
     * @param indexName
     * @param values
     */
    whereIndexIn(indexName: string, values: any[]): QueryBuilderInterface | ModelInterface;
    /**
     * Search on MultiEntry index value
     * @param indexName
     * @param values
     * @param unique
     */
    whereMultiIndexIn(indexName: string, values: any[], unique?: boolean): QueryBuilderInterface | ModelInterface;
    /**
     * Search index value where index greater then equal to value
     * @param indexName
     * @param value
     */
    indexGte(indexName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search index where index greater than value
     * @param indexName
     * @param value
     */
    indexGt(indexName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search index where index less than equal value
     * @param indexName
     * @param value
     */
    indexLte(indexName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search index where index less than value
     * @param indexName
     * @param value
     */
    indexLt(indexName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search index between values but not inclusive.
     * @param indexName
     * @param lower
     * @param upper
     */
    indexBetween(indexName: string, lower: any, upper: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search attribute where value is same
     * @param attributeName
     * @param value
     */
    where(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search attribute where attribute value match one of the values
     * @param attributeName
     * @param values
     */
    whereIn(attributeName: string, values: any[]): QueryBuilderInterface | ModelInterface;
    /**
     * Search attribute where attribute value is array type and matches one of the value
     * @param attributeName
     * @param values
     * @param unique
     */
    whereInArray(attributeName: string, values: any[], unique?: boolean): QueryBuilderInterface | ModelInterface;
    /**
     * Search attribute value is greater then or equal value
     * @param attributeName
     * @param value
     */
    gte(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search attribute value is greater than value
     * @param attributeName
     * @param value
     */
    gt(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search attribute value is less than equal value
     * @param attributeName
     * @param value
     */
    lte(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search attribute value is less than value
     * @param attributeName
     * @param value
     */
    lt(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;
    /**
     * Search attribute value between bound values.
     * @param attributeName
     * @param lower
     * @param upper
     */
    between(attributeName: string, lower: any, upper: any): QueryBuilderInterface | ModelInterface;
    cursorDirection(direction: CursorDirection): QueryBuilderInterface | ModelInterface;
    /**
     * Returns IDBKeyRange on indexed filter
     * @param indexBuilder
     */
    keyRange(indexBuilder: IndexBuilder): IDBKeyRange;
    /**
     * Checks if the attribute value is allowed to be processed according to attribute filters
     * @param result
     */
    protected allowedToProcess(result: any): boolean;
}
