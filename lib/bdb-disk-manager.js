// The DB Manager handles aspects such as loading DBs from disk and persistence.

var bdb = require('../lib/old-barricane-db');
var fs = require('fs');

function BDBDiskManager(options) {
	var that = this;
	
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
	this.db = new bdb.DB(this.options);
	this.txnlog = null;
	this.txnlogPath = this.options.path + "/" + this.options.name + ".log";
	this.snapshot = null;
	this.snapshotPath = this.options.path + "/" + this.options.name + ".bdb";
	
	try { // FIXME: do this properly
		fs.statSync(this.snapshotPath);
		console.log("loadDB");
	} catch (e) {
		console.log("createDB");
		this.snapshot_fd = fs.openSync(this.snapshotPath, 'w');
		this.txnlog_fd = fs.openSync(this.txnlogPath, 'w');
		this.db.options.write = function(arg) {
			//console.log(arg);
			fs.write(that.txnlog_fd, arg);
		}
		fs.writeSync(this.snapshot_fd, JSON.stringify(this.db));
		fs.closeSync(this.snapshot_fd);
	}	
}

BDBDiskManager.prototype.end = function() {
	this.db.options.write = function() {};
	fs.closeSync(this.txnlog_fd);
	//this.txnlog.destroy();
}

exports.BDBDiskManager = BDBDiskManager;
