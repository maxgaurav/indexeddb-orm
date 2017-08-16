var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Builder } from "./builder";
var WorkerModel = (function (_super) {
    __extends(WorkerModel, _super);
    function WorkerModel(worker, name, primary) {
        var _this = _super.call(this) || this;
        _this.worker = worker;
        _this.name = name;
        _this.primary = primary;
        return _this;
    }
    WorkerModel.prototype.find = function (id) {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'find', content: _this.getStringify([id]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    WorkerModel.prototype.first = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'first', content: _this.getStringify([]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    WorkerModel.prototype.get = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'get', content: _this.getStringify([]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    /**
     * Function creates a single record
     * @param data
     * @returns {Promise}
     */
    WorkerModel.prototype.create = function (data) {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'create', content: _this.getStringify([data]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    /**
     * Function creates list of records passed
     * @param dataRecords
     * @returns {Promise}
     */
    WorkerModel.prototype.createMultiple = function (dataRecords) {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'createMultiple', content: _this.getStringify([dataRecords]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    /**
     * Function updates the various records with matching values
     * @param data
     * @returns {Promise}
     */
    WorkerModel.prototype.update = function (data) {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'update', content: _this.getStringify([data]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    /**
     * Function updates the record at the given id
     * @param id
     * @param data
     * @returns {Promise}
     */
    WorkerModel.prototype.save = function (id, data) {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'save', content: _this.getStringify([id, data]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    /**
     * Function deletes the entries at the given point
     * @param id
     * @returns {Promise}
     */
    WorkerModel.prototype.destroyId = function (id) {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'destroyId', content: _this.getStringify([id]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    WorkerModel.prototype.destroy = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'destroyId', content: _this.getStringify([]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    /**
     * Function counts the number of records
     * @returns {Promise}
     */
    WorkerModel.prototype.count = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'count', content: _this.getStringify([]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    /**
     * Function averages the numeric value at the given point
     * @param attribute
     * @returns {Promise}
     */
    WorkerModel.prototype.average = function (attribute) {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'average', content: _this.getStringify([attribute]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    /**
     * Reduce function is called with each passing iterator value and reduced value is returned
     * @param func
     * @param defaultCarry
     * @returns {Promise}
     */
    WorkerModel.prototype.reduce = function (func, defaultCarry) {
        var _this = this;
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            _this.worker.postMessage({ command: 'action', modelName: _this.name, query: _this.getStringify(_this.getBuilder()), action: 'reduce', content: _this.getStringify([func, defaultCarry]) }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (!e.data.status || e.data.status === 'error') {
                    throw new Error(e.data.error);
                }
                resolve(e.data.content);
            };
        });
    };
    // noinspection JSMethodCanBeStatic
    WorkerModel.prototype.getStringify = function (content) {
        return JSON.stringify(content, function (key, value) {
            return (typeof value === 'function') ? value.toString() : value;
        });
    };
    return WorkerModel;
}(Builder));
export { WorkerModel };
