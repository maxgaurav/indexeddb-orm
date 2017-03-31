/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Builder = function () {
    function Builder() {
        _classCallCheck(this, Builder);

        this.builder = [];
        this.indexBuilder = {};
        this.relations = [];
        this.tables = [];
    }

    /**
     * Sets the index builder value as an 'and' reference
     *
     * @param indexName string
     * @param value mixed
     * @returns {Builder}
     */


    _createClass(Builder, [{
        key: 'whereIndex',
        value: function whereIndex(indexName, value) {

            this.indexBuilder = {
                index: indexName,
                value: value,
                type: 'and'
            };

            return this;
        }

        /**
         * Sets the index builder value as an 'in' reference
         * @param indexName
         * @param value
         * @returns {Builder}
         */

    }, {
        key: 'whereIndexIn',
        value: function whereIndexIn(indexName, value) {

            this.indexBuilder = {
                index: indexName,
                value: value,
                type: 'in'
            };

            return this;
        }

        /**
         * Sets the index builder value with point inclusive and sets greater than check
         * @param indexName
         * @param value
         * @returns {Builder}
         */

    }, {
        key: 'indexGte',
        value: function indexGte(indexName, value) {

            this.indexBuilder = {
                index: indexName,
                value: value,
                type: 'gte'
            };

            return this;
        }

        /**
         * Sets the index builder value with point not inclusive and sets greater than check
         * @param indexName
         * @param value
         * @returns {Builder}
         */

    }, {
        key: 'indexGt',
        value: function indexGt(indexName, value) {

            this.indexBuilder = {
                index: indexName,
                value: value,
                type: 'gt'
            };

            return this;
        }

        /**
         * Sets the index builder value with point inclusive and sets less than check
         * @param indexName
         * @param value
         * @returns {Builder}
         */

    }, {
        key: 'indexLte',
        value: function indexLte(indexName, value) {

            this.indexBuilder = {
                index: indexName,
                value: value,
                type: 'lte'
            };

            return this;
        }

        /**
         * Sets the index builder value with point not inclusive and sets less than check
         *
         * @param indexName
         * @param value
         * @returns {Builder}
         */

    }, {
        key: 'indexLt',
        value: function indexLt(indexName, value) {

            this.indexBuilder = {
                index: indexName,
                value: value,
                type: 'lt'
            };

            return this;
        }

        /**
         * Sets the index builder value with points inclusive and sets range between them
         * @param indexName
         * @param lower
         * @param upper
         * @returns {Builder}
         */

    }, {
        key: 'indexBetween',
        value: function indexBetween(indexName, lower, upper) {

            this.indexBuilder = {
                index: indexName,
                value: [lower, upper],
                type: 'between'
            };

            return this;
        }
    }, {
        key: 'whereIn',
        value: function whereIn(attributeName, value) {
            this.builder.push({
                attribute: attributeName,
                value: value,
                type: 'in'
            });

            return this;
        }
    }, {
        key: 'where',
        value: function where(attributeName, value) {
            this.builder.push({
                attribute: attributeName,
                value: value,
                type: 'and'
            });

            return this;
        }
    }, {
        key: 'gte',
        value: function gte(attributeName, value) {
            this.builder.push({
                attribute: attributeName,
                value: value,
                type: 'gte'
            });

            return this;
        }
    }, {
        key: 'gt',
        value: function gt(attributeName, value) {
            this.builder.push({
                attribute: attributeName,
                value: value,
                type: 'gt'
            });

            return this;
        }
    }, {
        key: 'lte',
        value: function lte(attributeName, value) {
            this.builder.push({
                attribute: attributeName,
                value: value,
                type: 'lte'
            });

            return this;
        }
    }, {
        key: 'lt',
        value: function lt(attributeName, value) {
            this.builder.push({
                attribute: attributeName,
                value: value,
                type: 'lt'
            });

            return this;
        }
    }, {
        key: 'between',
        value: function between(attributeName, upper, lower) {
            uppper = parseFloat(upper);
            lower = parseFloat(lower);

            if (isNaN(upper) || isNaN(lower)) {
                throw "Between is only for numeric values";
            }

            this.builder.push({
                attribute: attributeName,
                value: [upper, lower],
                type: 'between'
            });

            return this;
        }
    }, {
        key: 'relation',
        value: function relation(modelName, type, localKey, foreignKey, func, primary) {
            this.tables.push(modelName);

            this.relations.push({
                modelName: modelName,
                func: func,
                localKey: localKey,
                foreignKey: foreignKey,
                type: type,
                primary: primary
            });

            return this;
        }
    }, {
        key: 'RELATIONS',
        get: function get() {
            return Builder.RELATIONS;
        }
    }], [{
        key: 'helpers',
        get: function get() {

            return {
                checkNestedAttribute: function checkNestedAttribute(attributeString, value, condition) {
                    return condition == Model.helpers.getNestedAttribute(attributeString, value);
                },
                getNestedAttribute: function getNestedAttribute(attributeString, value) {
                    var attributes = attributeString.split('.');
                    var i = void 0;
                    var content = value;

                    for (i = 0; i < attributes.length; i++) {
                        if (content[attributes[i]] === undefined) {
                            return undefined;
                        }

                        content = content[attributes[i]];
                    }

                    return content;
                },
                replaceNestedValues: function replaceNestedValues(attributes, value) {
                    for (var attribute in attributes) {
                        value[attribute] = attributes[attribute];
                    }

                    return value;
                }
            };
        }
    }, {
        key: 'RELATIONS',
        get: function get() {
            return {
                hasOne: 'hasOne',
                hasMany: 'hasMany'
            };
        }
    }]);

    return Builder;
}();

