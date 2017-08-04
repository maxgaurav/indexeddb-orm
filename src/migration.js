var Migration = (function () {
    function Migration(db, transaction, migrations) {
        this.db = db;
        this.transaction = transaction;
        this.migrations = migrations;
        this.objectStores = [];
    }
    /**
     * Function creates various stores
     * @param {TableSchema} schema
     */
    Migration.prototype.createStore = function (schema) {
        var _this = this;
        var primary = schema.primary || '_id';
        var objectStore = this.db.createObjectStore(schema.name, {
            keyPath: primary,
            autoIncrement: true
        });
        this.objectStores.push(objectStore);
        if (schema.columns) {
            schema.columns.forEach(function (column) { return _this.makeIndex(column, objectStore); });
        }
    };
    /**
     * Function runs the migration check on all schema
     */
    Migration.prototype.run = function () {
        var _this = this;
        this.migrations.forEach(function (schema) {
            if (_this.db.objectStoreNames.contains(schema.name)) {
                if (schema.drop) {
                    _this.db.deleteObjectStore(schema.name);
                }
                else {
                    _this.updateStore(schema);
                }
            }
            else {
                _this.createStore(schema);
            }
        });
    };
    // noinspection JSMethodCanBeStatic
    Migration.prototype.makeIndex = function (column, objectStore) {
        column.attributes = column.attributes || {};
        column.index = column.index || column.name;
        objectStore.createIndex(column.name, column.index, column.attributes);
    };
    /**
     * Function updates the various store content
     * @param {TableSchema} schema
     */
    Migration.prototype.updateStore = function (schema) {
        var _this = this;
        var objectStore = this.transaction.objectStore(schema.name);
        if (schema.columns) {
            schema.columns.forEach(function (column) {
                if (!objectStore.indexNames.contains(column.name)) {
                    _this.makeIndex(column, objectStore);
                }
            });
        }
        if (schema.dropColumns) {
            schema.dropColumns.forEach(function (column) {
                if (objectStore.indexNames.contains(column)) {
                    _this.dropIndex(column, objectStore);
                }
            });
        }
    };
    // noinspection JSMethodCanBeStatic
    Migration.prototype.dropIndex = function (columnName, objectStore) {
        objectStore.deleteIndex(columnName);
    };
    return Migration;
}());
export { Migration };
