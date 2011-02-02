var vows = require('vows')
  , assert = require('assert')
  , bdb = require('barricane-db')
  , bdm = require('../lib/bdb-disk-manager')
  , fs = require('fs')
  ;
require('datejs');


// mock up uuids for testing
var nextMockUuid = 0;
function mockUuid() {
	return "" + nextMockUuid++;
}



var db = null;
var dm = null;
function setup() {
	// remove old files, if they exist
	try {
		fs.unlinkSync('/tmp/unnamed_db.bdb');
		fs.unlinkSync('/tmp/unnamed_db.log');
	} catch (e) {
		console.log("unable to remove files");
	}
	
	var dm = new bdm.BDBDiskManager({uuid: mockUuid});
	db = dm.db;
	
	function Customer(personal_name, family_name, dob) {
		this.personal_name = personal_name;
		this.family_name = family_name;
		this.dob = dob;
		db.register(this);
	}
	
	db.registerConstructors(Customer);
	
	var customer = new Customer("Fred", "Smith", Date.parse("2011-02-02"));
	customer.family_name = "Flintstone";
}

setup();

var suite = vows.describe('disk-manager').addBatch({
    '.bdb file': { topic: function() {
					    fs.readFile('/tmp/unnamed_db.bdb', 'utf8', this.callback);
					}
					, 'content': function(err, result) {
	            	    assert.equal(result, '{}');
					}
				  } 
  , '.log file': { topic: function() {
					    fs.readFile('/tmp/unnamed_db.log', 'utf8', this.callback);
					}
					, 'content': function(err, result) {
	            	    assert.equal(result, '{"__constructor":"Customer","personal_name":"Fred","family_name":"Smith","dob":"__DATE__1296604800000","__uuid":"0"}\n{"__constructor":"Customer","personal_name":"Fred","family_name":"Flintstone","dob":"__DATE__1296604800000","__uuid":"0"}\n');
					}
				  } 
})
suite.export(module);

setTimeout(function() {
	dm.end();
}, 1000);
