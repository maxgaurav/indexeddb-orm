import {ModelInterface} from "./interfaces";
import {Builder} from "./builder";

export class WorkerModel extends Builder implements ModelInterface{

    constructor(private worker: Worker, public name: string, public primary: string) {
        super();
    }


    public find(id: number) : Promise<any> {
        return new Promise((resolve) => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action:  'find', content: this.getStringify([id])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    public first() : Promise<any> {
        return new Promise((resolve) => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action:  'first', content: this.getStringify([])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    public get() : Promise<any> {
        return new Promise((resolve) => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'get', content: this.getStringify([])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    /**
     * Function creates a single record
     * @param data
     * @returns {Promise}
     */
    create(data): Promise<any> {
        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'create', content: this.getStringify([data])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    /**
     * Function creates list of records passed
     * @param dataRecords
     * @returns {Promise}
     */
    createMultiple(dataRecords: any[]): Promise<any[]> {
        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'createMultiple', content: this.getStringify([dataRecords])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    /**
     * Function updates the various records with matching values
     * @param data
     * @returns {Promise}
     */
    update(data): Promise<number> {

        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'update', content: this.getStringify([data])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    /**
     * Function updates the record at the given id
     * @param id
     * @param data
     * @returns {Promise}
     */
    save(id: number, data: any): Promise<boolean> {
        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'save', content: this.getStringify([id, data])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    /**
     * Function deletes the entries at the given point
     * @param id
     * @returns {Promise}
     */
    destroyId(id): Promise<any> {
        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'destroyId', content: this.getStringify([id])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    destroy(): Promise<any> {
        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'destroyId', content: this.getStringify([])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    /**
     * Function counts the number of records
     * @returns {Promise}
     */
    count(): Promise<number> {
        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'count', content: this.getStringify([])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    /**
     * Function averages the numeric value at the given point
     * @param attribute
     * @returns {Promise}
     */
    average(attribute: string): Promise<number> {
        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'average', content: this.getStringify([attribute])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    /**
     * Reduce function is called with each passing iterator value and reduced value is returned
     * @param func
     * @param defaultCarry
     * @returns {Promise}
     */
    reduce(func: (value: any, result: any) => any, defaultCarry: any): Promise<any> {
        return new Promise(resolve => {
            let ms = new MessageChannel();

            this.worker.postMessage({command: 'action', modelName: this.name, query: this.getStringify(this.getBuilder()), action : 'reduce', content: this.getStringify([func, defaultCarry])}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }

                resolve(e.data.content);
            }
        });
    }

    // noinspection JSMethodCanBeStatic
    private getStringify(content: any) : string {
        return JSON.stringify(content, (key, value) => {
            return (typeof value === 'function' ) ? value.toString() : value;
        });
    }


}