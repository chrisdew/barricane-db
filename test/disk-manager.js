var vows = require('vows')
  , assert = require('assert')
  , bdb = require('barricane-db')
  ;

// mock up uuids for testing
var nextMockUuid = 0;
function mockUuid() {
	return "" + nextMockUuid++;
}

vows.describe('Disk Manager Tests').addBatch({
    'Setting Up': { topic: 'hello'
	              , 'hello': function(topic) {
	            	    assert.deepEqual("hello", "hello");
					}
				  } 
}).export(module);
