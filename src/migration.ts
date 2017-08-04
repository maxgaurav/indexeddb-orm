interface TableColumn {
    name: string,
    index?: string[]|string,
    attributes?: IDBIndexParameters
}

export interface TableSchema {
    name: string,
    primary?: string,
    columns: TableColumn[],
    drop?:boolean,
    dropColumns?:string[]
}

export class Migration {

    public objectStores : IDBObjectStore[] = [];

    constructor(private db: IDBDatabase, private transaction: IDBTransaction|null, private migrations: TableSchema[]) {
    }

    /**
     * Function creates various stores
     * @param {TableSchema} schema
     */
    public createStore(schema: TableSchema) {

        let primary = schema.primary || '_id';

        let objectStore = this.db.createObjectStore(schema.name, {
            keyPath : primary,
            autoIncrement: true
        });

        this.objectStores.push(objectStore);

        if (schema.columns) {
            schema.columns.forEach((column) => this.makeIndex(column, objectStore));
        }


    }

    /**
     * Function runs the migration check on all schema
     */
    public run() {
        this.migrations.forEach((schema) => {
            if(this.db.objectStoreNames.contains(schema.name)){

                if(schema.drop){
                    this.db.deleteObjectStore(schema.name);
                }else{
                    this.updateStore(schema);
                }

            }else{
                this.createStore(schema);
            }
        });
    }

    // noinspection JSMethodCanBeStatic
    public makeIndex(column: TableColumn, objectStore: IDBObjectStore) {
        column.attributes = column.attributes || {};
        column.index = column.index || column.name;
        objectStore.createIndex(column.name, column.index, column.attributes);
    }

    /**
     * Function updates the various store content
     * @param {TableSchema} schema
     */
    private  updateStore(schema: TableSchema) {

        let objectStore = this.transaction.objectStore(schema.name);

        if (schema.columns) {

            schema.columns.forEach((column) => {
                if(!objectStore.indexNames.contains(column.name)){
                    this.makeIndex(column, objectStore)
                }
            });
        }

        if(schema.dropColumns) {
            schema.dropColumns.forEach((column) => {
                if(objectStore.indexNames.contains(column)){
                    this.dropIndex(column, objectStore)
                }
            });
        }
    }

    // noinspection JSMethodCanBeStatic
    public dropIndex(columnName: string, objectStore: IDBObjectStore) {
        objectStore.deleteIndex(columnName);
    }

}
