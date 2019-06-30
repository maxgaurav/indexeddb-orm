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

  public indexBuilder: IndexBuilder | null = null;
  public builder: Builder[] = [];
  public cursor: CursorDirection | null = null;

  public whereIndex(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = {
      index: indexName,
      value,
      type: QueryTypes.Where
    };

    return this;
  }

  public whereIndexIn(indexName: string, values: any[]): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = {
      index: indexName,
      value: values,
      type: QueryTypes.WhereIn
    };

    return this;
  }

  public whereMultiIndexIn(indexName: string, values: any[], unique: boolean = false): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = {
      index: indexName,
      value: values,
      type: QueryTypes.WhereInArray
    };

    return this;
  }

  public indexGte(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = {
      index: indexName,
      value,
      type: QueryTypes.GreaterThanEqual
    };
    return this;
  }

  public indexGt(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = {
      index: indexName,
      value,
      type: QueryTypes.GreaterThan
    };
    return this;
  }

  public indexLte(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = {
      index: indexName,
      value,
      type: QueryTypes.LessThanEqual
    };

    return this;
  }

  public indexLt(indexName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = {
      index: indexName,
      value,
      type: QueryTypes.LessThan
    };
    return this;
  }

  public indexBetween(indexName: string, lower: any, upper: any): QueryBuilderInterface | ModelInterface {
    this.indexBuilder = {
      index: indexName,
      value: [lower, upper],
      type: QueryTypes.Between
    };
    return this;
  }

  public where(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.builder.push({
      attribute: attributeName,
      value,
      type: QueryTypes.Where
    });
    return this;
  }

  public whereIn(attributeName: string, values: any[]): QueryBuilderInterface | ModelInterface {
    this.builder.push({
      attribute: attributeName,
      value: values,
      type: QueryTypes.WhereIn
    });

    return this;
  }

  public whereInArray(attributeName: string, values: any[], unique: boolean = false): QueryBuilderInterface | ModelInterface {

    this.builder.push({
      attribute: attributeName,
      value: values,
      type: QueryTypes.WhereInArray
    });

    return this;
  }

  public gte(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.builder.push({
      attribute: attributeName,
      value,
      type: QueryTypes.GreaterThanEqual
    });
    return this;
  }

  public gt(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.builder.push({
      attribute: attributeName,
      value,
      type: QueryTypes.GreaterThan
    });
    return this;
  }

  public lte(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.builder.push({
      attribute: attributeName,
      value,
      type: QueryTypes.LessThanEqual
    });
    return this;
  }

  public lt(attributeName: string, value: any): QueryBuilderInterface | ModelInterface {
    this.builder.push({
      attribute: attributeName,
      value,
      type: QueryTypes.LessThan
    });
    return this;
  }

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
}
