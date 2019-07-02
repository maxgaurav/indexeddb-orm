import { QueryTypes } from "./model.interface.js";
import { RelationBuilder } from "./relation.builder.js";
import { nestedAttributeValue } from "../utils.js";
export class QueryBuilder extends RelationBuilder {
    constructor() {
        super(...arguments);
        /**
         * Index filter setting
         */
        this.indexBuilder = null;
        /**
         * Non indexed columns search settings
         */
        this.builder = [];
        /**
         * Search direction and type
         */
        this.cursor = null;
    }
    /**
     * Search on exact index value
     * @param indexName
     * @param value
     */
    whereIndex(indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value,
            type: QueryTypes.Where
        };
        return this;
    }
    /**
     * Search on multiple indexed value
     * @param indexName
     * @param values
     */
    whereIndexIn(indexName, values) {
        this.indexBuilder = {
            index: indexName,
            value: values,
            type: QueryTypes.WhereIn
        };
        return this;
    }
    /**
     * Search on MultiEntry index value
     * @param indexName
     * @param values
     * @param unique
     */
    whereMultiIndexIn(indexName, values, unique = false) {
        this.indexBuilder = {
            index: indexName,
            value: values,
            type: QueryTypes.WhereInArray
        };
        return this;
    }
    /**
     * Search index value where index greater then equal to value
     * @param indexName
     * @param value
     */
    indexGte(indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value,
            type: QueryTypes.GreaterThanEqual
        };
        return this;
    }
    /**
     * Search index where index greater than value
     * @param indexName
     * @param value
     */
    indexGt(indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value,
            type: QueryTypes.GreaterThan
        };
        return this;
    }
    /**
     * Search index where index less than equal value
     * @param indexName
     * @param value
     */
    indexLte(indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value,
            type: QueryTypes.LessThanEqual
        };
        return this;
    }
    /**
     * Search index where index less than value
     * @param indexName
     * @param value
     */
    indexLt(indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value,
            type: QueryTypes.LessThan
        };
        return this;
    }
    /**
     * Search index between values but not inclusive.
     * @param indexName
     * @param lower
     * @param upper
     */
    indexBetween(indexName, lower, upper) {
        this.indexBuilder = {
            index: indexName,
            value: [lower, upper],
            type: QueryTypes.Between
        };
        return this;
    }
    /**
     * Search attribute where value is same
     * @param attributeName
     * @param value
     */
    where(attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value,
            type: QueryTypes.Where
        });
        return this;
    }
    /**
     * Search attribute where attribute value match one of the values
     * @param attributeName
     * @param values
     */
    whereIn(attributeName, values) {
        this.builder.push({
            attribute: attributeName,
            value: values,
            type: QueryTypes.WhereIn
        });
        return this;
    }
    /**
     * Search attribute where attribute value is array type and matches one of the value
     * @param attributeName
     * @param values
     * @param unique
     */
    whereInArray(attributeName, values, unique = false) {
        this.builder.push({
            attribute: attributeName,
            value: values,
            type: QueryTypes.WhereInArray
        });
        return this;
    }
    /**
     * Search attribute value is greater then or equal value
     * @param attributeName
     * @param value
     */
    gte(attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value,
            type: QueryTypes.GreaterThanEqual
        });
        return this;
    }
    /**
     * Search attribute value is greater than value
     * @param attributeName
     * @param value
     */
    gt(attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value,
            type: QueryTypes.GreaterThan
        });
        return this;
    }
    /**
     * Search attribute value is less than equal value
     * @param attributeName
     * @param value
     */
    lte(attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value,
            type: QueryTypes.LessThanEqual
        });
        return this;
    }
    /**
     * Search attribute value is less than value
     * @param attributeName
     * @param value
     */
    lt(attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value,
            type: QueryTypes.LessThan
        });
        return this;
    }
    /**
     * Search attribute value between bound values.
     * @param attributeName
     * @param lower
     * @param upper
     */
    between(attributeName, lower, upper) {
        this.builder.push({
            attribute: attributeName,
            value: [lower, upper],
            type: QueryTypes.Between
        });
        return this;
    }
    cursorDirection(direction) {
        this.cursor = direction;
        return this;
    }
    /**
     * Returns IDBKeyRange on indexed filter
     * @param indexBuilder
     */
    keyRange(indexBuilder) {
        let range;
        switch (indexBuilder.type) {
            case QueryTypes.Where:
                range = IDBKeyRange.only(indexBuilder.value);
                break;
            case QueryTypes.WhereIn:
                this.whereIn(indexBuilder.index, indexBuilder.value);
                let values = indexBuilder.value.sort();
                range = IDBKeyRange.bound(values[0], values[values.length - 1], false, false);
                break;
            case QueryTypes.GreaterThanEqual:
                range = IDBKeyRange.lowerBound(indexBuilder.value, false);
                break;
            case QueryTypes.GreaterThan:
                range = IDBKeyRange.lowerBound(indexBuilder.value, true);
                break;
            case QueryTypes.LessThanEqual:
                range = IDBKeyRange.upperBound(indexBuilder.value, false);
                break;
            case QueryTypes.LessThan:
                range = IDBKeyRange.lowerBound(indexBuilder.value, true);
                break;
            case QueryTypes.Between:
                range = IDBKeyRange.bound(indexBuilder.value[0], indexBuilder.value[1], false, false);
                break;
            case QueryTypes.WhereInArray:
                this.whereInArray(indexBuilder.index, indexBuilder.value);
                let whereInArrayValues = indexBuilder.value.sort();
                range = IDBKeyRange.bound(whereInArrayValues[0], whereInArrayValues[whereInArrayValues.length - 1], false, false);
                break;
            default:
                throw 'Invalid builder type given';
        }
        return range;
    }
    /**
     * Checks if the attribute value is allowed to be processed according to attribute filters
     * @param result
     */
    allowedToProcess(result) {
        for (const builder of this.builder) {
            switch (builder.type) {
                case QueryTypes.Where:
                    if (!nestedAttributeValue(builder.attribute, result) === builder.value) {
                        return false;
                    }
                    break;
                case QueryTypes.WhereIn:
                    let whereInStatus = false;
                    const resultValue = nestedAttributeValue(builder.attribute, result);
                    for (const checkValue of builder.value) {
                        if (resultValue === checkValue) {
                            whereInStatus = true;
                            break;
                        }
                    }
                    if (!whereInStatus) {
                        return false;
                    }
                    break;
                case QueryTypes.WhereInArray:
                    let whereInArrayStatus = false;
                    const resultValues = nestedAttributeValue(builder.attribute, result);
                    if (!(resultValues instanceof Array)) {
                        return false;
                    }
                    for (const checkValue of builder.value) {
                        if (resultValues.includes(checkValue)) {
                            whereInArrayStatus = true;
                            break;
                        }
                    }
                    if (!whereInArrayStatus) {
                        return false;
                    }
                    break;
                case QueryTypes.GreaterThan:
                    if (nestedAttributeValue(builder.attribute, result) <= builder.value) {
                        return false;
                    }
                    break;
                case QueryTypes.GreaterThanEqual:
                    if (nestedAttributeValue(builder.attribute, result) < builder.value) {
                        return false;
                    }
                    break;
                case QueryTypes.LessThan:
                    if (nestedAttributeValue(builder.attribute, result) >= builder.value) {
                        return false;
                    }
                    break;
                case QueryTypes.LessThanEqual:
                    if (nestedAttributeValue(builder.attribute, result) > builder.value) {
                        return false;
                    }
                    break;
                case QueryTypes.Between:
                    const value = nestedAttributeValue(builder.attribute, result);
                    if (builder.value[0] >= value && builder.value[1] <= value) {
                        return false;
                    }
                    break;
                default:
                    throw new Error('Query type not recognized');
            }
        }
        return true;
    }
}
//# sourceMappingURL=query-builder.js.map