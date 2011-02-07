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


var codec = new swoj.Codec();

var suite = vows.describe('Codec').addBatch(
    { "serialise house"
    : { topic
      : house
      , "serialise"
      : function(topic) { assert.deepEqual(codec.serialise(topic), '{"__constructor__":"House","address":"301 Cobblestone Wy., Bedrock, 70777","__uuid__":"0"}'); }
      }
    , "serialise fred"
    : { topic
      : fred
      , "serialise"
      : function(topic) { assert.deepEqual(codec.serialise(topic), '{"__constructor__":"Person","personalName":"Fred","familyName":"Flintstone","spouse":"__uuid__2","house":"__uuid__0","__uuid__":"1"}'); }
      }
    , "serialise wilma"
    : { topic
      : wilma
      , "serialise"
      : function(topic) { assert.deepEqual(codec.serialise(topic), '{"__constructor__":"Person","personalName":"Wilma","familyName":"Flintstone","spouse":"__uuid__1","house":"__uuid__0","__uuid__":"2"}'); }
      }
    , "deserialise house"
    : { topic
      : '{"__constructor__":"House","address":"301 Cobblestone Wy., Bedrock, 70777","__uuid__":"0"}'
      , "deserialise"
      : function(topic) { assert.deepEqual(codec.deserialise(topic, {"House": model.House, "Person": model.Person}), house) }
      }
    , "deserialise all"
    : { topic
      : function() {
    		var instances = {};
    		var constructors = { 'House': model.House, 'Person': model.Person };
    		var ob0 = codec.deserialise('{"__constructor__":"House","address":"301 Cobblestone Wy., Bedrock, 70777","__uuid__":"0"}', constructors);
    		instances[ob0.__uuid__] = ob0;
    		var ob1 = codec.deserialise('{"__constructor__":"Person","personalName":"Fred","familyName":"Flintstone","spouse":"__uuid__2","house":"__uuid__0","__uuid__":"1"}', constructors);
    		instances[ob1.__uuid__] = ob1;
    		var ob2 = codec.deserialise('{"__constructor__":"Person","personalName":"Wilma","familyName":"Flintstone","spouse":"__uuid__1","house":"__uuid__0","__uuid__":"2"}', constructors);
    		instances[ob2.__uuid__] = ob2;
    		codec.fixRefs(instances);
    		return instances;
    	}
      , 'check house'
      : { topic
    	: function(topic) {
    	  	  //console.log("a", JSON.stringify(arguments));
    	      return topic['0'];  // house.__uuid__
          }
    	, 'address'
        : function(topic) {
              //console.log("b", JSON.stringify(arguments));
    	      assert.equal(topic.address, '301 Cobblestone Wy., Bedrock, 70777');
          }
        }
      , 'check Wilma'
      : { topic
  	    : function(topic) {
  	  	      //console.log("a", JSON.stringify(arguments));
  	          return topic['2'];  // wilma.__uuid__
          }
  	    , 'personalName'
        : function(topic) {
	          assert.equal(topic.personalName, 'Wilma');
          }
  	    , 'familyName'
        : function(topic) {
  	          assert.equal(topic.familyName, 'Flintstone');
          }
	    , 'spouse.personalName'
        : function(topic) {
  	          assert.equal(topic.spouse.personalName, 'Fred');
          }
	    , 'spouse.spouse.personalName'
        : function(topic) {
  	          assert.equal(topic.spouse.spouse.personalName, 'Wilma');
          }
	    , 'house.address'
        : function(topic) {
  	          assert.equal(topic.house.address, '301 Cobblestone Wy., Bedrock, 70777');
          }
        }
      }
    }
)

//TODO test unserialisation

suite.export(module);