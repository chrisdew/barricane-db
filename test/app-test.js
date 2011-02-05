// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

var vows = require('vows')
  , assert = require('assert')
  , bdb = require('../lib/barricane-db')
  ;

var suite = vows.describe('Setup').addBatch(
    { "dummy"
    : { topic
      : function() { return 42; }
      , "equal 42"
      : function(topic) { assert.equal(topic, 42); }
      }
    }
)

suite.export(module);