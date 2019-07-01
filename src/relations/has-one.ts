import {Relations} from "./relations.js";
import {Connector} from "../connection/connector.js";
import {CursorDirection, ModelInterface, Relation} from "../models/model.interface.js";

export class HasOne extends Relations {

  constructor(
    public db: IDBDatabase,
    public connector: Connector,
    protected parentModel: ModelInterface,
    public relation: Relation
  ) {
    super();
  }

  public async fetch(results: any[]): Promise<any[]> {
    let model = this.getRelationModel(this.relation);
    model = this.filteredModel(model, this.relation);

    let relationResults: any[] = [];
    // optimizing query
    if (results.length === 1) {
      model.whereIndex(this.relation.foreignKey, results[0][this.getLocalKey(this.parentModel, this.relation)]);
      relationResults = [await model.first()];

    } else {
      const values = results.map(result => result[this.getLocalKey(this.parentModel, this.relation)]);
      model.whereIndexIn(this.relation.foreignKey, values)
        .cursorDirection(CursorDirection.AscendingUnique);

      relationResults = await model.all();
    }

    return this.bindResults(results, relationResults, this.relation);
  }

  public bindResults(parentResults: any[], relationResults: any[], relation: Relation): Promise<any[]> {
    const localKey = this.getLocalKey(this.parentModel, this.relation);
    parentResults.forEach(result => {

      const mappedResult = relationResults.find(relationResult => relationResult[relation.foreignKey] === result[localKey]);
      result[this.getRelationModel(relation).table.name] = mappedResult || null;
    });
    return Promise.resolve(parentResults);
  }
}
