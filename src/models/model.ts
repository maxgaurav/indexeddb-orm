import {
  DEFAULT_PRIMARY_ID,
  ModelInterface,
  ModelKeysInterface, RelationTypes,
  TransactionModes
} from "./model.interface.js";
import {TableSchema} from "../migration/migration.interface.js";
import {Connector} from "../connection/connector.js";
import {FindOrCreateActions} from "./find-or-create-actions.js";
import {HasOne} from "../relations/has-one.js";
import {HasMany} from "../relations/has-many.js";
import {HasManyMulti} from "../relations/has-many-multi.js";
import {HasManyThroughMulti} from "../relations/has-many-through-multi.js";
import {Relations} from "../relations/relations.js";

export class Model extends FindOrCreateActions implements ModelInterface {

  protected transaction: IDBTransaction | null = null;

  public constructor(public db: IDBDatabase, public table: TableSchema, public connector: Connector) {
    super(db, table);
  }

  /**
   * Syncs data at primary index and returns newly updated record
   * @param id
   * @param data
   * @param mergeDeep [Defaults true]
   */
  public async sync<T>(id: any, data: any, mergeDeep?: boolean): Promise<T>;
  public async sync(id: any, data: any, mergeDeep: boolean = true): Promise<any> {
    await this.save(id, data, mergeDeep);
    return this.find(id);
  }

  /**
   * Syncs data at index and returns newly updated record
   * @param indexName
   * @param id
   * @param data
   * @param mergeDeep [Defaults true]
   */
  public async syncIndex<T>(indexName: string, id: any, data: any, mergeDeep?: boolean): Promise<T>;
  public async syncIndex(indexName: string, id: any, data: any, mergeDeep: boolean = true): Promise<any> {
    await this.saveIndex(indexName, id, data, mergeDeep);
    return this.findIndex(indexName, id);
  }

  /**
   * Syncs data at index and returns newly updated record
   * @param indexName
   * @param id
   * @param data
   * @param mergeDeep [Defaults true]
   */
  public async syncAllIndex<T>(indexName: string, id: any, data: any, mergeDeep?: boolean): Promise<T[]>;
  public async syncAllIndex(indexName: string, id: any, data: any, mergeDeep: boolean = true): Promise<any[]> {
    await this.saveAllIndex(indexName, id, data, mergeDeep);
    return (this.resetBuilder().whereIndex(indexName, id) as Model).all();
  }

  /**
   * Opens new transaction for all models and returns transaction instance
   * @param mode
   */
  public openTransaction(mode: TransactionModes): { models: ModelKeysInterface, transaction: IDBTransaction } {

    const transaction = this.db.transaction(this.connector.migrationSchema.tables.map(table => table.name));

    const models: { [key: string]: ModelInterface } = {};

    for (const table of this.connector.migrationSchema.tables) {

      Object.defineProperty(models, table.name, {
        get: () => {
          const model = new Model(<IDBDatabase>this.db, table, this.connector);
          model.setTransaction(transaction);
          return model;
        }
      });
    }

    return {models, transaction};
  }

  /**
   * Loads relations against the model results
   *
   * @param results
   */
  protected loadRelations(results: any[]): Promise<any>[] {
    const relationsArray: Promise<any>[] = [];

    for (const relation of this.relations) {
      let loader: HasOne | HasMany | HasManyMulti | HasManyThroughMulti;
      switch (relation.type) {
        case RelationTypes.HasOne:
          loader = new HasOne(this.db, this.connector, this, relation);
          relationsArray.push(loader.fetch(results));
          break;
        case RelationTypes.HasMany:
          loader = new HasMany(this.db, this.connector, this, relation);
          relationsArray.push(loader.fetch(results));
          break;
        case RelationTypes.HasManyMultiEntry:
          loader = new HasManyMulti(this.db, this.connector, this, relation);
          relationsArray.push(loader.fetch(results));
          break;
        case RelationTypes.HasManyThroughMultiEntry:
          loader = new HasManyThroughMulti(this.db, this.connector, this, relation);
          relationsArray.push(loader.fetch(results));
          break;
        default:
          throw new Error(`Unknown relation ${relation.type}`);
      }
    }

    return relationsArray.concat(this.loadCustomRelations(results));
  }

  /**
   * The primary key of the model
   */
  public get primaryId(): string {
    return this.table.primary || DEFAULT_PRIMARY_ID;
  }

  /**
   * Loads custom relation created in the ORM classes extending the base model class
   * @param results
   */
  protected loadCustomRelations(results: any[]): Promise<any>[] {
    const relationPromises: Promise<any>[] = [];

    for (const customRelation of this.customRelations) {

      if (!Reflect.has(this, customRelation)) {
        throw new Error(`Method ${customRelation} not defined.`);
      }

      const relation = <Relations>(Reflect.get(this, customRelation)());
      relationPromises.push(relation.fetch(results));
    }

    return relationPromises;
  }
}
