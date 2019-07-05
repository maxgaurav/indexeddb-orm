# IndexedDB ORM

An indexedDB wrapper for accessing indexedDB as a promise base api implementation.

[![npm](https://img.shields.io/npm/dm/indexeddb-orm.svg)](https://www.npmjs.com/package/indexeddb-orm)
[![npm](https://img.shields.io/npm/v/indexeddb-orm.svg)](https://www.npmjs.com/package/indexeddb-orm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Older Version
For older version please go to branch [2.1.0](https://github.com/maxgaurav/indexeddb-orm/tree/orm-2.1.0)

## Website
[maxgaurav.github.io/indexeddb-orm](https://maxgaurav.github.io/indexeddb-orm)

Examples coming soon to the website.

## Changes/Updates/Deprication
Read [ChangeLog](https://github.com/maxgaurav/indexeddb-orm/blob/master/CHANGELOG.md)

## Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [ORM](#orm)
* [Query Building](#query-building)
    * [Insertion of data](#insertion-of-data)
        * [Create](#create)
        * [Create Multiple](#create-multiple)
    * [Searching of the data](#searching-of-the-data)
        * [Find](#find)
        * [First](#first)
        * [All](#all)
    * [Index Searching](#index-searching)
        * [whereIndex](#whereIndex)
        * [whereIndexIn](#whereIndexIn)
        * [whereMultiIndexIn](#whereMultiIndexIn)
        * [whereIndexGte](#whereIndexGte)
        * [whereIndexGt](#whereIndexGt)
        * [whereIndexLte](#whereIndexLte)
        * [whereIndexLt](#whereIndexLt)
        * [whereIndexBetween](#whereIndexBetween)
    * [Non Index Searching](#non-index-searching)
        * [where](#where)
        * [Nested Attributes](#nested-attributes)
        * [whereIn](#whereIn)
        * [whereInArray](#whereInArrya)
        * [gte](#gte)
        * [gt](#gt)
        * [lte](#lte)
        * [lt](#lt)
        * [between](#between)
    * [Relations](#relations)
        * [Has One](#has-one)
        * [Has Many](#has-many)
        * [Has Many Multi Entry](#has-many-multientry)
        * [Has Many Through Multi Entry](#has-many-through-multientry)
        * [Custom Relation Builder](#custom-relation-builder)
        * [Nested Relations](#nested-relations)
    * [Updating of Records](#updating-of-records)
        * [save](#save)
        * [update](#update)
    * [Deletion in table](#deletion-in-table)
        * [delete](#delete)
        * [destroy](#destroy)
        * [deleteIndex](#delete-index)
    * [Transactional Actions](#transactional-actions)
    * [Aggregations](#aggregations)
        * [Count](#count)
        * [Average](#average)
        * [Reduce](#Reduce)
    

## Features
* Create structure of database with indexes and version
* Get model instances and query builder for both indexed columns and non indexed columns
* Create relation between multiple tables 
* Create custom ORM class to be used over default Model instances to provide custom relations

## Installation
```
npm install indexeddb-orm --save
```

## Usage
* An setting parameter needs to be created for database structure handling. Models will be populated using the table names provided.
* Use the idb function and pass base configuration with database structure.
```javascript

import {Connector} from './dist/es2015/connection/connector.js';

const settings = {
    name : 'nameOfDatabase',
    version : 1, //version of database
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


// if using normal script
const idb = idb(settings);

// if using module scripts
const db = new Connector(settings);
```

## ORM



```javascript
import {Model} from './dist/es2015/models/model.js';

class UserProfiles extends Model{
  static TableName = 'userProfile';
  
  user = () => {
    return this.hasOne(Users, 'id', 'userId')
  }
}

class Users extends Model {
  static TableName = 'users';
  
  userProfile = () => {
      // the third and fourth parmeter are optional;
      // by default the function name would be used as parent models attribute.
      return this.hasOne(UserProfiles, 'userId', '_id', 'userProfile')
        .where('name', 'newName').with([...]).withCustom(['user']); 
  }
}

const settings = {
    name : 'nameOfDatabase',
    version : 1, //version of database
    migrations : [{
        name : 'users', //name of table
        primary : 'id', //auto increment field (default id)
        ormClass: Users,
        columns : [{
            name : 'email', //other indexes in the database
            attributes : { //other keyPath configurations for the index
                unique : true
            }
        },{
          name : 'userProfiles', //name of table
          primary : 'id', //auto increment field (default id)
          ormClass: UserProfiles,
          columns : [{
              name : 'userId', //other indexes in the database
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
```

## Query Building

### Insertion of data

#### Create
* Inserting content to database using create.
* Inserting content will automatically add a updatedAt and createdAt entry with timestamp
```javascript

db.connect(async (models) => {
    const record = await models.users.create({
        email : 'test@test.com'
    });
}) 
```


#### Create Multiple
* Allows insertion of multiple content in a table

```javascript
db.connect(async (models) => {
   const results = await models.usersContacts.createMultiple([{
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
    }]);
}) 
```

### Searching of the data

#### Find
* Can search for direct id value using the find operation and will return result if exists else will throw an error
```javascript
db.connect().then(async (models) => {
    const record = models.users.find(1);
});
```

#### First
* Will search for first occurrence in the table and return the value else return null

```javascript
db.connect().then(async (models) => {
    const record = await models.users.first();
});
```

#### All
* Will search for all matching occurrence in the table and return the value else return blank array

```javascript
db.connect().then(async (models) => {
    const records = await models.users.all();
});
```

### Index Searching
* Direct search on indexes are possible but only one index search builder is allowed. This is due to limitation of indexedDB itself.
* If you attempt to write another index query then the previous one will be overridden

#### whereIndex
Direct search on index. First parameter as the index name and second parameter as the index value
```javascript
db.connect().then(async (models) => {
    const user = await models.users.whereIndex('email','test@test.com').first();
    
    const contacts = await models.userContacts.whereIndex('userId',1).all();
});
```

#### whereIndexIn
Multiple search of index in the given range of values provided as array

```javascript
db.connect().then(async (models) => {
    const user = await models.users.whereIndexIn('email',['test@test.com','test1@test.com']);
    
    const contacts = await models.userContacts.whereIndexIn('userId',[2,54,1,5]).all();
});
```

#### whereMultiIndexIn
Searching of index which whose index type is multi entry thus allowing searching of array content  

```javascript
db.connect().then(async (models) => {
    const user = await models.users.whereIndexIn('email',['test@test.com','test1@test.com']);
    
    const contacts = await models.userContacts.whereMultiIndexIn('phone',['12345','233343',13455,52222]).all();
});
```

#### whereIndexGte
Search of index values against the point greater or equal to the given value. It is case sensitive

```javascript
db.connect().then(async (models) => {
    const user = await models.users.whereIndexGte('email','test@test.com').first();
    
    const contacts = await models.userContacts.whereIndexGte('userId',20).all();
});
```

#### whereIndexGt
Search of index values against the point greater only to the given value. It is case sensitive.

```javascript
db.connect().then(async (models) => {
    const user = await models.users.whereIndexGt('email','test@test.com').first();
    
    const contacts = await models.userContacts.whereIndexGt('userId',20).all();
});
```

#### whereIndexLte
Search of index values against the point less than or equal to the given value. It is case sensitive

```javascript
db.connect().then(async (models) => {
    const user = await models.users.whereIndexLte('email','test@test.com').first();
    
    const contacts = await models.userContacts.whereIndexLte('userId',20).all();
});
```

#### whereIndexLt
Search of index values against the point less than only to the given value. It is case sensitive.

```javascript
db.connect().then(async (models) => {
    const user = await models.users.whereIndexLt('email','test@test.com').first();
    
    const contacts = await models.userContacts.whereIndexLt('userId',20).all();
});
```

#### whereIndexBetween
Search of index values betweent the given lower and upper bound values. It is case sensitive for string values.

```javascript
db.connect().then(async (models) => {
    const user = await models.users.whereIndexBetween('email','test@test.com', 'zest@test.com').first();
    
    const contacts = await models.userContacts.whereIndexBetween('userId',20, 52).all();
});
```

### Non Index Searching
There will be some columns where indexes are not there you can combine index search queries with non index search queries
and build an adequate query to filter the data. Since only single indexed query can be fired once you can use these query builder option to fire other point searches on remaining indexes. Non index searches are performance heavy operation so be careful of such searches. If needed then make non indexed columns as indexed.


#### where
Add a simple where clause to the query builder before or after the indexed builder to add condition. You can add multiple of these in succession.

```javascript

db.connect().then(async (models) => {
    const user = await models.users.where('isAdmin', true).whereIndexBetween('email','test@test.com', 'zest@test.com').where('isAdmin', false).first();
    
    const contacts = await models.userContacts.whereIndexBetween('userId',20, 52).where('id', 10).all();
});
```

#### Nested Attributes
To search for a value under a nested attribute you can pass a dot notation value to the query builder column name.

```javascript

db.connect().then(async (models) => {
  
    const contacts = await models.userContacts.whereIndexBetween('userId',20, 52).where('medical.contactId', 10).all();
});
```


#### whereIn
To search for result in a multiple search values for column then pass array as an value for the search

```javascript

db.connect().then(async (models) => {
  
    const contacts = await models.userContacts.whereIn('userId',[20, 52]).where('medical.contactId', 10).all();
});
```

#### whereIn
To search for result in a multiple search values for column which contains array of values then pass array as an value for the search

```javascript

db.connect().then(async (models) => {
  
    const contacts = await models.userContacts.whereIn('phones',[20, 52]).where('medical.contactId', 10).all();
});
```

#### gte
Search of values against the point greater or equal to the given value. It is case sensitive

```javascript
db.connect().then(async (models) => {
    const user = await models.users.gte('email','test@test.com').first();
    
    const contacts = await models.userContacts.gte('userId',20).all();
});
```

#### gt
Search of values against the point greater only to the given value. It is case sensitive.

```javascript
db.connect().then(async (models) => {
    const user = await models.users.gt('email','test@test.com').first();
    
    const contacts = await models.userContacts.gt('userId',20).all();
});
```

#### lte
Search of values against the point less than or equal to the given value. It is case sensitive

```javascript
db.connect().then(async (models) => {
    const user = await models.users.lte('email','test@test.com').first();
    
    const contacts = await models.userContacts.lte('userId',20).all();
});
```

#### lt
Search of values against the point less than only to the given value. It is case sensitive.

```javascript
db.connect().then(async (models) => {
    const user = await models.users.lt('email','test@test.com').first();
    
    const contacts = await models.userContacts.lt('userId',20).all();
});
```
#### between
Search of index values between the given lower and upper bound values. It is case sensitive for string values.

```javascript
db.connect().then(async (models) => {
    const user = await models.users.between('email','test@test.com', 'zest@test.com').first();
    
    const contacts = await models.userContacts.between('userId',20, 52).all();
});
```

### Relations
Data from different tables can be fetched with association with current table using relations. The system supports following relations

 * Has One
 * Has Many
 * Has Many Multi-Entry
 * Has Many Through Multi-Entry
 
The relation builder is used to add a relation to the model for it to fetch. The first value is the name of model, followed
by the relation type, then the local key of relation model, then local key of calling model and finally a callback to filter the values of relation model further which contains builder reference of relation model. The builder reference can also be used to fetch nested relations with same strategy.  


#### Adding Normal Relations
Relations can be added through function call **with** by passing array of relations. The with function can be called multiple times.
If duplicate models are found then previous one is replaced by new one. If you want to have multiple relations on same model then create a
custom ORM instance and then create your custom relations. 

```javascript
models.userProfiles.with([{
    model: models.users, // You can also pass object store name as string but its strongly recommended to use model instance
    type: RelationTypes.HasOne, 
    foreignKey: 'id', 
    localKey: 'userId',
    attributeName: 'overriddenRelationName' // if relation needs to be attached as a different property
  }, ...])
```
 
#### Has One

The has one relation maps a single column of primary model containing the id reference of other table/object store directly. The matching relation will be single object instance mapped to table name property. If no matching relation is found then the item will be empty.

Example a user instance having one user contact. The user contact fetching the user model using relation.

```javascript
import {RelationTypes} from './dist/es2015/models/model.interface.js';

const profiles = await models.userProfiles.with([{
        model: models.users, 
        type: RelationTypes.HasOne, 
        localKey: 'id', // the local key is optional  and should be provided if mapping is not directly to primary key
        foreignKey: 'userId'
      }])
      .all();

/**
* each profile object will contain a matching users object as users property
*/
```

#### Has Many
The has many relation maps single column of primary model containing the id reference of other table/object store with
with matching id. 

Example a user having multiple contacts. The user model query with all contacts associated.


```javascript
import {RelationTypes} from './dist/es2015/models/model.interface.js';

const users = await models.users.whereIndexIn('id',[1,2,10,11])
    .where('isAdmin', true)
    .with([{model: model.userProfiles , type: RelationTypes.HasMany, foreignKey: 'userId'}])
    .all();
/**
 * each results object will have an userContacts property with matching result with users table
**/
```

#### Has Many Multi Entry

The has many multi entry relation works just like has many but the primary model column value is an array set as
 multi-entry index.
 
Example a address table/object store having relation to multiple users using userIds as array with mutli entry index.

```javascript
import {RelationTypes} from './dist/es2015/models/model.interface.js';

const addresses = await models.addresss.with([{
      model: model.users, 
      type: RelationTypes.HasManyMultiEntry, 
      localKey: 'id', 
      foreignKey: 'userIds'
    }]).all();

/**
 * each address object will have an users property which will be an array of matching users.
/**
``` 

#### Has Many Through Multi Entry

The has many through multi entry relation is used when the parent model which is setting the relation has the index as multi entry.
This is reverse of has manu multi entry where child has index as multi.
 
Example a address table/object store having relation to multiple users using userIds as array with mutli entry index.

```javascript
import {RelationTypes} from './dist/es2015/models/model.interface.js';

const addresses = await models.addresss.with([{
      model: model.users, 
      type: RelationTypes.HasManyThroughMultiEntry, 
      localKey: 'id', 
      foreignKey: 'userIds'
    }]).all();

/**
 * each address object will have an users property which will be an array of matching users.
/**
``` 

#### Custom Relation Builder
* Using the **withCustom** you can load custom relations defined in the ORM class.


```javascript
import {Model} from './dist/es2015/models/model.js';

class UserProfile extends Model {
  static TableName = 'userProfiles'; 
}

class User extends Model {
  static TableName = 'users';
  
  userProfile = ()=> {
    return this.hasOne(UserProfile, 'userId');
  }
}

const users = await models.users.whereIndexIn('id',[1,2,10,11])
    .where('isAdmin', true)
    .withCustom(['userProfile'])
    .all();

/**
 * each results object will have an userProfile property with matching result with users table
**/ 
```

#### Nested Relations
* You can also call for nested relation to nth level using the secondry query builder of the relation

```javascript
import {RelationTypes} from './dist/es2015/models/model.interface.js';

const users = await models.users.whereIndexIn('id',[1,2,10,11])
    .where('isAdmin', true)
    .with([{
      model: models.userContacts, 
      type: RelationTypes.HasMany, 
      localKey: 'id', 
      foreignKey: 'userId', 
      func: (builder) => {
        //refined search for relation
        return builder.whereIn('id', [1,2,3])
            .where('medical.contactId', 10)
            .relation('contacts', models.users.RELATIONS.hasOne,'contactId', 'id');
      }
    }])
    .all();

/**
 * each results object will have an userContacts property with matching result with users table
**/ 
```

### Updating of records

#### Save

This will update the data at the given primary id of the table with content provided. The whole content will not be replaced 
but only the properties provided by default. To prevent deep merging you can optionally pass third parameter as false.

Primary key ,updatedAt and createdAt values will be ignored even if provided
 
```javascript

models.users.save(1,  {
    isAdmin : false
});
```

#### update

This will update the data with matching values according to the query builder given of the table with content provided. The whole content will not be replaced by default. To prevent deep merging you can optionally pass third parameter as false.
 
Primary key ,updatedAt and createdAt values will be ignored even if provided
 
```javascript

models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).update({
    isAdmin : false
});
```

### Deletions in table


#### delete

This will delete the data at the given primary id of the table.
 
```javascript

models.users.delete(3);
```

#### destroy

This will update the data with matching values according to the query builder given of the table with content provided. The whole content will not be replaced 
but only the properties provided. Primary key ,updatedAt and createdAt values will be ignored even if provided
 
```javascript

models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).destroy();
```

### Transactional Actions
Sometimes it is needed to work in a single transaction and commit the content once or fail throughout. For this purpose one
can use the transaction functionality in the system.

Open a transaction in any of the model and it will return entire list of models in transaction mode. Transaction mode is required to be set.

Calling **transaction.abort()** will cause the transaction to fail.


#### Usage
```javascript
import {Connector} from './dist/es2015/connection/connector.js';
import {TransactionModes} from './dist/es2015/models/model.interface.js';

let db = new Connector(config);


// Creating transaction through database
db.connect().then(async (models) => {
  const {transaction, transactionModels} = db.openTransaction(TransactionModes.Write);
  
  transactionModels.users.create({email: 'email@email.com'});
  transaction.abort();
});
   
// Creating transaction through models
db.connect().then(async (models) => {
 const {transaction, transactionModels} = models.users.openTransaction(TransactionModes.Write);
 
 transactionModels.users.create({email: 'email@email.com'});
 transaction.abort();
}); 
```

### Aggregations

#### Count

The count will return total number of records in the table against the result obtained by query builer object


```javascript

const count = await models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).count();
```

#### Average

Aggregate of the result at the given column will be provided. If the column contains non numeric value then it will be treated as a ZERO value 


```javascript

const average = await models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).average('id')
const nestedAverage = await models.users.whereIndex('userId', 10).where('firstName', 'Test').average('medical.contactId');
```

#### Reduce

Reduce process can be fired using the reduce function passed. If needed an default value can be passed as a second parameter 


```javascript
const result = await models.users.whereIndex('email', 'test@test.com').where('isAdmin', true).reduce((result, carry) => carry + result.id, 0);

/**
 * result with total number of records in the table 
**/

```
