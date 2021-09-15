import {
  DEFAULT_PRIMARY_ID,
  ModelInterface,
  ModelKeysInterface,
  RelationTypes,
  TransactionModes,
} from './model.interface.js';
import {
  DEFAULT_SYNC_COLUMN_NAME,
  TableSchema,
} from '../migration/migration.interface.js';
import { Connector } from '../connection/connector.js';
import { FindOrCreateActions } from './find-or-create-actions.js';
import { HasOne } from '../relations/has-one.js';
import { HasMany } from '../relations/has-many.js';
import { HasManyMulti } from '../relations/has-many-multi.js';
import { HasManyThroughMulti } from '../relations/has-many-through-multi.js';
import { Relations } from '../relations/relations.js';
import { mergeDeep as mergeDeepUtil } from '../utils.js';

export class Model extends FindOrCreateActions implements ModelInterface {
  protected transaction: IDBTransaction | null = null;

  public constructor(
    public db: IDBDatabase,
    public table: TableSchema,
    public connector: Connector,
  ) {
    super(db, table);
  }

  /**
   * Syncs data at primary index and returns newly updated record
   * @param id
   * @param data
   * @param mergeDeep [Defaults true]
   */
  public async sync<T>(id: any, data: any, mergeDeep?: boolean): Promise<T>;
  public async sync(id: any, data: any, mergeDeep = true): Promise<any> {
    await this.findOrCreate(id, data);
    await this.save(id, this.syncObj(data), mergeDeep);
    return this.find(id);
  }

  /**
   * Syncs data at index and returns newly updated record.
   * If no record is found then it will create it with the data provided.
   * @param indexName
   * @param id
   * @param data
   * @param mergeDeep [Defaults true]
   */
  public async syncIndex<T>(
    indexName: string,
    id: any,
    data: any,
    mergeDeep?: boolean,
  ): Promise<T>;
  public async syncIndex(
    indexName: string,
    id: any,
    data: any,
    mergeDeep = true,
  ): Promise<any> {
    await this.findIndexOrCreate(indexName, id, data);
    await this.saveIndex(indexName, id, this.syncObj(data), mergeDeep);
    return this.findIndex(indexName, id);
  }

  /**
   * Syncs data at index and returns newly updated record.
   * If no record is found then it will create it with the data provided.
   * @param indexName
   * @param id
   * @param data
   * @param mergeDeep [Defaults true]
   */
  public async syncAllIndex<T>(
    indexName: string,
    id: any,
    data: any,
    mergeDeep?: boolean,
  ): Promise<T[]>;
  public async syncAllIndex(
    indexName: string,
    id: any,
    data: any,
    mergeDeep = true,
  ): Promise<any[]> {
    await this.saveAllIndex(indexName, id, this.syncObj(data), mergeDeep);
    return (this.resetBuilder().whereIndex(indexName, id) as Model).all();
  }

  /**
   * Opens new transaction for all models and returns transaction instance
   * @param mode
   */
  public openTransaction(mode: TransactionModes): {
    models: ModelKeysInterface;
    transaction: IDBTransaction;
  } {
    const transaction = this.db.transaction(
      this.connector.migrationSchema.tables.map((table) => table.name),
      mode,
    );

    const models: ModelKeysInterface<any> = {};

    for (const table of this.connector.migrationSchema.tables) {
      Object.defineProperty(models, table.name, {
        get: () => {
          let model: ModelInterface;
          if (this.table.ormClass) {
            model = new this.table.ormClass(
              <IDBDatabase>this.db,
              table,
              this.connector,
            );
          } else {
            model = new Model(<IDBDatabase>this.db, table, this.connector);
          }

          model.setTransaction(transaction);
          return model;
        },
      });
    }

    return { models, transaction };
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
          loader = new HasManyThroughMulti(
            this.db,
            this.connector,
            this,
            relation,
          );
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

      const relation = <Relations>Reflect.get(this, customRelation)();
      relationPromises.push(relation.fetch(results));
    }

    return relationPromises;
  }

  /**
   * Adds sync column if table requires to have sync date
   * @param data
   */
  private syncObj(data: any): any {
    if (this.table.syncColumn) {
      const attr = this.table.syncColumnName || DEFAULT_SYNC_COLUMN_NAME;
      const obj: { [key: string]: any | Date } = {};
      obj[attr] = new Date();
      return mergeDeepUtil(data, obj);
    }

    return data;
  }
}
