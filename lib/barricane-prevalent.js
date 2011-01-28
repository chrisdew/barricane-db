var uuid = require('node-uuid')

exports.hello_world = "Hello World";

function Prevalent(path) {
	this.path = path;
	this.constructors = {};
	this.instances = {};
}

//var args = Array.prototype.slice.call(arguments); 

function $$serialise() {
	var ret = {};
	ret.$$constructor = this.constructor.name;
		
	for (var p in this) {
		if (this.hasOwnProperty(p)) {
			// is this property a registered instance
			if (this.$$store.instances[this.$$uuid] !== undefined ) {
				ret[p] = "$$" + this.uuid;
			} else {
				ret[p] = this[p];
			}
		}
	}
	return ret;
}

Prevalent.prototype.register = function(instance) {
	instance.$$uuid = uuid();
	instance.$$store = this;
	instance.$$serialise = $$serialise;
	
	constructor = instance.constructor;
	// is it the first time we;ve seen an object of this type?
	if (this.constructors[constructor.name] === undefined) {
		this.constructors[constructor.name] = constructor;
	}
	this.instances[instance.$$uuid] = instance;
}

Prevalent.prototype.toJson = function() {
	var ret = {};
	for (var p in this.instances) {
		if (this.instances.hasOwnProperty(p)) {
			ret[p] = this.instances[p].$$serialise();
		}
	}
	return ret;
}

	
	
exports.Prevalent = Prevalent;