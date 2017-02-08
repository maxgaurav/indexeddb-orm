class Migration {
    constructor(db, migrations) {
        this.db = db;
        this.migrations = migrations;
        this.objectStores = [];
    }

    createStore(schema) {
        let mig = this;
        let primary = schema.primary || 'id';

        let objectStore = mig.db.createObjectStore(schema.name, {keyPath: primary, autoIncrement: true});
        mig.objectStores.push(objectStore);

        if (schema.columns) {
            schema.columns.forEach((column) => mig.makeIndex(column, objectStore));
        }

    }

    run() {
        let mig = this;

        mig.migrations.forEach((schema) => mig.createStore(schema));
    }

    makeIndex(column, objectStore) {
        column.attributes = column.attributes || {};
        column.index = column.index || column.name;
        objectStore.createIndex(column.name, column.index, column.attributes);
    }
}
