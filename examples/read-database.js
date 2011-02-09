// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

var bdb = require('barricane-db')
  , model = require('./example-model')
  ;
  
// Create a database instance.
var db = new bdb.DB({path: '/tmp', name: 'test_db'});

// Make the database available globally with the process.  If you don't do this,
// you can manually inject the database into appropriate constructors, or call
// <code>DB.registerInstance(instance)</code> every time you create an object. 
process.db = db;

// Your application must tell the DB about the constructors, before you ever
// open a previously existing database.  This could be done in example-model.js,
// but the application would have to delay requiring 'example-model' until
// process.db was created.
db.registerConstructors(model.House, model.Person);

// Open the database for business.
db.openSync();

// Find Fred
var fred = db.find('personalName', 'Fred')[0];

// Print out the values we read.
console.log(fred.familyName);
/* --> 'Flintstone' */

console.log(fred.spouse.personalName);
/* --> 'Wilma' */

console.log(fred.spouse.spouse.personalName);
/* --> 'Fred' */

console.log(fred.house.address);
/* --> '301 Cobblestone Wy., Bedrock, 70777' */

// This synchronously waits for all writes to complete.
db.endSync();