class WorkerModelHandler extends Builder{

    constructor(modelName, workerContent) {
        super();

        this.name = modelName;
        this.worker = workerContent;
        this.setUpHandler();
        this.tables = [modelName];
    }

    /**
     * Finds the model by id
     * @param id
     * @returns {Promise}
     */
    find(id) {
        let model = this;

        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'find', handler);
            model.on(timestamp, 'find-error', errorHandler);

            model.send(id, timestamp, 'find');

            /**
             * normal success handler
             * @param e
             */
            function handler(e) {
                model.removeListener(timestamp, 'find', handler);
                model.removeListener(timestamp, 'find-error', errorHandler());

                resolve(e.detail);
            }

            /**
             * Error handler case
             * @param e
             */
            function errorHandler(e) {
                model.removeListener(timestamp, 'find', errorHandler);
                model.removeListener(timestamp, 'find-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Function fetches list of result matching the criteria
     * @returns {Promise}
     */
    get() {
        let model = this;
        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'get', handler);
            model.on(timestamp, 'get-error', errorHandler);

            model.send({
                tables : model.tables,
                builder : model.builder,
                indexBuilder : model.indexBuilder,
                relations : model.relations
            }, timestamp, 'get');

            function handler(e) {
                model.removeListener(timestamp, 'get', handler);
                model.removeListener(timestamp, 'get-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'get', errorHandler);
                model.removeListener(timestamp, 'get-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Function fetches list of result matching the criteria
     * @returns {Promise}
     */
    first() {
        let model = this;
        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'first', handler);
            model.on(timestamp, 'first-error', errorHandler);

            model.send({
                tables : model.tables,
                builder : model.builder,
                indexBuilder : model.indexBuilder,
                relations : model.relations
            }, timestamp, 'first');

            function handler(e) {
                model.removeListener(timestamp, 'first', handler);
                model.removeListener(timestamp, 'first-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'first', errorHandler);
                model.removeListener(timestamp, 'first-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Creates a record
     * @param data
     * @returns {Promise}
     */
    create(data) {
        let model = this;
        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'create', handler);
            model.on(timestamp, 'create-error', errorHandler);

            model.send(data, timestamp, 'create');

            function handler(e) {
                model.removeListener(timestamp, 'create', handler);
                model.removeListener(timestamp, 'create-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'create', errorHandler);
                model.removeListener(timestamp, 'create-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Creates multiple records
     * @param data Array
     * @returns {Promise}
     */
    createMultiple(data) {
        let model = this;
        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'createMultiple', handler);
            model.on(timestamp, 'createMultiple-error', errorHandler);

            model.send(data, timestamp, 'createMultiple');

            function handler(e) {
                model.removeListener(timestamp, 'createMultiple', handler);
                model.removeListener(timestamp, 'createMultiple-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'createMultiple', errorHandler);
                model.removeListener(timestamp, 'createMultiple-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Function updates the various records with matching values
     * @param data
     * @returns {Promise}
     */
    update(data) {
        let model = this;
        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'update', handler);
            model.on(timestamp, 'update-error', errorHandler);

            model.send(data, timestamp, 'update');

            function handler(e) {
                model.removeListener(timestamp, 'update', handler);
                model.removeListener(timestamp, 'update-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'update', errorHandler);
                model.removeListener(timestamp, 'update-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Function updates the record at the given id
     * @param id
     * @param data
     * @returns {Promise}
     */
    save(id, data) {
        let model = this;
        return new Promise((resolve, reject) => {

            let timestamp = Date.now();
            let content = {
                id : id,
                data : data
            };

            model.on(timestamp, 'save', handler);
            model.on(timestamp, 'save-error', errorHandler);
            model.send(content, timestamp, 'save');

            function handler(e) {
                model.removeListener(timestamp, 'save', handler);
                model.removeListener(timestamp, 'save-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'save', errorHandler);
                model.removeListener(timestamp, 'save-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Function counts the number of records
     * @returns {Promise}
     */
    count() {
        let model = this;
        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'count', handler);
            model.on(timestamp, 'count-error', errorHandler);

            model.send({}, timestamp, 'count');

            function handler(e) {
                model.removeListener(timestamp, 'count', handler);
                model.removeListener(timestamp, 'count-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'count', errorHandler);
                model.removeListener(timestamp, 'count-error', handler);
                reject(e.detail);
            }

        });
    }

    average(attribute) {
        let model = this;
        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'average', handler);
            model.on(timestamp, 'average-error', errorHandler);

            model.send(attribute, timestamp, 'average');

            function handler(e) {
                model.removeListener(timestamp, 'average', handler);
                model.removeListener(timestamp, 'average-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'average', errorHandler);
                model.removeListener(timestamp, 'average-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Reduce function is called with each passing iterator value and reduced value is returned
     * @param func
     * @param defaultCarry
     * @returns {Promise}
     */
    reduce(func, defaultCarry) {
        let model = this;
        return new Promise((resolve, reject) => {
            let timestamp = Date.now();

            model.on(timestamp, 'reduce', handler);
            model.on(timestamp, 'reduce-error', errorHandler);

            let data = {
                func : func,
                defaultCarry : defaultCarry
            };

            model.send(data, timestamp, 'reduce');

            function handler(e) {
                model.removeListener(timestamp, 'reduce', handler);
                model.removeListener(timestamp, 'reduce-error', errorHandler);

                resolve(e.detail);
            }

            function errorHandler(e) {
                model.removeListener(timestamp, 'reduce', errorHandler);
                model.removeListener(timestamp, 'reduce-error', handler);
                reject(e.detail);
            }

        });
    }

    /**
     * Communicates to webworker
     * @param data
     * @param timestamp
     * @param action
     */
    send(data, timestamp, action) {
        let model = this;

        let detail = JSON.stringify(data, (key, value) => {
            return (typeof value === 'function' ) ? value.toString() : value;
        });

        let e = {
            detail : detail,
            action : action,
            timestamp : timestamp,
            model : model.name
        };

        model.worker.postMessage(e);
    }

    /**
     * Sets up basic handler settings to receive messages from worker
     */
    setUpHandler () {
        let model = this;

        //general handler to act up messages sent from web worker
        model.worker.onmessage = function(e) {
            let data = e.data.detail;
            model.emit(data, e.data.timestamp, e.data.action);

        }
    }

    /**
     * Normal emit event on window.document
     *
     * @param data
     * @param timestamp
     * @param action
     */
    emit (data, timestamp, action) {
        let model = this;
        let e = new CustomEvent('idb:worker:' + model.modeName + ':' + timestamp + ':' + action, {
            detail : data
        });

        window.document.dispatchEvent(e);
    }

    /**
     * Removes event listener from window.document
     *
     * @param timestamp
     * @param action
     * @param func
     */
    removeListener(timestamp, action, func) {
        window.document.removeEventListener('idb:worker:' + this.modeName + ':' + timestamp + ':' + action, func);
    }

    /**
     * Listens events on window.document
     *
     * @param timestamp date time stamp
     * @param action action name
     * @param func function to be executed
     */
    on(timestamp, action, func) {
        window.document.addEventListener('idb:worker:' + this.modeName + ':' + timestamp + ':' + action, func);
    }
}