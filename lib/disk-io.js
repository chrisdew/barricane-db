// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
/// Released under the MIT open source licence.

// This module contains the DiskIO code.

// The DiskIO constructor creates an object which can be used by DB to interact
// with the outside world.  Other IOs will be possible in future, including 
// ReplicationIO.
function DiskIO(options) {
	if (!options) {
		options = {};
	}
	this.path = options.path || '/tmp/barricane.db';
	// Writes must be counted, so we only close the file whwn all has been 
	// written.
	this.outstandingWrites = 0;
}

// This writes the serialise object to disk.
DiskIO.prototype.write = function (serialisedObject) {	
};

// Read serialises objects back from disk, and 
// <code>callback(err, result)</code> for each one.
DiskIO.prototype.read = function (callback) {	
};


// Export the symbols.
exports.DiskIO = DiskIO;