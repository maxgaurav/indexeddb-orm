import {TableSchema} from "../migration/migration.interface.js";
import {Connector} from "../connection/connector.js";
import {HasOne} from "../relations/has-one.js";
import {HasMany} from "../relations/has-many.js";
import {HasManyThroughMulti} from "../relations/has-many-through-multi.js";
import {HasManyMulti} from "../relations/has-many-multi.js";

export const DEFAULT_PRIMARY_ID = '_id';

export interface AggregateInterface {
  count(): Promise<number>;

  average(attribute: string): Promise<number>;

  reduce<T, U>(func: (value: U, result: any) => any, defaultCarry?: any): Promise<T>;

  reduce<T>(func: (value: any, result: any) => any, defaultCarry?: any): Promise<T>;

  reduce(func: (value: any, result: any) => any, defaultCarry?: any): Promise<any>;
}

export enum TransactionModes {
  ReadOnly = 'readonly',
  Write = 'readwrite',
  VersionChange = 'versionchange'
}

export enum RelationTypes {
  HasOne = 'hasOne',
  HasMany = 'hasMany',
  HasManyMultiEntry = 'hasManyMultiEntry',
  HasManyThroughMultiEntry = 'hasManyThroughMultiEntry'
}

export interface Relation {
  model: ModelInterface | string;
  type: RelationTypes;
  foreignKey: string;
  attributeName?: string | undefined;
  localKey?: string | undefined;

  func?(builder: QueryBuilderInterface): QueryBuilderInterface;
}

export interface OrmRelationBuilderInterface {
  hasOne(model: ModelConstructorInterface, foreignKey: string, localKey?: string, parentKeyName?: string): HasOne;

  hasMany(model: ModelConstructorInterface, foreignKey: string, localKey?: string, parentKeyName?: string): HasMany;

  hasManyMultiEntry(model: ModelConstructorInterface, foreignKey: string, localKey?: string, parentKeyName?: string): HasManyMulti;

  hasManyThroughMultiEntry(model: ModelConstructorInterface, foreignKey: string, localKey?: string, parentKeyName?: string): HasManyThroughMulti;
}

export interface RelationQueryBuilder {
  relations: Relation[];

  customRelations: string[];

  tableNames(relations: TableSchema[]): string[];

  with(relations: Relation[]): RelationQueryBuilder | ModelInterface;

  withCustom(relations: string[]): RelationQueryBuilder | ModelInterface;

  /**
   * @deprecated
   * @param modelName
   * @param type
   * @param localKey
   * @param foreignKey
   * @param func
   */
  relation(modelName: string, type: RelationTypes, localKey: string, foreignKey: string, func?: (builder: QueryBuilderInterface) => QueryBuilderInterface
  ): RelationQueryBuilder | ModelInterface;
}

export enum QueryTypes {
  Between = 'between',
  Where = 'where',
  WhereIn = 'whereIn',
  WhereInArray = 'whereInArray',
  GreaterThan = 'gt',
  GreaterThanEqual = 'gte',
  LessThanEqual = 'lte',
  LessThan = 'lt',
}

export enum CursorDirection {
  Ascending = 'next',
  AscendingUnique = 'nextunique',
  Descending = 'prev',
  DescendingUnique = 'prevunique'
}

export interface IndexBuilder {
  index: string;
  value: any | any[];
  type: QueryTypes;
}

export interface Builder {
  attribute: string;
  value: any;
  type: QueryTypes;
}

export interface QueryBuilderInterface extends RelationQueryBuilder {
  indexBuilder: IndexBuilder | null;

  builder: Builder[];

  cursor: CursorDirection | null;

  whereIndex(indexName: string, value: any): QueryBuilderInterface | ModelInterface;

  whereIndexIn(indexName: string, values: any[]): QueryBuilderInterface | ModelInterface;

  whereMultiIndexIn(indexName: string, values: any[], unique?: boolean): QueryBuilderInterface | ModelInterface;

