import { Connector } from "./connection/connector.js";
import { Model } from "./models/model.js";
import { Migration } from "./migration/migration.js";
import { CursorDirection, RelationTypes, TransactionModes } from "./models/model.interface.js";
((window) => {
    window.idb = (schema) => {
        return new Connector(schema);
    };
    window.idbTypes = {
        CursorTypes: {
            'AscendingUnique': CursorDirection.AscendingUnique,
            'Ascending': CursorDirection.Ascending,
            'Descending': CursorDirection.Descending,
            'DescendingUnique': CursorDirection.DescendingUnique
        },
        RelationTypes: {
            'HasManyThroughMultiEntry': RelationTypes.HasManyThroughMultiEntry,
            'HasManyMultiEntry': RelationTypes.HasManyMultiEntry,
            'HasMany': RelationTypes.HasMany,
            'HasOne': RelationTypes.HasOne
        },
        TransactionModes: {
            'ReadOnly': TransactionModes.ReadOnly,
            'Write': TransactionModes.Write,
            'VersionChange': TransactionModes.VersionChange,
        }
    };
})(window);
export { Connector, Model, Migration, RelationTypes, CursorDirection };
//# sourceMappingURL=index.js.map