import {
  Builder,
  CursorDirection,
  IndexBuilder,
  ModelInterface,
  QueryBuilderInterface,
  QueryTypes
} from "./model.interface.js";
import {RelationBuilder} from "./relation.builder.js";
import {nestedAttributeValue} from "../utils.js";

export class QueryBuilder extends RelationBuilder implements QueryBuilderInterface {

  /**
   * Index filter setting
   */
  public indexBuilder: IndexBuilder | null = null;

  /**
   * Non indexed columns search settings
   */
  public builder: Builder[] = [];

  /**
   * Search direction and type
   */
  public cursor: CursorDirection | null = null;

  /**
   * Search on exact index value
   * @param indexName
   * @param value
   */
  public whereIndex(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public whereIndexIn(indexName: string, values: any[]): QueryBuilderInterface | ModelInterface {
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
  public whereMultiIndexIn(indexName: string, values: any[], unique: boolean = false): QueryBuilderInterface | ModelInterface {
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
  public indexGte(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public indexGt(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public indexLte(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public indexLt(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public indexBetween(indexName: string, lower: any, upper: any): QueryBuilderInterface | ModelInterface {
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
  public where(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public whereIn(attributeName: string, values: any[]): QueryBuilderInterface | ModelInterface {
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
  public whereInArray(attributeName: string, values: any[], unique: boolean = false): QueryBuilderInterface | ModelInterface {

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
  public gte(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public gt(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public lte(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public lt(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
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
  public between(attributeName: string, lower: any, upper: any): QueryBuilderInterface | ModelInterface {
    this.builder.push({
      attribute: attributeName,
      value: [lower, upper],
      type: QueryTypes.Between
    });
    return this;
  }

  public cursorDirection(direction: CursorDirection): QueryBuilderInterface | ModelInterface {
    this.cursor = direction;
    return this;
  }

  /**
   * Returns IDBKeyRange on indexed filter
   * @param indexBuilder
   */
  public keyRange(indexBuilder: IndexBuilder): IDBKeyRange {

    let range: IDBKeyRange;
    switch (indexBuilder.type) {
      case QueryTypes.Where :
        range = IDBKeyRange.only(indexBuilder.value);
        break;

      case QueryTypes.WhereIn :
        this.whereIn(indexBuilder.index, indexBuilder.value);
        let values = indexBuilder.value.sort();
        range = IDBKeyRange.bound(values[0], values[values.length - 1], false, false);
        break;

      case QueryTypes.GreaterThanEqual :
        range = IDBKeyRange.lowerBound(indexBuilder.value, false);
        break;

      case QueryTypes.GreaterThan :
        range = IDBKeyRange.lowerBound(indexBuilder.value, true);
        break;

      case QueryTypes.LessThanEqual :
        range = IDBKeyRange.upperBound(indexBuilder.value, false);
        break;

      case QueryTypes.LessThan :
        range = IDBKeyRange.lowerBound(indexBuilder.value, true);
        break;

      case QueryTypes.Between :
        range = IDBKeyRange.bound(indexBuilder.value[0], indexBuilder.value[1], false, false);
        break;
      case QueryTypes.WhereInArray:
        this.whereInArray(indexBuilder.index, indexBuilder.value);
        let whereInArrayValues = indexBuilder.value.sort();
        range = IDBKeyRange.bound(whereInArrayValues[0], whereInArrayValues[whereInArrayValues.length - 1], false, false);
        break;
      default :
        throw 'Invalid builder type given';
    }

    return range;
  }

  /**
   * Checks if the attribute value is allowed to be processed according to attribute filters
   * @param result
   */
  protected allowedToProcess(result: any): boolean {

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

  /**
   * Resets the builder values for filtering
   */
  public resetBuilder(): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = null;
    this.builder = [];
    return this;
  }
}