  indexGte(indexName: string, value: any): QueryBuilderInterface | ModelInterface;

  indexGt(indexName: string, value: any): QueryBuilderInterface | ModelInterface;

  indexLt(indexName: string, value: any): QueryBuilderInterface | ModelInterface;

  indexLte(indexName: string, value: any): QueryBuilderInterface | ModelInterface;

  indexBetween(indexName: string, lower: any, upper: any): QueryBuilderInterface | ModelInterface;

  where(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;

  whereIn(attributeName: string, values: any[]): QueryBuilderInterface | ModelInterface;

  gte(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;

  gt(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;

  lte(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;

  lt(attributeName: string, value: any): QueryBuilderInterface | ModelInterface;

  between(attributeName: string, lower: any, upper: any): QueryBuilderInterface | ModelInterface;

  whereInArray(attributeName: string, values: any[], unique: boolean): QueryBuilderInterface | ModelInterface;

  cursorDirection(direction: CursorDirection): QueryBuilderInterface | ModelInterface;

  keyRange(indexBuilder: IndexBuilder): IDBKeyRange;

  resetBuilder(): QueryBuilderInterface | ModelInterface;
}

export interface TransactionHandling {
  getTransaction(stores: string[], mode: TransactionModes, overwrite: boolean): IDBTransaction;

  setTransaction(transaction: IDBTransaction): void;

  createTransaction(stores: string[], mode: TransactionModes): IDBTransaction;

  openTransaction(mode: TransactionModes): { models: ModelKeysInterface, transaction: IDBTransaction };
}

export interface ActionOrFailInterface {
  findOrFail<T>(id: any): Promise<T | null>;

  findOrFail(id: any): Promise<any | null>;

  findIndexOrFail<T>(indexName: string, id: any): Promise<T>;

  findIndexOrFail(indexName: string, id: any): Promise<any>;

  firstOrFail(): Promise<any>;

  firstOrFail<T>(): Promise<T>;

  firstOrCreate<T>(data: any): Promise<T>;

  firstOrCreate(data: any): Promise<any>;

  findOrCreate<T>(id: any, data: any): Promise<T>;

  findOrCreate(id: any, data: any): Promise<any>;

  findIndexOrCreate<T>(indexName: string, id: any, data: any): Promise<T>;

  findIndexOrCreate(indexName: string, id: any, data: any): Promise<any>;
}

export interface ModelConstructorInterface {
  new(db: IDBDatabase, table: TableSchema, connector: Connector): ModelInterface;

  readonly prototype: ModelInterface;
  TableName: string;
}

export interface ModelInterface extends AggregateInterface, RelationQueryBuilder, QueryBuilderInterface, TransactionHandling, ActionOrFailInterface {
  table: TableSchema;

  all<T>(): Promise<T[]>;

  all(): Promise<any[]>;

  create<T>(data: any): Promise<T>;

  create(data: any): Promise<any>;

  createMultiple<T>(entries: any[]): Promise<T[]>;

  createMultiple(entries: any[]): Promise<any[]>;

  update(data: any, mergeDeep: boolean): Promise<number>;

  delete(id: any): Promise<boolean>;

  destroy(): Promise<boolean>;

  deleteIndex(indexName: string, value: any, isMulti: boolean): Promise<boolean>;

  find<T>(id: any): Promise<T | null>;

  find(id: any): Promise<any | null>;

  findIndex<T>(indexName: string, id: any): Promise<T>;

  findIndex(indexName: string, id: any): Promise<any>;

  findIndexAll<T>(indexName: string, id: any): Promise<T[]>;

  findIndexAll(indexName: string, id: any): Promise<any[]>;

  first(): Promise<any>;

  first<T>(): Promise<T>;

  save(id: any, data: any, mergeDeep: boolean): Promise<boolean>;

  /**
   * @deprecated
   * @param id
   */
  destroyId(id: any): Promise<boolean>;

  truncate(): Promise<boolean>;

}

export interface ModelKeysInterface {
  [key: string]: ModelInterface;
}
