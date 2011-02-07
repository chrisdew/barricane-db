// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// This is the obligatory dumping ground modules for all those bits which don't 
// fit well elsewhere.

// This finds all the objects keys.
function ownKeys(o) {
    var accumulator = [];
    for (var propertyName in o) {
    	if (o.hasOwnProperty(propertyName)) {
    		accumulator.push(propertyName);
    	}
    }
    return accumulator;
}

// This finds all the objects keys, which do not contain the magic marker.
function ownRealKeys(o, magic) {
	//console.log('o', JSON.stringify(o), 'magic', magic);
    var accumulator = [];
    for (var propertyName in o) {
    	// FIXME: we should find a way of checking that the trailing magic is 
    	// present too. 
    	if ( o.hasOwnProperty(propertyName) 
    	  && propertyName.slice(0, magic.length) !== magic
    	    ) {
    		accumulator.push(propertyName);
    	}
    }
    return accumulator;
}

// Clobber the string prototype - nasty but convenient.
String.prototype.startsWith = function(text) {
	return this.slice(0, text.length) === text;
}

// Export the functions.
exports.ownKeys = ownKeys
exports.ownRealKeys = ownRealKeys