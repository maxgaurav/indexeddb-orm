# Changelog

## [2.0.0](https://github.com/maxgaurav/indexeddb-orm) Latest Release _(Breaking Changes)_

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

## [1.0.1](https://github.com/maxgaurav/indexeddb-orm/tree/orm-1.0.1) Initial Release
- Add base DB interface 
- Add migrations 
- Add models content on DB connect
- Base Model interaction
- Web Worker implementation
- Model Relations
