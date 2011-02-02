// The DB Manager handles aspects such as loading DBs from disk and persistence.

var bdb = require('barricane-db');
var fs = require('fs');

function BDBDiskManager(options) {
	this.options = options;
	if (this.options === undefined) {
		this.options = {};
	}
	if (this.options.path === undefined) {
		this.options.path = "/tmp/";
	}
	if (this.options.name === undefined) {
		this.options.name = "unnamed_db";
	}
	this.bdb = null;
	this.txnlog = {};
}

BDBDiskManager.prototype.openDB = function(name) {
	fs.statSync()
}


BDBDiskManager.prototype._createDB = function(name) {
	this.txnlog = 
	this.bdb = new bdb.DB(
		{ name: this.options.name
		, manager: this
		, write: this.txnlog.write
		} 
	);
}

BDBDiskManager.prototype._openDB = function(name) {

}
