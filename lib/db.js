// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// This module contains the database code.
// It specifically eschews serialisation and io concerns.

var uuid = require('node-uuid')
  , dio = require('./disk-io')
  , util = require('./util')
  ;

// The DB constructor represents the database. In almost all circumstances only
// one database will exist per process. More can be used, if needed, but the
// application will become more complex, as it cannot use
// <code>process.db</code> in constructors.
function DB(options) {
	options = options || {};

	// <code>magic</code> is a string which must not normally occur in your application's
	// property names. Double underscore is the default.
	this.magic = options.magic || "__";
	
	// Set up some almost constants.
	this.CONSTRUCTOR_TAG = this.magic + 'constructor' + this.magic;
	this.UUID_TAG = this.magic + 'uuid' + this.magic;
	this.DATE_TAG = this.magic + 'date' + this.magic;
	
	// <code>uuid</code> is the function used to generate unique IDs for each
	// managed object. It is overridable for testing purposes, where the IDs
	// need to be deterministic.
	this.uuid = options.uuid || uuid;
	
	// The database needs to keep track of constructors, in order to be able
	// to reconstruct objects when opening a database.
	this.constructors = {};
	
	// <code>instances</code> contains all of the *managed* objects, indexed
	// by uuid.
	this.instances = {};
	
	// <code>stores</code> contains all of the *managed* objects' data, indexed
	// by uuid. The data is separate as the properties in the instances have
	// custom getters/setters, via <code>__defineSetter__</code>.
	this.stores = {};
	
	// The <code>persist</code> flag is made false during database 
	// reconstruction, otherwise we would get into a frightful pickle.
	this.persist = true;
	
	// The <code>io</code> manager is responsible for IO. By default BarricaneDB
	// uses simple disk-based persistence. The <code>io</code> manager is
	// separated so that it can be optionally replaced with ReplicationIO at
	// some point in the future.
	this.io = options.io || new dio.DiskIO(options, this);
}

// This opens the database for use.  It only exists because I'm not sure about
// the validity of calling instance members from within the constructor.
DB.prototype.openSync = function() {
	this.persist = false;
	
	this.io.openSync();
	
	this.persist = true;
}


// This must be called once for every instance which needs to be persisted.
// It is idiomatic to do this in the constructor, using a global 
// <code>process.db</code> database.
DB.prototype.registerInstance = function(instance) {
	var that = this;
		
	instance[this.UUID_TAG] = this.uuid();
		
	this.instances[instance[this.UUID_TAG]] = instance;
	var store = {};	// the backing store for the instance data
	this.stores[instance[this.UUID_TAG]] = store;
	
	console.log("about to create setters");
	util.ownRealKeys(instance, this.magic).forEach(function(p, i, all) {
		store[p] = instance[p];
		console.log("creatig setter", p);
		instance.__defineSetter__(p, function(val) {
			console.log("setter called", JSON.stringify(that.persist));
			store[p] = val;
			if (that.persist) {
				that.io.persist(instance);
			}
		});
		instance.__defineGetter__(p, function() {
			return store[p];
		});
	});
	
	
	// Finally add the object to the log, if the database is not in the middle
	// of reconstruction.
	if (this.persist) {
		this.io.persist(instance);
	}
};

// The database needs to keep track of constructors, so that it can call them 
// when loading a database.
DB.prototype.registerConstructors = function() {
	var args = Array.prototype.slice.call(arguments); 
	for (var i in args) {
		this.constructors[args[i].name] = args[i];
	}
};

// This is a very inefficient and rudimentary query.  It is envisaged that most
// objects will be accessed via O(1) traversal, rather than this naive O(N) 
// lookup.
DB.prototype.find = function(property, value) {
	var tmp = [];
	
	for (var i in this.instances) {
		var instance = this.instances[i];
		if (instance[property] === value) {
			tmp.push(instance);
		}
	}
	
	return tmp;
}


// Just a wrapper.
DB.prototype.deleteSync = function() {
	this.io.deleteSync();
}

// Just a wrapper.
DB.prototype.end = function(callback) {
	this.io.end(callback);
}

// Export the symbols.
exports.DB = DB;