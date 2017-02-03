class Migration {
    constructor(db, migrations){
        this.db = db;
        this.migrations = migrations;
        this.objectStores = [];
    }

    createStore (schema) {
        let migration = this;
        let primary = schema.primary || 'id';

        let objectStore = migration.db.createObjectStore(schema.name, {keyPath : primary, autoIncrement : true});
        migration.objectStores.push(objectStore);

        if(schema.columns){
            schema.columns.forEach((column) => migration.createIndex(column, objectStore));
        }

    }

    run () {
        let migration = this;

        migration.migrations.forEach((schema) => migration.createStore(schema));
    }

    createIndex(column, objectStore) {
        column.attributes = column.attributes || {};
        objectStore.createIndex(column.name, column.name, column.attributes);
    }
}


// export  {
//     Migration
// }