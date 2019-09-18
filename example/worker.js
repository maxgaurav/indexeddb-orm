import {Connector} from "../dist/es2015/index.js";
import {Model} from "../dist/es2015/models/model.js";
import {RelationTypes} from "../dist/es2015/models/model.interface.js";

class Users extends Model {
  static TableName = 'users';

  constructor(db, table, connector) {
    super(db, table, connector);
  }

  userProfiles = () => {
    return this.hasOne(UserProfiles, 'userId', undefined, 'user_profiles').with([{
      model: 'users',
      foreignKey: '_id',
      type: RelationTypes.HasOne,
      localKey: 'userId',
      attributeName: 'user',
      func: (builder) => {
        builder.with([{
          model: 'addresses',
          foreignKey: 'userIds',
          type: RelationTypes.HasManyMultiEntry,
          attributeName: 'addresses',
        }]);
        return builder;
      }
    }]);
  }
}

class UserProfiles extends Model {
  static TableName = 'userProfiles';

  constructor(db, table, connector) {
    super(db, table, connector);
  }
}

//
// const model = new Model();
// window.model = model;
console.log(RelationTypes);
const a = new Connector({
  tables: [{
    name: 'users',
    ormClass: Users,
    columns: [{
      name: 'email',
      attributes: {
        unique: true
      }
    }]
  }, {
    name: 'userProfiles',
    columns: [{
      name: 'userId'
    }]
  }, {
    name: 'addresses',
    columns: [{
      name: 'userIds',
      attributes: {
        multiEntry: true
      }
    }]
  }, {
    name: 'tasks',
    columns: [{
      name: 'userId',
    }]
  }],
  name: 'sample',
  version: 1
});

a.connect().then(async (models) => {
  console.log(a, models);
  self.models = models;

});
