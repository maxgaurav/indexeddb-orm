import { Relations } from './relations.js';
import { Connector } from '../connection/connector.js';
import { Relation } from '../models/model.interface.js';
import { OrmRelationBuilder } from '../models/orm-relation-builder.js';

export class HasMany extends Relations {
  constructor(
    public db: IDBDatabase,
    public connector: Connector,
    protected parentModel: OrmRelationBuilder,
    public childRelation: Relation,
  ) {
    super();
  }

  /**
   * Fetch relation results
   * @param results
   */
  public async fetch(results: any[]): Promise<any> {
    let model = this.getRelationModel(this.childRelation);
    model = this.filteredModel(model, this.childRelation);

    const values = results.map(
      (result) =>
        result[this.getLocalKey(this.parentModel, this.childRelation)],
    );
    model.whereIndexIn(this.childRelation.foreignKey, values);

    const relationResults = await model.all();

    return this.bindResults(results, relationResults, this.childRelation);
  }

  /**
   * Bind relation results to parent results
   * @param parentResults
   * @param relationResults
   * @param relation
   */
  public bindResults(
    parentResults: any[],
    relationResults: any,
    relation: Relation,
  ): Promise<any> {
    const localKey = this.getLocalKey(this.parentModel, this.childRelation);
    parentResults.forEach((parentResult) => {
      parentResult[this.getAttributeName(this.parentModel, relation)] =
        relationResults.filter(
          (relationResult: any) =>
            relationResult[relation.foreignKey] === parentResult[localKey],
        );
    });

    return Promise.resolve(parentResults);
  }
}
