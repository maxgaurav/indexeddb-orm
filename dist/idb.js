/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Model; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__builder__ = __webpack_require__(1);
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};

/**
 * Main Model class
 */
var Model = function (_super) {
    __extends(Model, _super);
    function Model(db, idbKey, name, primary) {
        if (primary === void 0) {
            primary = '_id';
        }
        var _this = _super.call(this) || this;
        _this.db = db;
        _this.idbKey = idbKey;
        _this.name = name;
        _this.primary = primary;
        _this.tables = [];
        _this.hasIDBKey = false;
        _this.tables.push(_this.name);
        _this.hasIDBKey = !!_this.idbKey;
        return _this;
    }
    /**
     * Finds the result on the primary key defined
     * @param id
     * @returns {Promise}
     */
    Model.prototype.find = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READONLY);
            var obj = transaction.objectStore(_this.name);
            var request = obj.get(id);
            request.onsuccess = function (e) {
                var relationsCompleted = 0;
                var result = e.target.result;
                if (_this.relations.length <= 0 || !result) {
                    resolve(result);
                    return;
                }
                _this.relations.forEach(function (relation) {
                    return __awaiter(_this, void 0, void 0, function () {
                        var relationResult, defaultValue;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    return [4 /*yield*/, this.getRelationships(relation, this.transaction, this.getMainResult(result, relation.localKey, false), false)];
                                case 1:
                                    relationResult = _a.sent();
                                    relationsCompleted++;
                                    defaultValue = this.getDefaultRelationValue(relation.type);
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
                                    if (relationsCompleted == this.relations.length) {
                                        resolve(result);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            };
            request.onerror = function (e) {
                reject(e.message);
            };
        });
    };
    /**
     * Searches for first value in database and returns that
     * @returns {Promise}
     */
    Model.prototype.first = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READONLY);
            var obj = transaction.objectStore(_this.name);
            var result = null;
            var request = _this.indexBuilder.type ? _this.getIndexResult(obj) : obj.openCursor();
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (!cursor) {
                    resolve(result);
                    return;
                }
                if (!_this.checkBuilderValue(cursor.value)) {
                    cursor.continue();
                }
                var relationsCompleted = 0;
                result = cursor.value;
                if (_this.relations.length <= 0 || !result) {
                    resolve(result);
                    return;
                }
                _this.relations.forEach(function (relation) {
                    return __awaiter(_this, void 0, void 0, function () {
                        var relationResult, defaultValue;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    return [4 /*yield*/, this.getRelationships(relation, this.transaction, this.getMainResult(result, relation.localKey, false), false)];
                                case 1:
                                    relationResult = _a.sent();
                                    relationsCompleted++;
                                    defaultValue = this.getDefaultRelationValue(relation.type);
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
                                    if (relationsCompleted == this.relations.length) {
                                        resolve(result);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            };
            request.onerror = function (e) {
                reject(e.message);
            };
        });
    };
    /**
     * Function searches throughout the database and returns a array of result
     * @returns {Promise}
     */
    Model.prototype.get = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READONLY);
            var obj = transaction.objectStore(_this.name);
            var result = [];
            var request = _this.indexBuilder.type ? _this.getIndexResult(obj) : obj.openCursor();
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    if (_this.checkBuilderValue(cursor.value)) {
                        result.push(cursor.value);
                    }
                    cursor.continue();
                    return;
                }
                var relationsCompleted = 0;
                if (_this.relations.length <= 0 || result.length <= 0) {
                    resolve(result);
                    return;
                }
                _this.relations.forEach(function (relation) {
                    return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var relationResult;
                        return __generator(this, function (_a) {
                            relationResult = this.getRelationships(relation, this.transaction, this.getMainResult(result, relation.localKey, true), true);
                            relationsCompleted++;
                            result = result.map(function (item) {
                                var defaultValue = _this.getDefaultRelationValue(relation.type);
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
                            return [2 /*return*/];
                        });
                    });
                });
            };
            request.onerror = function (e) {
                reject(e.message);
            };
        });
    };
    /**
     * Function creates a single record
     * @param data
     * @returns {Promise}
     */
    Model.prototype.create = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READWRITE);
            var obj = transaction.objectStore(_this.name);
            data.createdAt = Date.now();
            data.updatedAt = Date.now();
            var request = obj.add(data);
            request.onsuccess = function (e) {
                data[_this.primary] = e.target.result;
                resolve(data);
            };
            request.onerror = function (e) {
                reject(e.message);
            };
        });
    };
    /**
     * Function creates list of records passed
     * @param dataRecords
     * @returns {Promise}
     */
    Model.prototype.createMultiple = function (dataRecords) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READWRITE);
            var obj = transaction.objectStore(_this.name);
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
                    data[_this.primary] = e.target.result;
                    result.push(data);
                    if (result.length === dataRecords.length) {
                        resolve(result);
                    }
                };
                request.onerror = function (e) {
                    transaction.abort();
                    reject(e.message);
                };
            });
        });
    };
    /**
     * Function updates the various records with matching values
     * @param data
     * @returns {Promise}
     */
    Model.prototype.update = function (data) {
        var _this = this;
        var updatedAt = Date.now();
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READWRITE);
            var obj = transaction.objectStore(_this.name);
            var totalRecordsBeingUpdated = 0,
                totalRecordsUpdated = 0;
            var request = _this.indexBuilder.type ? _this.getIndexResult(obj) : obj.openCursor();
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (!cursor) {
                    resolve(totalRecordsUpdated);
                    return;
                }
                if (_this.checkBuilderValue(cursor.value)) {
                    totalRecordsBeingUpdated++;
                    var id = cursor.value[_this.primary];
                    var createdAt = cursor.value.createdAt;
                    var result = Model.helpers.replaceNestedValues(data, cursor.value);
                    result[_this.primary] = id;
                    result.createdAt = createdAt;
                    result.updatedAt = updatedAt;
                    var updateRequest = cursor.update(result);
                    updateRequest.onsuccess = function () {
                        totalRecordsUpdated++;
                        if (totalRecordsUpdated === totalRecordsBeingUpdated) {
                            resolve(totalRecordsUpdated);
                        }
                    };
                    updateRequest.onerror = function (err) {
                        transaction.abort();
                        reject(err.message);
                    };
                }
                cursor.continue();
            };
            request.onerror = function (e) {
                reject(e.message);
            };
        });
    };
    /**
     * Function updates the record at the given id
     * @param idd
     * @param data
     * @returns {Promise}
     */
    Model.prototype.save = function (idd, data) {
        var _this = this;
        var updatedAt = Date.now();
        return new Promise(function (resolve, reject) {
            return __awaiter(_this, void 0, void 0, function () {
                var result, transaction, obj, id, createdAt, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/, this.find(idd)];
                        case 1:
                            result = _a.sent();
                            if (!result) {
                                reject('No record found');
                            }
                            transaction = this.getTransaction(this.allTables(), Model.READWRITE);
                            obj = transaction.objectStore(this.name);
                            id = result[this.primary];
                            createdAt = result.createdAt;
                            result = Model.helpers.replaceNestedValues(data, result);
                            result[this.primary] = id;
                            result.createdAt = createdAt;
                            result.updatedAt = updatedAt;
                            request = obj.put(result);
                            request.onsuccess = function () {
                                resolve(true);
                            };
                            request.onerror = function (e) {
                                reject(e.message);
                            };
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    /**
     * Function deletes the entries at the given point
     * @param id
     * @returns {Promise}
     */
    Model.prototype.destroyId = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return __awaiter(_this, void 0, void 0, function () {
                var result, transaction, obj, request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/, this.find(id)];
                        case 1:
                            result = _a.sent();
                            if (!result) {
                                reject('result at id does not exists');
                            }
                            transaction = this.getTransaction(this.allTables(), Model.READWRITE);
                            obj = transaction.objectStore(this.name);
                            request = obj.delete(id);
                            request.onsuccess = function (e) {
                                resolve(e.target.result);
                            };
                            request.onerror = function (e) {
                                reject(e.message);
                            };
                            return [2 /*return*/];
                    }
                });
            });
        });
    };
    /**
     * Function deletes the entries
     * @returns {Promise}
     */
    Model.prototype.destroy = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READWRITE);
            var obj = transaction.objectStore(_this.name);
            var request,
                totalRecordsBeingDeleted = 0,
                totalRecordsDeleted = 0;
            if (_this.indexBuilder.type) {
                request = _this.getIndexResult(obj);
            } else {
                request = obj.openCursor();
            }
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    if (this.checkBuilderValue(cursor.value)) {
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
    };
    /**
     * Function counts the number of records
     * @returns {Promise}
     */
    Model.prototype.count = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READONLY);
            var obj = transaction.objectStore(_this.name);
            var result = 0;
            var request = _this.indexBuilder.type ? _this.getIndexResult(obj) : obj.openCursor();
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (!cursor) {
                    resolve(result);
                    return;
                }
                if (_this.checkBuilderValue(cursor.value)) {
                    result++;
                }
                cursor.continue();
            };
            request.onerror = function (e) {
                reject(e.message);
            };
        });
    };
    /**
     * Function averages the numeric value at the given point
     * @param attribute
     * @returns {Promise}
     */
    Model.prototype.average = function (attribute) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READONLY);
            var obj = transaction.objectStore(_this.name);
            var result = 0,
                totalRecords = 0;
            var request = _this.indexBuilder.type ? _this.getIndexResult(obj) : obj.openCursor();
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (!cursor) {
                    resolve(result / totalRecords);
                    return;
                }
                if (_this.checkBuilderValue(cursor.value)) {
                    var tempResult = Model.helpers.getNestedAttribute(attribute, cursor.value);
                    totalRecords++;
                    tempResult = parseFloat(tempResult);
                    tempResult = isNaN(tempResult) ? 0 : tempResult;
                    result += tempResult;
                }
                cursor.continue();
            };
            request.onerror = function (e) {
                reject(e.message);
            };
        });
    };
    /**
     * Reduce function is called with each passing iterator value and reduced value is returned
     * @param func
     * @param defaultCarry
     * @returns {Promise}
     */
    Model.prototype.reduce = function (func, defaultCarry) {
        var _this = this;
        if (typeof func !== 'function') {
            throw "Parameter should be a function type";
        }
        return new Promise(function (resolve, reject) {
            var transaction = _this.getTransaction(_this.allTables(), Model.READONLY);
            var obj = transaction.objectStore(_this.name);
            var result = defaultCarry;
            var request;
            if (_this.indexBuilder.type) {
                request = _this.getIndexResult(obj);
            } else {
                request = obj.openCursor();
            }
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (!cursor) {
                    resolve(result);
                    return;
                }
                if (this.checkBuilderValue(cursor.value)) {
                    result = func(cursor.value, result);
                }
                cursor.continue();
            };
            request.onerror = function (e) {
                reject(e.message);
            };
        });
    };
    /**
     * Sets the index search criteria
     * @param objectStore
     * @returns {*}
     */
    Model.prototype.getIndexResult = function (objectStore) {
        var range;
        var index;
        if (!this.indexBuilder.type) {
            return objectStore.openCursor();
        }
        if (this.indexBuilder.index !== this.primary) {
            index = objectStore.index(this.indexBuilder.index);
        } else {
            index = objectStore;
        }
        switch (this.indexBuilder.type) {
            case 'and':
                range = this.idbKey.only(this.indexBuilder.value);
                break;
            case 'in':
                this.whereIn(this.indexBuilder.index, this.indexBuilder.value);
                var values = this.indexBuilder.value.sort();
                range = this.idbKey.bound(values[0], values[values.length - 1], false, false);
                break;
            case 'gte':
                range = this.idbKey.lowerBound(this.indexBuilder.value, false);
                break;
            case 'gt':
                range = this.idbKey.lowerBound(this.indexBuilder.value, true);
                break;
            case 'lte':
                range = this.idbKey.upperBound(this.indexBuilder.value, false);
                break;
            case 'lt':
                range = this.idbKey.lowerBound(this.indexBuilder.value, true);
                break;
            case 'between':
                range = this.idbKey.bound(this.indexBuilder.value[0], this.indexBuilder.value[1], false, false);
                break;
            default:
                throw 'Invalid builder type given';
        }
        return index.openCursor(range);
    };
    /**
     * Checks common search criteria other than the index values
     * @param value
     * @returns {boolean}
     */
    Model.prototype.checkBuilderValue = function (value) {
        var result = true;
        var i, j;
        for (i = 0; i < this.builder.length; i++) {
            var condition = this.builder[i];
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
    };
    /**
     * Creates a transaction
     * @param tables
     * @param mode
     */
    Model.prototype.createTransaction = function (tables, mode) {
        this.transaction = this.db.transaction(tables, mode);
        return this.transaction;
    };
    /**
     * Sets IDBTransaction obejct to current model scope
     * @param transaction
     */
    Model.prototype.setTransaction = function (transaction) {
        this.transaction = transaction;
    };
    /**
     * Returns the IDBTransaction object set in current scope
     * @param {Array} tables
     * @param {String} mode
     * @param {boolean} overwrite
     * @returns {*|null}
     */
    Model.prototype.getTransaction = function (tables, mode, overwrite) {
        if (overwrite === void 0) {
            overwrite = false;
        }
        if (!this.transaction || overwrite === true) {
            return this.createTransaction(tables, mode);
        }
        return this.transaction;
    };
    /**
     * Opens a transaction and creates models encapsulated in the transaction so that all operations occur within the transaction
     * @param {ModelInterface[]} models
     * @param {(transaction: IDBTransaction, models: Models, passableData?: any) => Promise<any>} func
     * @param passableData
     * @return {Promise}
     */
    Model.prototype.openTransaction = function (models, func, passableData) {
        if (passableData === void 0) {
            passableData = null;
        }
        var tables = models.map(function (model) {
            return model.name;
        });
        var transaction = this.getTransaction(tables, Model.READWRITE);
        var m = {};
        models.forEach(function (model) {
            Object.defineProperty(m, model.name, {
                get: function get() {
                    var newModel = new Model(model.db, model.idbKey, model.name, model.primary);
                    newModel.setTransaction(transaction);
                    return newModel;
                }
            });
        });
        return func(transaction, m, passableData);
    };
    /**
     * Returns the array or direct key value against the input give for the key specified
     * @param result
     * @param key
     * @param isArray
     * @returns {*}
     */
    Model.prototype.getMainResult = function (result, key, isArray) {
        if (isArray) {
            return result.map(function (item) {
                return item[key];
            });
        } else {
            return result[key];
        }
    };
    /**
     * Searches for relationships assigned with builder and fetches them
     * @param relation
     * @param transaction
     * @param mainResult
     * @param isArray
     * @returns {Promise}
     */
    Model.prototype.getRelationships = function (relation, transaction, mainResult, isArray) {
        if (isArray === void 0) {
            isArray = false;
        }
        var relationModel = new Model(this.db, this.idbKey, relation.modelName, relation.primary);
        //setting the relation transaction same as parent transaction
        relationModel.setTransaction(transaction);
        //if a secondary builder function was defined
        if (relation.func) {
            var tempBuilder = new __WEBPACK_IMPORTED_MODULE_0__builder__["a" /* Builder */]();
            tempBuilder = relation.func(tempBuilder);
            relationModel.tables = tempBuilder.tables;
            relationModel.tables.push(relationModel.name);
            relationModel.relations = tempBuilder.relations;
            relationModel.builder = tempBuilder.builder;
            relationModel.primary = relation.primary || '_id';
        }
        //checking type of parent result
        isArray ? relationModel.whereIndexIn(relation.foreignKey, mainResult) : relationModel.whereIndex(relation.foreignKey, mainResult);
        return new Promise(function (relationResolve, relationReject) {
            var result;
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
    };
    // noinspection JSMethodCanBeStatic
    /**
     * Gets the default value of result. Null for hasOne and array for hasMany
     * @param type
     * @returns {*}
     */
    Model.prototype.getDefaultRelationValue = function (type) {
        switch (type) {
            case Model.RELATIONS.hasOne:
                return null;
            case Model.RELATIONS.hasMany:
                return [];
            default:
                return null;
        }
    };
    Object.defineProperty(Model, "READWRITE", {
        /**
         * Readwrite parameter of indexedDB
         * @return {string}
         */
        get: function get() {
            return "readwrite";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model, "READONLY", {
        /**
         * Readonly parameter of indexedDB
         * @return {string}
         */
        get: function get() {
            return "readonly";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Function creates list of tables to be used in transaction for all relations
     * @return {string[]}
     */
    Model.prototype.allTables = function () {
        this.tables = [this.name];
        this.tables = this.tables.concat(this.getRelationTables(this.relations));
        return this.tables;
    };
    /**
     * Function returns a list of tables called in nested query builder of relation
     * @param {Relation[]} relations
     * @return {Array}
     */
    Model.prototype.getRelationTables = function (relations) {
        var _this = this;
        var tables = [];
        relations.forEach(function (relation) {
            tables.push(relation.modelName);
            if (relation.func) {
                var builder = relation.func(new __WEBPACK_IMPORTED_MODULE_0__builder__["a" /* Builder */]());
                tables = tables.concat(_this.getRelationTables(builder.relations));
            }
        });
        return tables;
    };
    return Model;
}(__WEBPACK_IMPORTED_MODULE_0__builder__["a" /* Builder */]);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Builder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model__ = __webpack_require__(0);

var Builder = function () {
    function Builder(builder, indexBuilder, relations, tables) {
        if (builder === void 0) {
            builder = [];
        }
        if (indexBuilder === void 0) {
            indexBuilder = {};
        }
        if (relations === void 0) {
            relations = [];
        }
        if (tables === void 0) {
            tables = [];
        }
        this.builder = builder;
        this.indexBuilder = indexBuilder;
        this.relations = relations;
        this.tables = tables;
    }
    /**
     * Sets the index builder value as an 'and' reference
     *
     * @param indexName string
     * @param value mixed
     * @returns {Builder}
     */
    Builder.prototype.whereIndex = function (indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'and'
        };
        return this;
    };
    /**
     * Sets the index builder value as an 'in' reference
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    Builder.prototype.whereIndexIn = function (indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'in'
        };
        return this;
    };
    /**
     * Sets the index builder value with point inclusive and sets greater than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    Builder.prototype.indexGte = function (indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'gte'
        };
        return this;
    };
    /**
     * Sets the index builder value with point not inclusive and sets greater than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    Builder.prototype.indexGt = function (indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'gt'
        };
        return this;
    };
    /**
     * Sets the index builder value with point inclusive and sets less than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    Builder.prototype.indexLte = function (indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'lte'
        };
        return this;
    };
    /**
     * Sets the index builder value with point not inclusive and sets less than check
     *
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    Builder.prototype.indexLt = function (indexName, value) {
        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'lt'
        };
        return this;
    };
    /**
     * Sets the index builder value with points inclusive and sets range between them
     * @param indexName
     * @param lower
     * @param upper
     * @returns {Builder}
     */
    Builder.prototype.indexBetween = function (indexName, lower, upper) {
        this.indexBuilder = {
            index: indexName,
            value: [lower, upper],
            type: 'between'
        };
        return this;
    };
    /**
     * Filters non indexed value content as in and value of given attributes
     * @param attributeName
     * @param value
     * @returns {Builder}
     */
    Builder.prototype.whereIn = function (attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'in'
        });
        return this;
    };
    /**
     * Filters values exactly  to the given value
     * @param attributeName
     * @param value
     * @returns {Builder}
     */
    Builder.prototype.where = function (attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'and'
        });
        return this;
    };
    /**
     * Checks for value greater than or equal to the value given for the attribute
     * @param attributeName
     * @param {string | number} value
     * @returns {Builder}
     */
    Builder.prototype.gte = function (attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'gte'
        });
        return this;
    };
    /**
     * Checks for value greater than the value given for the attribute
     * @param {string} attributeName
     * @param {string | number} value
     * @returns {Builder}
     */
    Builder.prototype.gt = function (attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'gt'
        });
        return this;
    };
    /**
     * Checks for value less than or equal the value given for the attribute
     * @param {string} attributeName
     * @param {string | number} value
     * @returns {Builder}
     */
    Builder.prototype.lte = function (attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'lte'
        });
        return this;
    };
    /**
     * Checks for value less than or equal the value given for the attribute
     * @param {string} attributeName
     * @param {string | number} value
     * @returns {Builder}
     */
    Builder.prototype.lt = function (attributeName, value) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'lt'
        });
        return this;
    };
    /**
     * Filters content based on the between values given
     * @param {string} attributeName
     * @param {number} upper
     * @param {number} lower
     * @returns {Builder}
     */
    Builder.prototype.between = function (attributeName, upper, lower) {
        if (isNaN(upper) || isNaN(lower)) {
            throw "Between is only for numeric values";
        }
        this.builder.push({
            attribute: attributeName,
            value: [upper, lower],
            type: 'between'
        });
        return this;
    };
    /**
     * Adds relation to the main search content
     * @param {string} modelName
     * @param {string} type
     * @param {string} localKey
     * @param {string} foreignKey
     * @param func
     * @param {string} primary
     * @returns {Builder}
     */
    Builder.prototype.relation = function (modelName, type, localKey, foreignKey, func, primary) {
        if (func === void 0) {
            func = null;
        }
        if (primary === void 0) {
            primary = null;
        }
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
    };
    Object.defineProperty(Builder, "helpers", {
        get: function get() {
            return {
                checkNestedAttribute: function checkNestedAttribute(attributeString, value, condition) {
                    return condition == __WEBPACK_IMPORTED_MODULE_0__model__["a" /* Model */].helpers.getNestedAttribute(attributeString, value);
                },
                getNestedAttribute: function getNestedAttribute(attributeString, value) {
                    var attributes = attributeString.split('.');
                    var i;
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
        },
        enumerable: true,
        configurable: true
    });
    Builder.prototype.getBuilder = function () {
        return {
            tables: this.tables,
            indexBuilder: this.indexBuilder,
            normalBuilder: this.builder,
            relations: this.relations
        };
    };
    Object.defineProperty(Builder.prototype, "RELATIONS", {
        // noinspection JSMethodCanBeStatic
        get: function get() {
            return Builder.RELATIONS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Builder, "RELATIONS", {
        get: function get() {
            return {
                hasOne: 'hasOne',
                hasMany: 'hasMany'
            };
        },
        enumerable: true,
        configurable: true
    });
    return Builder;
}();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DB; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__migration__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__worker_model__ = __webpack_require__(4);
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var DB = function () {
    function DB(db, idbKey, settings, useWorker, pathToWorker) {
        if (useWorker === void 0) {
            useWorker = false;
        }
        if (pathToWorker === void 0) {
            pathToWorker = '';
        }
        this.db = db;
        this.idbKey = idbKey;
        this.settings = settings;
        this.useWorker = useWorker;
        this.pathToWorker = pathToWorker;
    }
    /**
     * Initializes database connection with indexedDB
     *
     * @returns {Promise}
     */
    DB.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useWorker) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createWorkerHandler()];
                    case 1:
                        return [2 /*return*/, _a.sent()];
                    case 2:
                        return [4 /*yield*/, this.createNormalHandler()];
                    case 3:
                        return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Destroys/Deletes the databaase
     * @param dbName
     */
    DB.prototype.destroy = function (dbName) {
        console.info('database ' + dbName + ' deleted');
        this.db.deleteDatabase(dbName);
    };
    /**
     * Creates connection in web worker space and if web worker fails
     * then creates normal database connection instance
     * @return {Promise<Models>}
     */
    DB.prototype.createWorkerHandler = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var worker = new Worker(_this.pathToWorker);
            var ms = new MessageChannel();
            worker.postMessage({ command: 'init', settings: _this.settings }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (e.data.status === 'error' || !e.data.status) {
                    ms.port2.close();
                    throw new Error(e.data.error || "Uncaught error <" + JSON.stringify(e.data) + ">");
                }
                var models = {};
                _this.settings.migrations.forEach(function (schema) {
                    var primary = schema.primary || 'id';
                    Object.defineProperty(models, schema.name, {
                        get: function get() {
                            return new __WEBPACK_IMPORTED_MODULE_2__worker_model__["a" /* WorkerModel */](worker, schema.name, primary);
                        }
                    });
                });
                resolve(models);
                ms.port2.close();
                ms.port1.close();
            };
        });
    };
    /**
     * Function creates/opens database connection in main javascript thread
     * @returns {Promise<Models>}
     */
    DB.prototype.createNormalHandler = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = _this.db.open(_this.settings.name, _this.settings.version);
            request.onupgradeneeded = function (e) {
                _this.idb = e.target.result;
                _this.migration = new __WEBPACK_IMPORTED_MODULE_0__migration__["a" /* Migration */](_this.idb, e.target.transaction, _this.settings.migrations);
                _this.migration.run();
            };
            request.onerror = function (e) {
                reject(e.message);
            };
            request.onsuccess = function (e) {
                var models = {};
                _this.settings.migrations.forEach(function (schema) {
                    var primary = schema.primary || 'id';
                    var idbKey = _this.idbKey;
                    Object.defineProperty(models, schema.name, {
                        get: function get() {
                            return new __WEBPACK_IMPORTED_MODULE_1__model__["a" /* Model */](e.target.result, idbKey, schema.name, primary);
                        }
                    });
                });
                resolve(models);
            };
        });
    };
    return DB;
}();


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Migration; });
var Migration = function () {
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
            schema.columns.forEach(function (column) {
                return _this.makeIndex(column, objectStore);
            });
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
                } else {
                    _this.updateStore(schema);
                }
            } else {
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
}();


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkerModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__builder__ = __webpack_require__(1);
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var WorkerModel = function (_super) {
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
    /**
     * Opens a transaction which can be used by the caller independently to manipulate the transaction
     * @param {ModelInterface[]} models
     * @param {(transaction: IDBTransaction, passableData?: any) => Promise} func
     * @param passableData
     * @return Promise
     */
    WorkerModel.prototype.openTransaction = function (models, func, passableData) {
        var _this = this;
        if (passableData === void 0) {
            passableData = null;
        }
        return new Promise(function (resolve) {
            var ms = new MessageChannel();
            var m = models.map(function (model) {
                return {
                    name: model.name,
                    primary: model.primary
                };
            });
            _this.worker.postMessage({ command: 'transaction', modelName: m[0].name, models: m, content: _this.getStringify([func, passableData]) }, [ms.port1]);
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
            return typeof value === 'function' ? value.toString() : value;
        });
    };
    return WorkerModel;
}(__WEBPACK_IMPORTED_MODULE_0__builder__["a" /* Builder */]);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__db__ = __webpack_require__(2);

window.idb = function (settings, useWorker, pathToWorker) {
    if (useWorker === void 0) {
        useWorker = false;
    }
    if (pathToWorker === void 0) {
        pathToWorker = '';
    }
    // noinspection TypeScriptUnresolvedVariable
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // noinspection TypeScriptUnresolvedVariable
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!indexedDB) {
        throw "Indexed DB not supported";
    }
    if (!IDBKeyRange) {
        throw "IDBKeyRange not available";
    }
    return new __WEBPACK_IMPORTED_MODULE_0__db__["a" /* DB */](indexedDB, IDBKeyRange, settings, useWorker, pathToWorker);
};

/***/ })
/******/ ]);