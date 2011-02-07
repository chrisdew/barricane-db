// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// This is the obligatory dumping ground modules for all those bits which don't 
// fit well elsewhere.

// This finds all the objects keys, which do not contain the magic marker.
function ownRealKeys(o, magic) {
    var accumulator = [];
    for (var propertyName in o) {
    	// FIXME: we should find a way of checking that the trailing magic is 
    	// present too. 
    	if ( o.hasOwnProperty(propertyName) 
    	  && propertyName.slice(0,this.magic.length) !== magic
    	    ) {
    		accumulator.push(propertyName);
    	}
    }
    return accumulator;
}

exports.ownRealKeys = ownRealKeys