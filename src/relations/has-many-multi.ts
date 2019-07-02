import {Relations} from "./relations.js";
import {Connector} from "../connection/connector.js";
import {ModelInterface, Relation} from "../models/model.interface.js";

export class HasManyMulti extends Relations {

  constructor(
    public db: IDBDatabase,
    public connector: Connector,
    protected parentModel: ModelInterface,
    public childRelation: Relation
  ) {
    super();
  }

  public async fetch(results: any[]): Promise<any[]> {
    let model = this.getRelationModel(this.childRelation);
    model = this.filteredModel(model, this.childRelation);

    const values = results.map(result => result[this.getLocalKey(this.parentModel, this.childRelation)]);
    model.whereMultiIndexIn(this.childRelation.foreignKey, values);

    const relationResults = await model.all();

    return this.bindResults(results, relationResults, this.childRelation);
  }

  public bindResults(parentResults: any[], relationResults: any[], relation: Relation): Promise<any> {
    const localKey = this.getLocalKey(this.parentModel, this.childRelation);

    parentResults.forEach(parentResult => {
      parentResult[this.getAttributeName(this.parentModel, relation)] = relationResults.filter(
        (relationResult: any) => !!relationResult[relation.foreignKey].find(
          (multiValue: any) => multiValue === parentResult[localKey]
        )
      );
    });

    return Promise.resolve(parentResults);
  }
}
