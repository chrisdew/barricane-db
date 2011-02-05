// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

var vows = require('vows')
  , assert = require('assert')
  , mock = require('./mock')
  , swoj = require('../lib/swoj-codec')
  ;

// Create a process wide MockDB, with mocked up uuids.
process.db = new mock.DB();

// <code>process.db</code> must exist before we can require our model. You can 
// leave your model untouched by BarricanDB and manually call 
// <code>DB.registerInstance</code> as each new object is constructed, But This 
// way is generally easier.
var model = require('./demo-model');

// Construct a simple model from which objects can be persisted.
var house = new model.House("301 Cobblestone Wy., Bedrock, 70777");
var fred = new model.Person("Fred", "Flintstone");
fred.house = house;
var wilma = new model.Person("Wilma", "Flintstone");
wilma.house = house;
fred.spouse = wilma;
wilma.spouse = fred;


var codec = new swoj.Codec("__");

var suite = vows.describe('Serialise').addBatch(
    { "house"
    : { topic
      : house
      , "serialise"
      : function(topic) { assert.deepEqual(codec.serialise(topic), '{"__constructor":"House","address":"301 Cobblestone Wy., Bedrock, 70777","__uuid__":"0"}'); }
      }
    , "fred"
    : { topic
      : fred
      , "serialise"
      : function(topic) { assert.deepEqual(codec.serialise(topic), '{"__constructor":"Person","personalName":"Fred","familyName":"Flintstone","spouse":"__UUID__:2","house":"__UUID__:0","__uuid__":"1"}'); }
      }
    , "wilma"
    : { topic
      : wilma
      , "serialise"
      : function(topic) { assert.deepEqual(codec.serialise(topic), '{"__constructor":"Person","personalName":"Wilma","familyName":"Flintstone","spouse":"__UUID__:1","house":"__UUID__:0","__uuid__":"2"}'); }
      }
    }
)

//TODO test unserialisation

suite.export(module);