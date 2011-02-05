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
function SwojCodec(magic) {
	this.magic = magic;
}

SwojCodec.prototype.name = 'swoj';
SwojCodec.prototype.version = 0;
SwojCodec.prototype.defaultFileExtension = 'swoj';
SwojCodec.prototype.encoding = 'utf';

// This takes a single instance and returns a representation ready to be written
// to disk.
SwojCodec.prototype.serialise = function(instance) {
	var tmp = {};
	tmp[this.magic + "constructor"] = instance.constructor.name;
		
	for (var p in instance) {
		if (instance.hasOwnProperty(p)) {
			// Is this property a registered instance
			if ( instance[p] !== undefined 
			  && instance[p] !== null
			  && instance[p].hasOwnProperty(this.wrap("uuid"))
			   ) {
				tmp[p] = this.wrap("UUID") + ":" + instance[p][this.wrap("uuid")];
			} else {
				// Treat dates carefully.
				if (instance[p] instanceof Date) {
					tmp[p] = this.wrap("DATE") + ":" + instance[p].getTime();
				} else {
					tmp[p] = instance[p];
				}
			}
		}
	}
	return JSON.stringify(tmp);
}

SwojCodec.prototype.wrap = function(string) {
	return this.magic + string + this.magic;
}


// Anonomise the exported name, so that codec can be used interchangeably, 
exports.Codec = SwojCodec;