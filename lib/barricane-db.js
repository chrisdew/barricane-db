var uuid = require('node-uuid')

exports.hello_world = "Hello World";

//newClosure([args... ,] function_to_call)
function newClosure() {
    var args = Array.prototype.slice.call(arguments); 
    return function() {
        args[args.length - 1].apply(undefined, args.slice(0, args.length - 1))
    }
}

function ownKeys(o) {
    var accumulator = [];
    for (var propertyName in o) {
    	if (o.hasOwnProperty(propertyName)) {
    		accumulator.push(propertyName);
    	}
    }
    return accumulator;
}

DB.prototype.ownRealKeys = function(o) {
    var accumulator = [];
    for (var propertyName in o) {
    	if (o.hasOwnProperty(propertyName) && propertyName.slice(0,this.options.magic.length) !== this.options.magic) {
    		accumulator.push(propertyName);
    	}
    }
    return accumulator;
}

function DB(options) {
	this.options = options;
	if (this.options === undefined) {
		this.options = {};
	}
	if (this.options.uuid === undefined) {
		this.options.uuid = uuid;
	}
	if (this.options.write === undefined) {
		this.options.write = function() {}; // do nothing
	}
	if (this.options.magic === undefined) {
		this.options.magic = "__";
	}
	if (this.options.name === undefined) {
		this.options.name = "unnamed_db";
	}
	
	this.constructors = {};
	this.instances = {};
	this.stores = {};
	
}

//var args = Array.prototype.slice.call(arguments); 

DB.prototype.serialise = function(ob) { 
	var ret = {};
	ret.__constructor = ob.constructor.name;
		
	for (var p in ob) {
		if (ob.hasOwnProperty(p)) {
			// is this property a registered instance
			if (ob[p] !== undefined && ob[p].hasOwnProperty(this.options.magic + "uuid")) {
				ret[p] = this.options.magic + "ID" + this.options.magic + ob[p].__uuid;
			} else {
				if (ob[p] instanceof Date) {
					ret[p] = this.options.magic + "DATE" + this.options.magic + ob[p].getTime();;
				} else {
					ret[p] = ob[p];
				}
			}
		}
	}
	return ret;
}

DB.prototype.registerConstructors = function() {
	var args = Array.prototype.slice.call(arguments); 
	for (var i in args) {
		this.constructors[args[i].name] = args[i];
	}
}

DB.prototype.register = function(instance) {
	var that = this;
	
	instance.__uuid = this.options.uuid();
	
	//constructor = instance.constructor;
	//// is it the first time we;ve seen an object of this type?
	//if (this.constructors[constructor.name] === undefined) {
	//	this.constructors[constructor.name] = constructor;
	//}
	this.instances[instance.__uuid] = instance;
	var store = {};	// the backing store for the instance data
	this.stores[instance.__uuid] = store;
	
	// setup setter handlers FIXME
	//for (var p in instance) {
	//	if (instance.hasOwnProperty(p) && p.slice(0,2) != "__") {
	//		console.log("defineSetter", instance[p], p);
	//		instance.__defineSetter__(p, newClosure(p, function(q) {
	//			console.log("outerSetter", instance[q], q);
	//			return (function(val) {
	//				console.log("Setter", instance[q], q, val);
	//				instance[q] = val;
	//				that.options.write(that.serialise(instance));
	//			})
	//		}));
	//	}
	//}
	
	// FIXME
	this.ownRealKeys(instance).forEach(function(p, i, all) {
	    //var args = Array.prototype.slice.call(arguments); 
		//console.log("Setter0", JSON.stringify(instance), instance[p], p);
		//var old = instance[p];
		store[p] = instance[p];
		instance.__defineSetter__(p, function(val) {
			//console.log("Setter", JSON.stringify(instance), instance[p], p, val);
			store[p] = val;
			that.options.write(JSON.stringify(that.serialise(instance)) + "\n");
		});
		instance.__defineGetter__(p, function() {
			return store[p];
		});
	});
	
	
	// finally add the object to the log
	//console.log("write0", this.options.write);
	this.options.write(JSON.stringify(that.serialise(instance)) + "\n");
	
}

DB.prototype.toJSON = function() {
	var ret = {};
	for (var p in this.instances) {
		if (this.instances.hasOwnProperty(p)) {
			ret[p] = this.serialise(this.instances[p]);
		}
	}
	//console.log(JSON.stringify(ret));
	return ret;
}

// This method sets up the instances from their serialised form.
DB.prototype.fromJSON = function(json) {
	for(var uuid in json) {
		if (json.hasOwnProperty(uuid)) {
			// FIXME create the object using it's constructor
			// findout about modifying the constructors to automatically add a 'register' call.
			this.instances[uuid] = json[uuid];
		}
	}
	for(var uuid in this.instances) {
		if (this.instances.hasOwnProperty(uuid)) {
			var ob = this.instances[uuid];
		    for(var p in ob) {
		    	if (ob.hasOwnProperty(p)) {
		    		var value = json[p];
		    		if (value instanceof String) {
		    			// FIXME 
		    			// if it's a __ID__ or __DATE__
		    			// substitute in the real link/date
		    			// 
		    		}
			    }
			}
		}
	}
}

// This method amends the instances from the transaction log.
DB.prototype.fromLog = function(log) {
	
}
	
	
exports.DB = DB;