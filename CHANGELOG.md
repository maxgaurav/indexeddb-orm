# Changelog

## [3.2.1](https://github.com/maxgaurav/indexeddb-orm/releases/tag/v3.2.1) _(Latest Release)_

### Added
- Added close connection function **close** to close currently open connection 

## [3.2.0](https://github.com/maxgaurav/indexeddb-orm/releases/tag/v3.2.0)
### Bug Fixes
- Fix **openTransaction** on model not returning ORM Class.

### Added
- Sync actions **(sync, syncIndex, syncIndexAll)** to update and retrieve the updated record on success.
- Added schema configuration to allow opt-in for maintaining synced on date when calling sync actions. Will add/update **syncOn** attribute
- Added **saveIndex** to save data on index. It's optimized for single action transaction over update
- Added **saveAllIndex** to save data on all matching index.

### Changed
- **Connector** class and **index** file refactored to remove reference of **window** action so that the package can be imported in web workers. 

### Other
- Refactored **model.ts** file to multiple files to maintain single file single responsibility principle. 

## [3.1.1](https://github.com/maxgaurav/indexeddb-orm/releases/tag/v3.1.1)
### Bug Fixes
- Fixed find or create actions some times opening in read mode only

### Added
- Find or create actions now throw **InvalidTransaction** error if transaction is not in write mode

## [3.1.0](https://github.com/maxgaurav/indexeddb-orm/releases/tag/v3.1.0)
### Added
- Add **firstOrFail, findOrFail, findIndexOrFail** actions which will find the value or throw **NotFound** error
- Add **firstOrCreate, findOrCreate, findIndexOrCreate** actions which will find the value or create new value return it.
- Add **findAllIndex** action which will return all values as array for the matching index.

### Changed
- **save** now throws **NotFound** Error over default Error.
- **findIndex** resets the builder settings before finding on index.
- Readme changes with latest usage of library.

### Bug Fixes
- Fix: Orm Class instance mapping in Schema for typescript causing interface mismatch


## [3.0.1](https://github.com/maxgaurav/indexeddb-orm/releases/tag/v3.0.1)
- Readme changes

## [3.0.0](https://github.com/maxgaurav/indexeddb-orm/releases/tag/v3.0.0)

### Added
- Added **with** to add relation handling. Takes in array of relations.
- Added **withCustom** to add relation of ORM as string values.
- Added **delete** to replace **destroyId**.
- Added **deleteIndex** to delete matching values directly on index.
- Added ORM class instance extending Model class to be used over default Model class
- Added new relation **HasManyThroughMultiEntry**. 
- Providing both es6 module for modular programming and direct script based injection through **idb.js**

### Deprecation
- Deprecated **relation** function on models to add relation. Use **with**.
- Deprecated **destroyId** function mon models. Use **delete**.

### Removals
- Worker instance handling
- Deletion of indexes and object stores by providing drop settings is removed. These are now handled automatically by comparing
existing database structure with table schemas provided.

## [2.1.0](https://github.com/maxgaurav/indexeddb-orm) 
- Addition of Multi-Entry relation
- Add documentation of usage of multi-entry relation 

## [2.0.0](https://github.com/maxgaurav/indexeddb-orm) Release _(Breaking Changes)_

### Change
- Main code base moved to typescript
- Web Worker handling changed from event driven to MessageChannel
    - MessageChannel implementation in future will allow use of SharedArrayBuffer to improve performance
- Settings now takes **name** over **dbName** for database name
- Settings now takes **version** over **dbVersion** for database version
- New **idb** instance now takes in settings, useWebworker and pathToWebworker parameters over single config settings
- Primary keyPath of objectstores/tables changed to **_id** from **id**

### Added
- Dedicated transaction action to both main thread and worker thread
- DB instance gives access to Migration 
- DB instance gives access to IDBDatabase
- Models now have **openTransaction** function to create dedicated transaction

### Updated
- Model interaction handling to code to be asynchronous

### Fixed
- Nested relation not working with normal transaction

### Removed
- Removed build folder and replaced with dist folder
- Removed **transaction** function from the main database **DB** instance. Instead use **_model_.openTransaction**
- Removed **get** function and replaced with **all**. 

## [1.0.1](https://github.com/maxgaurav/indexeddb-orm/tree/orm-1.0.1) Initial Release
- Add base DB interface 
- Add migrations 
- Add models content on DB connect
- Base Model interaction
- Web Worker implementation
- Model Relations
