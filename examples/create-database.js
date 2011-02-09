// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

var bdb = require('barricane-db')
  ;
  
// Create a database instance.
var db = new bdb.DB({path: '/tmp', name: 'test_db'});

// Make the database available globally with the process.  If you don't do this,
// you can manually inject the database into appropriate constructors, or call
// <code>DB.registerInstance(instance)</code> every time you create an object. 
process.db = db;

// Import the model, now that we have defined <code>process.db</code>.
var model = require('./example-model');

// Delete any database of the same path and name.  Most applications will never
// use this.  It's only used here so that we know this has created a brand new 
// database.
db.deleteSync();
//process.exit(0);

// Open the database for business.  Most once-per-process methods of DB are
// synchronous, as it's not really an issue and makes applications simpler.
// All persistence is done asynchronously.
db.openSync();

// Construct a simple model from which objects can be persisted.
var house = new model.House("301 Cobblestone Wy., Bedrock, 70777");
var fred = new model.Person("Fred", "Flintstone");
fred.house = house;
var wilma = new model.Person("Wilma", "Flintstone");
wilma.house = house;
fred.spouse = wilma;
wilma.spouse = fred;

// No save() needed - persistence is transparent.

// This synchronously waits for all writes to complete.
db.end(function(err, result) {
	if (!err) {
		console.log('database has persisted successfully');
	} else {
		console.log('error:', error);
	}
});
