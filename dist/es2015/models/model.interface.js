export const DEFAULT_PRIMARY_ID = '_id';
export var TransactionModes;
(function (TransactionModes) {
    TransactionModes["ReadOnly"] = "readonly";
    TransactionModes["Write"] = "readwrite";
    TransactionModes["VersionChange"] = "versionchange";
})(TransactionModes || (TransactionModes = {}));
export var RelationTypes;
(function (RelationTypes) {
    RelationTypes["HasOne"] = "hasOne";
    RelationTypes["HasMany"] = "hasMany";
    RelationTypes["HasManyMultiEntry"] = "hasManyMultiEntry";
    RelationTypes["HasManyThroughMultiEntry"] = "hasManyThroughMultiEntry";
})(RelationTypes || (RelationTypes = {}));
export var QueryTypes;
(function (QueryTypes) {
    QueryTypes["Between"] = "between";
    QueryTypes["Where"] = "where";
    QueryTypes["WhereIn"] = "whereIn";
    QueryTypes["WhereInArray"] = "whereInArray";
    QueryTypes["GreaterThan"] = "gt";
    QueryTypes["GreaterThanEqual"] = "gte";
    QueryTypes["LessThanEqual"] = "lte";
    QueryTypes["LessThan"] = "lt";
})(QueryTypes || (QueryTypes = {}));
export var CursorDirection;
(function (CursorDirection) {
    CursorDirection["Ascending"] = "next";
    CursorDirection["AscendingUnique"] = "nextunique";
    CursorDirection["Descending"] = "prev";
    CursorDirection["DescendingUnique"] = "prevunique";
})(CursorDirection || (CursorDirection = {}));
//# sourceMappingURL=model.interface.js.map