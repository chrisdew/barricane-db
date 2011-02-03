var vows = require('vows')
  , assert = require('assert')
  , bdb = require('../lib/barricane-db')
  ;

vows.describe('Setup').addBatch(
    { "dummy"
    : { topic
      : function() { return 42; }
      , "equal 42"
      : function(topic) { assert.equal(topic, 42); }
      }
    }
);