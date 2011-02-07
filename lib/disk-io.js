// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
/// Released under the MIT open source licence.

// This module contains the DiskIO code.

// The DiskIO constructor creates an object which can be used by DB to interact
// with the outside world.  Other IOs will be possible in future, including 
// ReplicationIO.

var codec = require('./swoj-codec')
  , fs = require('fs')
  ;

function DiskIO(options) {
	options = options || {};
	
	this.path = options.path || '/tmp/barricane.db';
	this.codec = options.codec || new codec.Codec(options.magic); 
	
	this.writeStream = null;
	
	// Writes must be counted, so we only close the file when all has been 
	// written.
	this.outstandingWrites = 0;
	
	// If end is requested, this will contain a callback.
	this.ending = false;
}

// This writes an object to disk.
DiskIO.prototype.write = function (instance) {	
	var that = this;
	this.outstandingWrites++;
	
	var serialised = this.codec.serialise(instance);
	this.writeStream.write(serialised, function(err, result) {
		that.outstandingWrites--;
		if (that.outstandingWrites === 0 && that.ending) {
			that.ending(false, '');
		}
	});
};

DiskIO.prototype.openSync = function() {
}

// This deletes any database files.
DiskIO.prototype.deleteSync = function() {
	// First get the contents of the path.
	var contents = fs.readdirSync(this.path);
	console.log('contents:', contents);
	// <-- CONTINUE
}

DiskIO.prototype.end = function(callback) {
	this.ending = callback;
}

// Export the symbols.
exports.DiskIO = DiskIO;