# IndexedDB ORM

An indexedDB wrapper for accessing indexedDB as a promise base api implementation.

[![npm](https://img.shields.io/npm/dt/indexeddb-orm.svg)](https://www.npmjs.com/package/indexeddb-orm)
[![npm](https://img.shields.io/npm/v/indexeddb-orm.svg)](https://www.npmjs.com/package/indexeddb-orm)
[![npm](https://img.shields.io/npm/l/indexeddb-orm.svg)](https://www.npmjs.com/package/indexeddb-orm)

## Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [Query Building](#query-building)
    * [Insertion of data](#insertion-of-data)
        * [Create](#create)
        * [Create Multiple](#create-multiple)
    * [Searching of the data](#searching-of-the-data)
        * [Find](#find)
        * [First](#first)
        * [Get](#get)
    * [Index Searching](#index-searching)
        * [whereIndex](#whereIndex)
        * [whereIndexIn](#whereIndexIn)
        * [whereIndexGte](#whereIndexGte)
        * [whereIndexGt](#whereIndexGt)
        * [whereIndexLte](#whereIndexLte)
        * [whereIndexLt](#whereIndexLt)
        * [whereIndexBetween](#whereIndexBetween)
    * [Non Index Searching](#non-index-searching)
        * [where](#where)
        * [Nested Attributes](#nested-attributes)
        * [whereIn](#whereIn)
        * [gte](#gte)
        * [gt](#gt)
        * [lte](#lte)
        * [lt](#lt)
        * [between](#between)
    * [Relations](#relations)
    * [Updating of Records](#updating-of-records)
        * [save](#save)
        * [update](#update)
    * [Deletion in table](#deletion-in-table)
        * [destroyId](#destroyId)
        * [destroy](#destroy)
    * [Transactional Actions](#Transactional Actions)
    * [Aggregations](#aggregations)
        * [Count](#count)
        * [Average](#average)
        * [Reduce](#Reduce)
    

## Features
* Create structure of database with indexes and versioning
* Get model instances and query builder for both indexed columns and non indexed columns
* Run queries on WebWorker
* Create relation between multiple tables 

## Installation
```
npm install indexeddb-orm --save
```

## Usage
* An setting parameter needs to be created for database structure handling. Models will be populated using the table names provided.
* Use the idb function and pass base configuration with database structure.
```javascript

let settings = {
    dbName : 'nameOfDatabase',
    dbVersion : 1, //version of database
    migrations : [{
        name : 'users', //name of table
        primary : 'id', //auto increment field (default id)
        columns : [{
            name : 'email', //other indexes in the database
            attributes : { //other keyPath configurations for the index
                unique : true
            }
        },{
            name : 'userContacts',
            columns : [{
                name : 'phone',
                attributes : {
                    multiEntry: true
                }
            },{
                name : 'contactId', //name of the index
                index : 'medical.contactId' //if provided then indexing value will be this
            },{
                name : 'userId'
            }]
        }]
    }]
};

let config = {
    settings : settings
};

let db = idb(config);
```

* By default usage of web worker is not enabled but if you want to use it then set **useWebWorker** property in config as true and set the property **pathToWebWorker** as the location of **worker.js** from build folder
```javascript
let config = {
    settings : settings,
    useWebWorker : true,
    pathToWebWorker : '/path/to/build/worker.js',
}
````

* You can also pass an instance of window object in the function if you have special window wrapped object. 
* You can also set a special *Promise* object in config. The promise object should provide an new instance and a function 
as an parameter with resolve as functions first param and reject as second param. In general promise object should be same as native Promise
```javascript

let config = {
    settings : settings,
    window : $window, //wrapped window object of application
    promise : $window.Q //special promise object retrieved from custom window
}
``` 


## Query Building

### Insertion of data

#### Create
* Inserting content to database using create.
* Inserting content will automatically add a updatedAt and createdAt entry with timestamp
```javascript

db.connect(function(models) {
    models.users.create({
        email : 'test@test.com'
    }).then(function(result) {
        
    }).catch(function(error){
        //do something
    })
}) 
```


#### Create Multiple
* Allows insertion of multiple content in a table

```javascript
db.connect(function(models) {
    models.usersContacts.create([{
        userId : 1,
        firstName : 'TestFirst',
        lastName : 'TestLast',
        medical : {
            contactId : 10,
            hospitalId : 11
        }
    },{
          userId : 2,
          firstName : 'Test2First',
          lastName : 'Test2Last',
          medical : {
              contactId : 20,
              hospitalId : 111
          },
          phone : ['111111111', '22222222222']
    }]).then(function(results) {
        /**
        * Will return an array of results
        **/
    }).catch(function(error){
        //do something
    });
}) 
```

### Searching of the data

#### Find
* Can search for direct id value using the find operation and will return result if exists else will throw an error
```javascript
db.connect().then(function(models) {
    models.users.find(1).then(function(result){
        
    });
});
```

#### First
* Will search for first occurrence in the table and return the value else return null

```javascript
db.connect().then(function(models) {
    models.users.first().then(function(result){
        
    });
});
```

#### Get
* Will search for all matching occurrence in the table and return the value else return blank array

```javascript
db.connect().then(function(models) {
    models.users.get().then(function(results){
        
    });
});
```

### Index Searching
* Direct search on indexes are possible but only one index search builder is allowed. This is due to limitation of indexedDB itself.
* If you attempt to write another index query then the previous one will be overridden

#### whereIndex
Direct search on index. First parameter as the index name and second parameter as the index value
```javascript
db.connect().then(function(models) {
    models.users.whereIndex('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.whereIndex('userId',1).get().then(function(results){
            
    });
});
```

#### whereIndexIn
Multiple search of index in the given range of values provided as array

```javascript
db.connect().then(function(models) {
    models.users.whereIndexIn('email',['test@test.com','test1@test.com']).first().then(function(result){
        
    });
    
    models.userContacts.whereIndexIn('userId',[2,54,1,5]).get().then(function(results){
            
    });
});
```

#### whereIndexGte
Search of index values against the point greater or equal to the given value. It is case sensitive

```javascript
db.connect().then(function(models) {
    models.users.whereIndexGte('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.whereIndexGte('userId',20).get().then(function(results){
            
    });
});
```

#### whereIndexGt
Search of index values against the point greater only to the given value. It is case sensitive.

```javascript
db.connect().then(function(models) {
    models.users.whereIndexGt('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.whereIndexGt('userId',20).get().then(function(results){
            
    });
});
```

#### whereIndexLte
Search of index values against the point less than or equal to the given value. It is case sensitive

```javascript
db.connect().then(function(models) {
    models.users.whereIndexLte('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.whereIndexLte('userId',20).get().then(function(results){
            
    });
});
```

#### whereIndexLt
Search of index values against the point less than only to the given value. It is case sensitive.

```javascript
db.connect().then(function(models) {
    models.users.whereIndexLt('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.whereIndexLt('userId',20).get().then(function(results){
            
    });
});
```

#### whereIndexBetween
Search of index values betweent the given lower and upper bound values. It is case sensitive for string values.

```javascript
db.connect().then(function(models) {
    models.users.whereIndexBetween('email','test@test.com', 'zest@test.com').first().then(function(result){
        
    });
    
    models.userContacts.whereIndexBetween('userId',20, 52).get().then(function(results){
            
    });
});
```

### Non Index Searching
There will be some columns where indexes are not there you can combine index search queries with non index search queries
and build an adequate query to filter the data. Since only single indexed query can be fired once you can use these query builder option to fire other point searches on remaining indexes. Non index searches are performance heavy operation so be careful of such searches. If needed then make non indexed columns as indexed.


#### where
Add a simple where clause to the query builder before or after the indexed builder to add condition. You can add multiple of these in succession.

```javascript

db.connect().then(function(models) {
    models.users.where('isAdmin', true).whereIndexBetween('email','test@test.com', 'zest@test.com').where('isAdmin', false).first().then(function(result){
        
    });
    
    models.userContacts.whereIndexBetween('userId',20, 52).where('id', 10).get().then(function(results){
            
    });
});
```

#### Nested Attributes
To search for a value under a nested attribute you can pass a dot notation value to the query builder column name.

```javascript

db.connect().then(function(models) {
  
    models.userContacts.whereIndexBetween('userId',20, 52).where('medical.contactId', 10).get().then(function(results){
            
    });
});
```


#### whereIn
To search for result in a multiple search values for column then pass array as an value for the search

```javascript

db.connect().then(function(models) {
  
    models.userContacts.whereIn('userId',[20, 52]).where('medical.contactId', 10).get().then(function(results){
            
    });
});
```

#### gte
Search of values against the point greater or equal to the given value. It is case sensitive

```javascript
db.connect().then(function(models) {
    models.users.gte('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.gte('userId',20).get().then(function(results){
            
    });
});
```

#### gt
Search of values against the point greater only to the given value. It is case sensitive.

```javascript
db.connect().then(function(models) {
    models.users.gt('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.gt('userId',20).get().then(function(results){
            
    });
});
```

#### lte
Search of values against the point less than or equal to the given value. It is case sensitive

```javascript
db.connect().then(function(models) {
    models.users.lte('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.lte('userId',20).get().then(function(results){
            
    });
});
```

#### lt
Search of values against the point less than only to the given value. It is case sensitive.

```javascript
db.connect().then(function(models) {
    models.users.lt('email','test@test.com').first().then(function(result){
        
    });
    
    models.userContacts.lt('userId',20).get().then(function(results){
            
    });
});
```
#### whereIndexBetween
Search of index values betweent the given lower and upper bound values. It is case sensitive for string values.

```javascript
db.connect().then(function(models) {
    models.users.whereIndexBetween('email','test@test.com', 'zest@test.com').first().then(function(result){
        
    });
    
    models.userContacts.whereIndexBetween('userId',20, 52).get().then(function(results){
            
    });
});
```

### Relations
* Data from different tables can be fetched with association with current table using relations. There are two relations hasone and hasmany.

```javascript

models.users.whereIndexIn('id',[1,2,10,11])
    .where('isAdmin', true)
    .relation('userContacts',models.users.RELATIONS.hasMany, 'id', 'userId')
    .get().then(function(results) {
        
        /**
        * each results object will have an userContacts property with mathcing result with users table
       **/ 
    });
```

* You also refine the relationship using the final parameter by passing a function which will receive a builder function
and can build using the common non indexed query builder functions.

```javascript
models.users.whereIndexIn('id',[1,2,10,11])
    .where('isAdmin', true)
    .relation('userContacts',models.users.RELATIONS.hasMany, 'id', 'userId', function(builder) {
        //refined search for relation
        return builder.whereIn('id', [1,2,3]).where('medical.contactId', 10);
    })
    .get().then(function(results) {
        
        /**
        * each results object will have an userContacts property with mathcing result with users table
       **/ 
    });
```

* You can also call for nested relation to nth level using the secondry query builder of the relation

```javascript
models.users.whereIndexIn('id',[1,2,10,11])
    .where('isAdmin', true)
    .relation('userContacts',models.users.RELATIONS.hasMany, 'id', 'userId', function(builder) {
        //refined search for relation
        return builder.whereIn('id', [1,2,3])
            .where('medical.contactId', 10)
            .relation('contacts', models.users.RELATIONS.hasOne,'contactId', 'id');
    })
    .get().then(function(results) {
        
        /**
        * each results object will have an userContacts property with mathcing result with users table
       **/ 
    });
```

### Updating of records

#### Save

This will update the data at the given primary id of the table with content provided. The whole content will not be replaced 
but only the properties provided. Primary key ,updatedAt and createdAt values will be ignored even if provided
 
```javascript

models.users.save(1,  {
    isAdmin : false
}).then(function(result) {
   /**
   * result with value true will be returned 
   **/
});
```

#### update

This will update the data with matching values according to the query builder given of the table with content provided. The whole content will not be replaced 
but only the properties provided. Primary key ,updatedAt and createdAt values will be ignored even if provided
 
```javascript

models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).update({
    isAdmin : false
}).then(function(result) {
   /**
   * result with value true will be returned 
   **/
});
```

### Deletions in table


#### destroyId

This will destroy the data at the given primary id of the table.
 
```javascript

models.users.destroyId(3).then(function(result) {
   /**
   * result with value true will be returned 
   **/
});
```

#### destroy

This will update the data with matching values according to the query builder given of the table with content provided. The whole content will not be replaced 
but only the properties provided. Primary key ,updatedAt and createdAt values will be ignored even if provided
 
```javascript

models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).destroy().then(function(result) {
   /**
   * result with value true will be returned 
   **/
});
```

###Transactional Actions
Sometimes it is needed to work in a single transaction and commit the content once or fail throughout. For this purpose one
can use the transaction functionality in the system.

The transaction is available after one connects to the database using the **connect** function and then a **transaction ** property is
exposed to the main database instance.

The transaction property takes in two parameters. First an array of tables on which transaction is going to take place. Second
is a function which provides two parameters transactionalModel and transaction. The transactional model is a model wrapper around
the tables provided and transaction is the **IDBTransaction** instance which all models are adhering to. 

Calling **transaction.abort()** will cause the transaction to fail.

#### NOTE: It is not available in when database is being assigned to worker using useWebWorker flag


#### Usage
```javascript
    var database = new idb(config);

    database.connect().then(function(models) {
        
        try{
            //now a transaction property is exposed to database
            database.transaction(['table1', 'table2'], function(transactionModel, transaction){
                transactionModel.table1.create({...});
                transactionModel.table2.create({...});
                
                transaction.abort();
            });
            
            
        }catch(e){
            //Transaction error handling
        }
    });
```

### Aggregations

#### Count

The count will return total number of records in the table against the result obtained by query builer object


```javascript

models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).count().then(function(result) {
   /**
   * result with total number of records in the table 
   **/
});
```

#### Average

Aggregate of the result at the given column will be provided. If the column contains non numeric value then it will be treated as a ZERO value 


```javascript

models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).average('id').then(function(result) {
   /**
   * result with total number of records in the table 
   **/
});


models.users.whereIndex('userId', 10).where('firstName', 'Test').average('medical.contactId').then(function(result) {
   /**
   * result with aggregate of the nested column provided
   **/
});
```

#### Reduce

Reduce process can be fired using the reduce function passed. If needed an default value can be passed as a second parameter 


```javascript

models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).reduce(function(result, carry){
    return carry + result.id
}, 0).then(function(result) {
   /**
   * result with total number of records in the table 
   **/
});

```
