class Migration {
    constructor(db, transaction, migrations) {
        /**
         * @var IDBDatabase db
         */
        this.db = db;
        this.migrations = migrations;
        this.objectStores = [];

        /**
         * @var IDBTransaction transaction
         */
        this.transaction = transaction;
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

        mig.migrations.forEach((schema) => {
            if(mig.db.objectStoreNames.contains(schema.name)){

                if(schema.drop){
                    mig.db.deleteObjectStore(schema.name);
                }else{
                    mig.updateStore(schema);
                }


            }else{
                mig.createStore(schema);
            }
        });
    }

    makeIndex(column, objectStore) {
        column.attributes = column.attributes || {};
        column.index = column.index || column.name;
        objectStore.createIndex(column.name, column.index, column.attributes);
    }

    updateStore(schema) {
        let mig = this;

        let objectStore = mig.transaction.objectStore(schema.name);

        if (schema.columns) {

            schema.columns.forEach((column) => {
                if(!objectStore.indexNames.contains(column.name)){
                    mig.makeIndex(column, objectStore)
                }
            });
        }

        if(schema.dropColumns) {
            schema.dropColumns.forEach((column) => {
                if(objectStore.indexNames.contains(column)){
                    mig.dropIndex(column, objectStore)
                }
            });
        }
    }

    dropIndex(columnName, objectStore) {
        debugger;
        objectStore.deleteIndex(columnName);
    }

}
