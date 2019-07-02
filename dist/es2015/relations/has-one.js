import { Relations } from "./relations.js";
import { CursorDirection } from "../models/model.interface.js";
export class HasOne extends Relations {
    constructor(db, connector, parentModel, childRelation) {
        super();
        this.db = db;
        this.connector = connector;
        this.parentModel = parentModel;
        this.childRelation = childRelation;
    }
    async fetch(results) {
        let model = this.getRelationModel(this.childRelation);
        model = this.filteredModel(model, this.childRelation);
        let relationResults = [];
        // optimizing query
        if (results.length === 1) {
            model.whereIndex(this.childRelation.foreignKey, results[0][this.getLocalKey(this.parentModel, this.childRelation)]);
            relationResults = [await model.first()];
        }
        else {
            const values = results.map(result => result[this.getLocalKey(this.parentModel, this.childRelation)]);
            model.whereIndexIn(this.childRelation.foreignKey, values)
                .cursorDirection(CursorDirection.AscendingUnique);
            relationResults = await model.all();
        }
        return this.bindResults(results, relationResults, this.childRelation);
    }
    bindResults(parentResults, relationResults, relation) {
        const localKey = this.getLocalKey(this.parentModel, this.childRelation);
        parentResults.forEach(result => {
            const mappedResult = relationResults.find(relationResult => relationResult[relation.foreignKey] === result[localKey]);
            result[this.getAttributeName(this.parentModel, relation)] = mappedResult || null;
        });
        return Promise.resolve(parentResults);
    }
}
//# sourceMappingURL=has-one.js.map