//Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
//Released under the MIT open source licence.

// This module contains my first attempt at Serialisation/Unserialisation code.
// SWOJ is Simple Whole Object JSON.
 
// Other codecs could improve on this by serialising deltas or using a binary
// format.
 
// The codec system is designed to become pluggable - i.e. a database may be
// read in in with one codec and written with another. 

// There is little or no state in this codec, I am just writing it as a
// psuedo-class because I can see other codecs needing state.  It would be nice 
// to reduce the two-way linkage between db and codecs.  I'll be able to 
// refactor the db reference into a nicer interface, once I know what the 
// codecs require.

var util = require('./util');

function SwojCodec(magic) {
	this.magic = magic || '__';

	// Set up some almost constants.
	this.CONSTRUCTOR_TAG = this.magic + 'constructor' + this.magic;
	this.UUID_TAG = this.magic + 'uuid' + this.magic;
	this.DATE_TAG = this.magic + 'date' + this.magic;
}

SwojCodec.prototype.name = 'swoj';
SwojCodec.prototype.version = 0;
SwojCodec.prototype.defaultFileExtension = 'swoj';
SwojCodec.prototype.encoding = 'utf';

// This takes a single instance and returns a representation ready to be written
// to disk.
SwojCodec.prototype.serialise = function(instance) {
	var tmp = {};
	tmp[this.CONSTRUCTOR_TAG] = instance.constructor.name;
		
	for (var p in instance) {
		if (instance.hasOwnProperty(p)) {
			// Is this property a registered instance
			if ( instance[p] !== undefined 
			  && instance[p] !== null
			  && instance[p].hasOwnProperty(this.UUID_TAG)
			   ) {
				tmp[p] = this.UUID_TAG + instance[p][this.UUID_TAG];
			} else {
				// Treat dates carefully.
				if (instance[p] instanceof Date) {
					tmp[p] = this.DATE_TAG + instance[p].getTime();
				} else {
					// TODO: Add escaping of magic within values.
					tmp[p] = instance[p];
				}
			}
		}
	}
	
	return JSON.stringify(tmp);
}

// This takes a JSON string, and returns an object.
// The real work is done by fixLinks, the objects 
SwojCodec.prototype.deserialise = function(string, constructors) {
	var tmp = JSON.parse(string);
	
	// Find the constructor.
	var Constructor = constructors[tmp[this.CONSTRUCTOR_TAG]];
	
	// And the UUID.
	var uuid = tmp[this.UUID_TAG];
	
	// Create the object - see [Stack Overflow](http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply)
	// for a detailed explanation of how to call a constructor without 'new'.
    var Tmp = function(){}; // temporary constructor
    var inst, ret; // instance and temporary return value
    var args = [];
    Tmp.prototype = Constructor.prototype;
    inst = new Tmp;
    ret = Constructor.apply(inst, args);
    var ob = Object(ret) === ret ? ret : inst;
    ob[this.UUID_TAG] = uuid; // Fix UUID.

    util.ownRealKeys(tmp, this.magic).forEach(function(key, i, keys) {
    	ob[key] = tmp[key];
    });
    
    return ob;
}

// This replaces up any remaining values of __UUID__:... with references to the
// correct object, and also handles dates, etc.
SwojCodec.prototype.fixRefs = function(instances) {
	var that = this;
	util.ownKeys(instances).forEach(function(uuid, i, uuids) {
		util.ownRealKeys(instances[uuid], that.magic).forEach(function(key, i, keys) {
			var value = instances[uuid][key];
			// TODO: Add escaping of magic within values.
			if (typeof value == 'string') {
				if (value.startsWith(that.UUID_TAG)) {
					instances[uuid][key] = instances[value.slice(
														that.UUID_TAG.length)];
				}
				if (value.startsWith(that.DATE_TAG)) {
					instances[uuid][key] = new Date(
							parseInt(value.slice(that.DATE_TAG.length),10));
				}
			}
		});
	});
}


// Anonomise the exported name, so that codecs can be used interchangeably, 
exports.Codec = SwojCodec;