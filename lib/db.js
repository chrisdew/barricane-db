// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// This module contains the database code.
// It specifically eschews serialisation and io concerns.

var uuid = require('node-uuid')
  , dio = require('./disk-io');

// The DB constructor represents the database. In almost all circumstances only
// one database will exist per process. More can be used, if needed, but the
// application will become more complex, as it cannot use
// <code>process.db</code> in constructors.
function DB(options) {
	if (!options) {
		options = {};
	}
	// <code>magic</code> is a string which must not normally occur in your application's
	// property names. Double underscore is the default.
	this.magic = options.magic || "__";
	// <code>uuid</code> is the function used to generate unique IDs for each
	// managed object. It is overridable for testing purposes, where the IDs
	// need to be deterministic.
	this.uuid = options.uuid || uuid;
	// The <code>io</code> manager is responsible for IO. By default BarricaneDB
	// uses simple disk-nased persistence. The <code>ioManager</code> is
	// separated so that it can be optionally replaced with ReplicationIO at
	// some point in the future.
	this.io = options.io || new dio.DiskIO(options);
	// <code>instances</code> contains all of the *managed* objects, indexed
	// by uuid.
	this.instances = {};
	// <code>stores</code> contains all of the *managed* objects' data, indexed
	// by uuid. The data is separate as the properties in the instances have
	// custom getters/setters, via <code>__defineSetter__</code>.
	this.stores = {};
}

// Export the symbols.
exports.DB = DB;