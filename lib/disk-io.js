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
	
	this.path = options.path || '/tmp';
	this.name = options.name || 'unnamed_db';
	this.codec = options.codec || new codec.Codec(options.magic); 
	
	// Psuedo constants.
	this.FILENAME = this.name + "." 
		+ this.codec.defaultFileExtension + ".barricane-db";
	this.OLD_FILENAME = this.LIVE_FILENAME + ".old";
	
	// 
	this.fd = null;	// The file descriptor for persistence.
	this.oldFd = null;	// The file descriptor for the old copy of the database.
	
	this.writeStream = null;
	
	// Writes must be counted, so we only close the file when all has been 
	// written.
	this.outstandingWrites = 0;
	
	// If end is requested, this will contain a callback.
	this.ending = false;
}

// This writes an object to disk.
DiskIO.prototype.persist = function (instance) {	
	console.log("persisting");
	var that = this;
	this.outstandingWrites++;
	
	var serialised = this.codec.serialise(instance);
	this.writeStream.write(serialised + "\n", function(err, result) {
		that.outstandingWrites--;
		if (that.outstandingWrites === 0 && that.ending) {
			that.writeStream.end(); // FIXME: we need to call the callback only after the end.
			that.ending(false, '');
		}
	});
};

// This opens the DiskIO for use.
DiskIO.prototype.openSync = function() {
	var preexisting = false;
	
	// First get the contents of the path.
	var contents = fs.readdirSync(this.path);
	
	// If there's a pre-existing file, we move it to old then read in the 
	// contents later.
	for (var i in contents) {
		if (contents[i] === this.FILENAME) {
			fs.renameSync(this.path + "/" + this.FILENAME,
					this.path + "/" + this.OLD_FILENAME);
			preexisting = true;
		}
	}
	
	// Create a new file for persistence.
	this.writeStream = fs.WriteStream(this.path + "/" + this.FILENAME, 
			{ flags: 'w', encoding: 'utf8', mode: 0666});
	
	if (preexisting) {
		this._load(this.path + "/" + this.OLD_FILENAME);
	}
}

// This loads a database from disk.
DiskIO.prototype._load = function(filepath) {
	//this.oldFd = fs.openSync(filepath, 'r');
	
	// CONTINUE
}


// This will delete any pre-existing database files - for now it just moves them
// aside.
DiskIO.prototype.deleteSync = function() {
	// First get the contents of the path.
	var contents = fs.readdirSync(this.path);
	console.log('contents:', contents);
	for (var i in contents) {
		if (contents[i] === this.FILENAME) {
			fs.renameSync(this.path + "/" + this.FILENAME,
					this.path + "/" + this.FILENAME + ".deleteme");
		}
		if (contents[i] === this.OLD_FILENAME) {
			fs.renameSync(this.path + "/" + this.OLD_FILENAME,
					this.path + "/" + this.OLD_FILENAME + ".deleteme");
		}
	}
}

DiskIO.prototype.end = function(callback) {
	if (this.outstandingWrites === 0) {
		fd.end(); // FIXME: we need to call the callback only after the end.
		callback(false, '');
	}
	this.ending = callback;
}

// Export the symbols.
exports.DiskIO = DiskIO;