var vows = require('vows')
  , assert = require('assert')
  , bdb = require('barricane-db')
  , fs = require('fs')
  ;

// mock up uuids for testing
var nextMockUuid = 0;
function mockUuid() {
	return "" + nextMockUuid++;
}

// remove old files, if they exist
try {
	fs.unlinkSync('/tmp/testdb.snapshot');
	fs.unlinkSync('/tmp/testdb.txnlog');
} catch (e) {
	console.log("unable to remove files");
}

vows.describe('Disk Manager Tests').addBatch({
    'Setting Up': { topic: 'hello'
	              , 'hello': function(topic) {
	            	    assert.deepEqual("hello", "hello");
					}
				  } 
}).export(module);
