// The DB Manager handles aspects such as loading DBs from disk and persistence.

var bdb = require('barricane-db');
var fs = require('fs');

function BDBDiskManager(path) {
	this.path = path;
	this.bdb = null;
	this.txnlog = {};
}

BDBDiskManager.prototype.openDB = function(name) {
	fs.statSync()
}


BDBDiskManager.prototype._createDB = function(name) {
	this.txnlog = 
	this.bdb = new bdb.DB(
		{ name: name
		, manager: this
		, write: this.txnlog[name].write
		} 
	);
}

BDBDiskManager.prototype._openDB = function(name) {

}