var WorkerModelHandler = function (_Builder) {
    _inherits(WorkerModelHandler, _Builder);

    function WorkerModelHandler(modelName, workerContent, Q) {
        _classCallCheck(this, WorkerModelHandler);

        var _this = _possibleConstructorReturn(this, (WorkerModelHandler.__proto__ || Object.getPrototypeOf(WorkerModelHandler)).call(this));

        _this.name = modelName;
        _this.worker = workerContent;
        _this.setUpHandler();
        _this.tables = [modelName];
        _this.Promise = Q;
        return _this;
    }

    /**
     * Finds the model by id
     * @param id
     * @returns {Promise}
     */


    _createClass(WorkerModelHandler, [{
        key: 'find',
        value: function find(id) {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

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

    }, {
        key: 'get',
        value: function get() {
            var model = this;
            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

                model.on(timestamp, 'get', handler);
                model.on(timestamp, 'get-error', errorHandler);

                model.send({
                    tables: model.tables,
                    builder: model.builder,
                    indexBuilder: model.indexBuilder,
                    relations: model.relations
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

    }, {
        key: 'first',
        value: function first() {
            var model = this;
            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

                model.on(timestamp, 'first', handler);
                model.on(timestamp, 'first-error', errorHandler);

                model.send({
                    tables: model.tables,
                    builder: model.builder,
                    indexBuilder: model.indexBuilder,
                    relations: model.relations
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

    }, {
        key: 'create',
        value: function create(data) {
            var model = this;
            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

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

    }, {
        key: 'createMultiple',
        value: function createMultiple(data) {
            var model = this;
            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

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

    }, {
        key: 'update',
        value: function update(data) {
            var model = this;
            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

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

    }, {
        key: 'save',
        value: function save(id, data) {
            var model = this;
            return new model.Promise(function (resolve, reject) {

                var timestamp = Date.now();
                var content = {
                    id: id,
                    data: data
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
         * Function deletes the entries at the given point
         * @param id
         * @returns {Promise}
         */

    }, {
        key: 'destroyId',
        value: function destroyId(id) {
            var model = this;
            return new model.Promise(function (resolve, reject) {

                var timestamp = Date.now();

                model.on(timestamp, 'destroyId', handler);
                model.on(timestamp, 'destroyId-error', errorHandler);
                model.send(id, timestamp, 'destroyId');

                function handler(e) {
                    model.removeListener(timestamp, 'destroyId', handler);
                    model.removeListener(timestamp, 'destroyId-error', errorHandler);

                    resolve(e.detail);
                }

                function errorHandler(e) {
                    model.removeListener(timestamp, 'destroyId', errorHandler);
                    model.removeListener(timestamp, 'destroyId-error', handler);
                    reject(e.detail);
                }
            });
        }

        /**
         * Function deletes the entries
         * @returns {Promise}
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            var model = this;
            return new model.Promise(function (resolve, reject) {

                var timestamp = Date.now();

                model.on(timestamp, 'destroy', handler);
                model.on(timestamp, 'destroy-error', errorHandler);
                model.send({}, timestamp, 'destroy');

                function handler(e) {
                    model.removeListener(timestamp, 'destroy', handler);
                    model.removeListener(timestamp, 'destroy-error', errorHandler);

                    resolve(e.detail);
                }

                function errorHandler(e) {
                    model.removeListener(timestamp, 'destroy', errorHandler);
                    model.removeListener(timestamp, 'destroy-error', handler);
                    reject(e.detail);
                }
            });
        }

        /**
         * Function counts the number of records
         * @returns {Promise}
         */

    }, {
        key: 'count',
        value: function count() {
            var model = this;
            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

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
    }, {
        key: 'average',
        value: function average(attribute) {
            var model = this;
            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

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

    }, {
        key: 'reduce',
        value: function reduce(func, defaultCarry) {
            var model = this;
            return new model.Promise(function (resolve, reject) {
                var timestamp = Date.now();

                model.on(timestamp, 'reduce', handler);
                model.on(timestamp, 'reduce-error', errorHandler);

                var data = {
                    func: func,
                    defaultCarry: defaultCarry
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

    }, {
        key: 'send',
        value: function send(data, timestamp, action) {
            var model = this;

            var detail = JSON.stringify(data, function (key, value) {
                return typeof value === 'function' ? value.toString() : value;
            });

            var e = {
                detail: detail,
                action: action,
                timestamp: timestamp,
                model: model.name
            };

            model.worker.postMessage(e);
        }

        /**
         * Sets up basic handler settings to receive messages from worker
         */

    }, {
        key: 'setUpHandler',
        value: function setUpHandler() {
            var model = this;

            //general handler to act up messages sent from web worker
            model.worker.onmessage = function (e) {
                var data = e.data.detail;
                model.emit(data, e.data.timestamp, e.data.action);
            };
        }

        /**
         * Normal emit event on window.document
         *
         * @param data
         * @param timestamp
         * @param action
         */

    }, {
        key: 'emit',
        value: function emit(data, timestamp, action) {
            var model = this;
            var e = new CustomEvent('idb:worker:' + model.modeName + ':' + timestamp + ':' + action, {
                detail: data
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

    }, {
        key: 'removeListener',
        value: function removeListener(timestamp, action, func) {
            window.document.removeEventListener('idb:worker:' + this.modeName + ':' + timestamp + ':' + action, func);
        }

        /**
         * Listens events on window.document
         *
         * @param timestamp date time stamp
         * @param action action name
         * @param func function to be executed
         */

    }, {
        key: 'on',
        value: function on(timestamp, action, func) {
            window.document.addEventListener('idb:worker:' + this.modeName + ':' + timestamp + ':' + action, func);
        }
    }]);

    return WorkerModelHandler;
}(Builder);

var Model = function (_Builder2) {
    _inherits(Model, _Builder2);

    function Model(db, idbKey, modelName, primary, Q) {
        _classCallCheck(this, Model);

        var _this2 = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this));

        _this2.name = modelName;
        _this2.db = db;
        _this2.primary = primary;
        _this2.tables = [_this2.name];
        _this2.idbKey = idbKey;
        _this2.hasIdbKey = _this2.idbKey ? true : false;
        _this2.transaction = null;
        _this2.attributes = {};
        _this2.Promise = Q;
        return _this2;
    }

    /**
     * Finds the result on the primary key defined
     * @param id
     * @returns {Promise}
     */


    _createClass(Model, [{
        key: 'find',
        value: function find(id) {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READONLY);
                var obj = transaction.objectStore(model.name);
                var request = obj.get(id);

                request.onsuccess = function (e) {
                    resolve(e.target.result);
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Searches for first value in database and returns that
         * @returns {Promise}
         */

    }, {
        key: 'first',
        value: function first() {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READONLY);
                var obj = transaction.objectStore(model.name);
                var result = null;
                var request = void 0;

                if (model.indexBuilder.type) {
                    request = model.getIndexResult(obj);
                } else {
                    request = obj.openCursor();
                }

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (model.checkBuilderValue(cursor.value)) {
                            var relationsCompleted = 0;

                            result = cursor.value;

                            if (model.relations.length > 0 && (result !== null || result !== undefined)) {

                                model.relations.forEach(function (relation) {

                                    var relationRequest = model.getRelationships(relation, model.transaction, model.getMainResult(result, relation.localKey, false), false);

                                    relationRequest.then(function (relationResult) {

                                        relationsCompleted++;

                                        var defaultValue = model.getDefaultRelationValue(relation.type);
                                        result[relation.modelName] = result[relation.modelName] || defaultValue;

                                        switch (relation.type) {
                                            case Model.RELATIONS.hasOne:
                                                if (relationResult !== undefined) {
                                                    result[relation.modelName] = relationResult[relation.foreignKey] == result[relation.localKey] ? relationResult : result[relation.modelName];
                                                }

                                                break;
                                            case Model.RELATIONS.hasMany:
                                                if (relationResult.length > 0) {
                                                    result[relation.modelName] = relationResult.filter(function (relationResultItem) {
                                                        return relationResultItem[relation.foreignKey] == result[relation.localKey];
                                                    });
                                                }
                                                break;
                                        }

                                        if (relationsCompleted == model.relations.length) {
                                            resolve(result);
                                        }
                                    }).catch(function (err) {
                                        reject(err);
                                    });
                                });
                            } else {
                                resolve(cursor.value);
                                return false;
                            }
                        } else {
                            cursor.continue();
                        }
                    } else {
                        resolve(result);
                    }
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Function searches throughout the database and returns a array of result
         * @returns {Promise}
         */

    }, {
        key: 'get',
        value: function get() {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READONLY);
                var obj = transaction.objectStore(model.name);
                var result = [];
                var request = void 0;

                if (model.indexBuilder.type) {
                    request = model.getIndexResult(obj);
                } else {
                    request = obj.openCursor();
                }

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (model.checkBuilderValue(cursor.value)) {
                            result.push(cursor.value);
                        }
                        cursor.continue();
                    } else {
                        var mainResult = void 0,
                            relationsCompleted = 0;

                        if (model.relations.length > 0 && result.length > 0) {

                            model.relations.forEach(function (relation) {

                                var relationRequest = model.getRelationships(relation, model.transaction, model.getMainResult(result, relation.localKey, true), true);

                                relationRequest.then(function (relationResult) {

                                    relationsCompleted++;

                                    result = result.map(function (item) {

                                        var defaultValue = model.getDefaultRelationValue(relation.type);
                                        item[relation.modelName] = item[relation.modelName] || defaultValue;

                                        switch (relation.type) {
                                            case Model.RELATIONS.hasOne:
                                                if (relationResult !== undefined) {
                                                    item[relation.modelName] = relationResult[relation.foreignKey] == item[relation.localKey] ? relationResult : item[relation.modelName];
                                                }

                                                break;
                                            case Model.RELATIONS.hasMany:
                                                if (relationResult.length > 0) {
                                                    item[relation.modelName] = relationResult.filter(function (relationResultItem) {
                                                        return relationResultItem[relation.foreignKey] == item[relation.localKey];
                                                    });
                                                }
                                                break;
                                        }

                                        return item;
                                    });

                                    if (relationsCompleted == model.relations.length) {
                                        resolve(result);
                                    }
                                }).catch(function (err) {
                                    reject(err);
                                });
                            });
                        } else {
                            resolve(result);
                        }
                    }
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Function creates a single record
         * @param data
         * @returns {Promise}
         */

    }, {
        key: 'create',
        value: function create(data) {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READWRITE);

                var obj = transaction.objectStore(model.name);

                data.createdAt = Date.now();
                data.updatedAt = Date.now();

                var request = obj.add(data);

                request.onsuccess = function (e) {
                    data[model.primary] = e.target.result;
                    resolve(data);
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Function creates list of records passed
         * @param dataRecords
         * @returns {Promise}
         */

    }, {
        key: 'createMultiple',
        value: function createMultiple(dataRecords) {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READWRITE);

                var obj = transaction.objectStore(model.name);
                var createdAt = Date.now();
                var updatedAt = Date.now();
                var result = [];

                dataRecords.forEach(function (data) {
                    data.createdAt = createdAt;
                    data.updatedAt = updatedAt;

                    var request = obj.add(data);

                    request.onerror = function (e) {
                        reject(e);
                    };

                    request.onsuccess = function (e) {
                        data[model.primary] = e.target.result;

                        result.push(data);

                        if (result.length === dataRecords.length) {
                            resolve(result);
                        }
                    };
                });
            });
        }

        /**
         * Function updates the various records with matching values
         * @param data
         * @returns {Promise}
         */

    }, {
        key: 'update',
        value: function update(data) {

            var model = this;
            var updatedAt = Date.now();

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READWRITE);
                var obj = transaction.objectStore(model.name);
                var request = void 0,
                    totalRecordsBeingUpdated = 0,
                    totalRecordsUpdated = 0;

                if (model.indexBuilder.type) {
                    request = model.getIndexResult(obj);
                } else {
                    request = obj.openCursor();
                }

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (model.checkBuilderValue(cursor.value)) {
                            totalRecordsBeingUpdated++;

                            var id = cursor.value[model.primary];
                            var createdAt = cursor.value.createdAt;

                            var result = Model.helpers.replaceNestedValues(data, cursor.value);
                            result[model.primary] = id;
                            result.createdAt = createdAt;
                            result.updatedAt = updatedAt;

                            var updateRequest = cursor.update(result);

                            updateRequest.onsuccess = function () {
                                totalRecordsUpdated++;

                                if (totalRecordsUpdated === totalRecordsBeingUpdated) {
                                    resolve(true);
                                }
                            };

                            updateRequest.onerror = function (err) {
                                transaction.abort();
                                reject(err);
                            };
                        }
                        cursor.continue();
                    } else {
                        resolve();
                    }
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Function updates the record at the given id
         * @param id
         * @param data
         * @returns {Promise}
         */

    }, {
        key: 'save',
        value: function save(id, data) {
            var model = this;
            var updatedAt = Date.now();

            return new model.Promise(function (resolve, reject) {

                model.find(id).then(function (result) {

                    if (!result) {
                        reject('No record found');
                    }

                    var transaction = model.getTransaction(model.tables, Model.READWRITE, true);
                    var obj = transaction.objectStore(model.name);

                    var id = result[model.primary];
                    var createdAt = result.createdAt;

                    result = Model.helpers.replaceNestedValues(data, result);
                    result[model.primary] = id;
                    result.createdAt = createdAt;
                    result.updatedAt = updatedAt;

                    var request = obj.put(result);

                    request.onsuccess = function () {
                        resolve(true);
                    };

                    request.onerror = function (e) {
                        reject(e);
                    };
                }).catch(function (err) {
                    reject(err);
                });
            });
        }

        /**
         * Function deletes the entries at the given point
         * @param id
         * @returns {Promise}
         */

    }, {
        key: 'destroyId',
        value: function destroyId(id) {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                model.find(id).then(function (result) {

                    if (!result) {
                        reject('result at id does not exists');
                    }

                    var transaction = model.getTransaction(model.tables, Model.READWRITE, true);
                    var obj = transaction.objectStore(model.name);
                    var request = obj.delete(id);

                    request.onsuccess = function (e) {
                        resolve(e.target.result);
                    };

                    request.onerror = function (e) {
                        reject(e);
                    };
                }).catch(function (err) {
                    reject(err);
                });
            });
        }

        /**
         * Function deletes the entries
         * @returns {Promise}
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READWRITE);
                var obj = transaction.objectStore(model.name);
                var request = void 0,
                    totalRecordsBeingDeleted = 0,
                    totalRecordsDeleted = 0;

                if (model.indexBuilder.type) {
                    request = model.getIndexResult(obj);
                } else {
                    request = obj.openCursor();
                }

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (model.checkBuilderValue(cursor.value)) {
                            totalRecordsBeingDeleted++;

                            var deleteRequest = cursor.delete();

                            deleteRequest.onsuccess = function () {
                                totalRecordsDeleted++;

                                if (totalRecordsDeleted === totalRecordsBeingDeleted) {
                                    resolve(true);
                                }
                            };

                            deleteRequest.onerror = function (err) {
                                transaction.abort();
                                reject(err);
                            };
                        }
                        cursor.continue();
                    } else {
                        resolve();
                    }
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Function counts the number of records
         * @returns {Promise}
         */

    }, {
        key: 'count',
        value: function count() {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READONLY);
                var obj = transaction.objectStore(model.name);
                var result = 0;
                var request = void 0;

                if (model.indexBuilder.type) {
                    request = model.getIndexResult(obj);
                } else {
                    request = obj.openCursor();
                }

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (model.checkBuilderValue(cursor.value)) {
                            result++;
                        }

                        cursor.continue();
                    } else {
                        resolve(result);
                    }
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Function averages the numeric value at the given point
         * @param attribute
         * @returns {Promise}
         */

    }, {
        key: 'average',
        value: function average(attribute) {
            var model = this;

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READONLY);
                var obj = transaction.objectStore(model.name);
                var result = 0,
                    totalRecords = 0;
                var request = void 0;

                if (model.indexBuilder.type) {
                    request = model.getIndexResult(obj);
                } else {
                    request = obj.openCursor();
                }

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (model.checkBuilderValue(cursor.value)) {
                            totalRecords++;
                            var tempResult = Model.helpers.getNestedAttribute(attribute, cursor.value);
                            tempResult = parseFloat(tempResult);
                            tempResult = isNaN(tempResult) ? 0 : tempResult;
                            result += tempResult;
                        }

                        cursor.continue();
                    } else {
                        resolve(result / totalRecords);
                    }
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Reduce function is called with each passing iterator value and reduced value is returned
         * @param func
         * @param defaultCarry
         * @returns {Promise}
         */

    }, {
        key: 'reduce',
        value: function reduce(func, defaultCarry) {
            var model = this;

            if (typeof func !== 'function') {
                throw "Parameter should be a function type";
            }

            return new model.Promise(function (resolve, reject) {
                var transaction = model.getTransaction(model.tables, Model.READONLY);
                var obj = transaction.objectStore(model.name);
                var result = defaultCarry;
                var request = void 0;

                if (model.indexBuilder.type) {
                    request = model.getIndexResult(obj);
                } else {
                    request = obj.openCursor();
                }

                request.onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (model.checkBuilderValue(cursor.value)) {
                            result = func(cursor.value, result);
                        }

                        cursor.continue();
                    } else {
                        resolve(result);
                    }
                };

                request.onerror = function (e) {
                    reject(e);
                };
            });
        }

        /**
         * Sets the index search criteria
         * @param objectStore
         * @returns {*}
         */

    }, {
        key: 'getIndexResult',
        value: function getIndexResult(objectStore) {
            var builder = this;
            var range = void 0;
            var index = void 0;

            if (!builder.indexBuilder.type) {
                return objectStore.openCursor();
            }

            if (builder.indexBuilder.index !== builder.primary) {
                index = objectStore.index(builder.indexBuilder.index);
            } else {
                index = objectStore;
            }

            switch (builder.indexBuilder.type) {
                case 'and':
                    range = builder.idbKey.only(builder.indexBuilder.value);
                    break;

                case 'in':
                    builder.whereIn(builder.indexBuilder.index, builder.indexBuilder.value);
                    var values = builder.indexBuilder.value.sort();
                    range = builder.idbKey.bound(values[0], values[values.length - 1], false, false);
                    break;

                case 'gte':
                    range = builder.idbKey.lowerBound(builder.indexBuilder.value, false);
                    break;

                case 'gt':
                    range = builder.idbKey.lowerBound(builder.indexBuilder.value, true);
                    break;

                case 'lte':
                    range = builder.idbKey.upperBound(builder.indexBuilder.value, false);
                    break;

                case 'lt':
                    range = builder.idbKey.lowerBound(builder.indexBuilder.value, true);
                    break;

                case 'between':
                    range = builder.idbKey.bound(builder.indexBuilder.value[0], builder.indexBuilder.value[1], false, false);
                    break;
                default:
                    throw 'Invalid builder type found';
            }

            return index.openCursor(range);
        }

        /**
         * Checks common search criteria other than the index values
         * @param value
         * @returns {boolean}
         */

    }, {
        key: 'checkBuilderValue',
        value: function checkBuilderValue(value) {
            var builder = this;
            var result = true;
            var i = void 0,
                j = void 0;
            for (i = 0; i < builder.builder.length; i++) {

                var condition = builder.builder[i];
                switch (condition.type) {

                    case 'and':
                        //case for one to one search
                        if (!Model.helpers.checkNestedAttribute(condition.attribute, value, condition.value)) {
                            return false;
                        }
                        break;

                    case 'in':
                        //case for list search
                        var tempCheck = false;
                        for (j = 0; j < condition.value.length; j++) {
                            result = Model.helpers.checkNestedAttribute(condition.attribute, value, condition.value[j]);
                            if (result !== undefined && result !== false) {
                                tempCheck = true;
                            }
                        }

                        if (!tempCheck) {
                            return false;
                        }

                        result = true;

                        break;

                    case 'gte':
                        //case for checking the value is greater than or is equal to the same
                        result = Model.helpers.getNestedAttribute(condition.attribute, value);

                        if (result === undefined) {
                            return false;
                        }

                        if (result < condition.value) {
                            return false;
                        }

                        result = true;
                        break;

                    case 'gt':
                        //case for checking the value is greater than the same

                        result = Model.helpers.getNestedAttribute(condition.attribute, value);

                        if (result === undefined) {
                            return false;
                        }

                        if (result <= condition.value) {
                            return false;
                        }

                        result = true;
                        break;

                    case 'lte':
                        //case for checking the value is less than or is equal to the same
                        result = Model.helpers.getNestedAttribute(condition.attribute, value);

                        if (result === undefined) {
                            return false;
                        }

                        if (result > condition.value) {
                            return false;
                        }
                        result = true;
                        break;

                    case 'lt':
                        //case for checking the value is less than the same
                        result = Model.helpers.getNestedAttribute(condition.attribute, value);

                        if (result === undefined) {
                            return false;
                        }

                        if (result >= condition.value) {
                            return false;
                        }
                        result = true;
                        break;

                    case 'between':
                        //case for checking the value is between the given range(ONLY WORKS FOR NUMERIC)
                        result = Model.helpers.getNestedAttribute(condition.attribute, value);

                        if (result === undefined) {
                            return false;
                        }

                        if (condition.value[0] >= result && condition.value[1] <= result) {
                            return false;
                        }
                        result = true;
                        break;

                    default:
                        result = true;
                }
            }

            return result;
        }

        /**
         * Creates a transaction
         * @param tables
         * @param mode
         */

    }, {
        key: 'createTransaction',
        value: function createTransaction(tables, mode) {
            this.transaction = this.db.transaction(tables, mode);
        }

        /**
         * Sets IDBTransaction obejct to current model scope
         * @param transaction
         */

    }, {
        key: 'setTransaction',
        value: function setTransaction(transaction) {
            this.transaction = transaction;
        }

        /**
         * Returns the IDBTransaction object set in current scope
         * @param {Array} tables
         * @param {String} mode
         * @param {boolean} overwrite
         * @returns {*|null}
         */

    }, {
        key: 'getTransaction',
        value: function getTransaction(tables, mode, overwrite) {
            overwrite = overwrite === undefined ? false : overwrite;

            if (!this.transaction || overwrite === true) {
                this.createTransaction(tables, mode);
            }

            return this.transaction;
        }

        /**
         * Returns the array or direct key value against the input give for the key specified
         * @param result
         * @param key
         * @param isArray
         * @returns {*}
         */

    }, {
        key: 'getMainResult',
        value: function getMainResult(result, key, isArray) {
            if (isArray) {
                return result.map(function (item) {
                    return item[key];
                });
            } else {
                return result[key];
            }
        }

        /**
         * Searches for relationships assigned with builder and fetches them
         * @param relation
         * @param transaction
         * @param mainResult
         * @param isArray
         * @returns {Promise}
         */

    }, {
        key: 'getRelationships',
        value: function getRelationships(relation, transaction, mainResult, isArray) {

            isArray = isArray || false;

            var model = this;
            var primary = relation.primary || 'id';

            /**
             * @var Model relationModel
             */
            var relationModel = new Model(model.db, model.idbKey, relation.modelName, relation.primary);

            //setting the relation transaction same as parent transaction
            relationModel.setTransaction(transaction);

            //if a secondry builder function was defined
            if (relation.func) {
                var tempBuilder = new Builder();

                tempBuilder = relation.func(tempBuilder);

                relationModel.tables = tempBuilder.tables;
                relationModel.tables.push(relationModel.name);
                relationModel.relations = tempBuilder.relations;
                relationModel.builder = tempBuilder.builder;
            }

            //checking type of parent result
            if (isArray) {
                relationModel.whereIndexIn(relation.foreignKey, mainResult);
            } else {
                relationModel.whereIndex(relation.foreignKey, mainResult);
            }

            return new model.Promise(function (relationResolve, relationReject) {

                var result = void 0;

                //if relation type mentioned
                switch (relation.type) {
                    case Model.RELATIONS.hasOne:
                        result = relationModel.first();
                        break;
                    case Model.RELATIONS.hasMany:
                        result = relationModel.get();
                        break;
                    default:
                        throw "Invalid relation type provided";
                }

                result.then(function (r) {
                    relationResolve(r);
                }).catch(function (err) {
                    relationReject(err);
                });
            });
        }

        /**
         * Gets the default value of result. Null for hasOne and array for hasMany
         * @param type
         * @returns {*}
         */

    }, {
        key: 'getDefaultRelationValue',
        value: function getDefaultRelationValue(type) {
            switch (type) {
                case Model.RELATIONS.hasOne:
                    return null;
                case Model.RELATIONS.hasMany:
                    return [];
                default:
                    return null;
            }
        }

        /**
         * Readwrite parameter of indexedDB
         * @return {string}
         */

    }], [{
        key: 'READWRITE',
        get: function get() {
            return "readwrite";
        }

        /**
         * Readonly parameter of indexedDB
         * @return {string}
         */

    }, {
        key: 'READONLY',
        get: function get() {
            return "readonly";
        }
    }]);

    return Model;
}(Builder);

var Migration = function () {
    function Migration(db, transaction, migrations) {
        _classCallCheck(this, Migration);

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

    _createClass(Migration, [{
        key: 'createStore',
        value: function createStore(schema) {
            var mig = this;
            var primary = schema.primary || 'id';

            var objectStore = mig.db.createObjectStore(schema.name, { keyPath: primary, autoIncrement: true });
            mig.objectStores.push(objectStore);

            if (schema.columns) {
                schema.columns.forEach(function (column) {
                    return mig.makeIndex(column, objectStore);
                });
            }
        }
    }, {
        key: 'run',
        value: function run() {
            var mig = this;

            mig.migrations.forEach(function (schema) {
                if (mig.db.objectStoreNames.contains(schema.name)) {

                    if (schema.drop) {
                        mig.db.deleteObjectStore(schema.name);
                    } else {
                        mig.updateStore(schema);
                    }
                } else {
                    mig.createStore(schema);
                }
            });
        }
    }, {
        key: 'makeIndex',
        value: function makeIndex(column, objectStore) {
            column.attributes = column.attributes || {};
            column.index = column.index || column.name;
            objectStore.createIndex(column.name, column.index, column.attributes);
        }
    }, {
        key: 'updateStore',
        value: function updateStore(schema) {
            var mig = this;

            var objectStore = mig.transaction.objectStore(schema.name);

            if (schema.columns) {

                schema.columns.forEach(function (column) {
                    if (!objectStore.indexNames.contains(column.name)) {
                        mig.makeIndex(column, objectStore);
                    }
                });
            }

            if (schema.dropColumns) {
                schema.dropColumns.forEach(function (column) {
                    if (objectStore.indexNames.contains(column)) {
                        mig.dropIndex(column, objectStore);
                    }
                });
            }
        }
    }, {
        key: 'dropIndex',
        value: function dropIndex(columnName, objectStore) {
            debugger;
            objectStore.deleteIndex(columnName);
        }
    }]);

    return Migration;
}();

var DB = function () {
    function DB(idb, idbKey, settings, useWebWorker, pathToWebWorker, Q) {
        _classCallCheck(this, DB);

        this.db = idb;
        this.idbKey = idbKey;
        this.settings = settings;
        this.useWebWorker = useWebWorker || false;
        this.isWebWorker = false;
        this.pathToWebWorker = pathToWebWorker;
        this.Promise = Q;
    }

    /**
     * Initializes database connection with indexedDB
     *
     * @returns {Promise}
     */


    _createClass(DB, [{
        key: 'connect',
        value: function connect() {
            var db = this;
            return new db.Promise(function (resolve, reject) {

                if (db.useWebWorker) {
                    db.createWorkerHandler(resolve, reject);
                } else {
                    db.createNormalHandler(resolve, reject);
                }
            });
        }

        /**
         * Destroys/Deletes the databaase
         * @param dbName
         */

    }, {
        key: 'destroy',
        value: function destroy(dbName) {
            console.info('database ' + dbName + ' deleted');
            this.db.deleteDatabase(dbName);
        }

        /**
         * Creates connection in web worker space and if web worker fails
         * then creates normal database connection instance
         * @param resolve
         * @param reject
         */

    }, {
        key: 'createWorkerHandler',
        value: function createWorkerHandler(resolve, reject) {
            var db = this;
            try {
                var worker = new window.Worker(db.pathToWebWorker);
                var models = {};
                var timestamp = Date.now();

                worker.postMessage({
                    detail: JSON.stringify(db.settings),
                    action: 'initialize',
                    timestamp: timestamp
                });

                worker.onmessage = function (e) {
                    if (e.data.action === 'initialize' && e.data.timestamp === timestamp) {
                        if (e.data.detail === true) {
                            db.settings.migrations.forEach(function (schema) {
                                Object.defineProperty(models, schema.name, {
                                    get: function get() {
                                        return new WorkerModelHandler(schema.name, worker, db.Promise);
                                    }
                                });
                            });

                            db.isWebWorker = true;
                            resolve(models);
                        } else {
                            db.createNormalHandler(resolve, reject);
                        }
                    }
                };
            } catch (e) {
                reject(e);
            }
        }

        /**
         * Creates normal database instance and models
         * @param resolve
         * @param reject
         */

    }, {
        key: 'createNormalHandler',
        value: function createNormalHandler(resolve, reject) {
            var db = this;

            var request = this.db.open(this.settings.dbName, this.settings.dbVersion);

            request.onupgradeneeded = function (e) {
                var mig = new Migration(e.target.result, e.target.transaction, db.settings.migrations);
                mig.run();
            };

            request.onerror = function (e) {
                reject(e);
            };

            request.onsuccess = function (e) {
                var models = {};

                db.settings.migrations.forEach(function (schema) {
                    var primary = schema.primary || 'id';
                    Object.defineProperty(models, schema.name, {
                        get: function get() {
                            return new Model(e.target.result, db.idbKey, schema.name, primary, db.Promise);
                        }
                    });
                });

                db.transaction = db.setTransactionHandler(e.target.result);

                resolve(models);
            };
        }

        /**
         * Function creates the transaction handler to work in transactional level with database
         * @param database
         * @returns {Function}
         */

    }, {
        key: 'setTransactionHandler',
        value: function setTransactionHandler(database) {
            var db = this;

            return function (tables, func) {

                if (typeof func !== 'function') {
                    throw "Second parameter must be a type of function";
                }

                var transaction = database.transaction(tables, 'readwrite');
                var models = {};

                tables.forEach(function (table) {

                    Object.defineProperty(models, table, {
                        get: function get() {

                            var schema = db.settings.migrations.filter(function (mig) {
                                return mig.name === table;
                            });

                            var primary = schema.primary || 'id';

                            var model = new Model(database, db.idbKey, table, primary, db.Promise);
                            model.setTransaction(transaction);

                            return model;
                        }
                    });
                });

                func(models, transaction);
            };
        }
    }]);

    return DB;
}();

window.idb = function (config) {
    "use strict";

    var useWebWorker = config.useWebWorker === undefined ? false : config.useWebWorker;

    if (useWebWorker && !config.pathToWebWorker) {
        throw "Path to worker not defined";
    }

    if (!config.window) {
        config.window = window;
    }

    if (!config.promise) {
        config.promise = window.Promise;
    }

    if (!config.promise) {
        throw "Promises not supported by the borwser";
    }

    var idb = config.window.indexedDB || config.window.mozIndexedDB || config.window.webkitIndexedDB || config.window.msIndexedDB;
    var idbKeyRange = config.window.IDBKeyRange || config.window.webkitIDBKeyRange || config.window.msIDBKeyRange;
    if (!idb) {
        throw "IndexedDB not supported";
    }

    if (!checkSettingsConfig(config.settings)) {
        throw "settings parameter is incorrectly structured";
    }

    return new DB(idb, idbKeyRange, config.settings, checkWebWorker(), config.pathToWebWorker, config.promise);

    function checkSettingsConfig(settings) {
        return true;
    }

    function checkWebWorker() {
        if (!config.useWebWorker) {
            return false;
        }

        return config.window.Worker;
    }
};

//# sourceMappingURL=idb.js.map

/***/ }
/******/ ]);
//# sourceMappingURL=idb.js.map