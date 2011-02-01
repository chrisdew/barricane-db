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

function ownRealKeys(o) {
    var accumulator = [];
    for (var propertyName in o) {
    	if (o.hasOwnProperty(propertyName) && propertyName.slice(0,2) !== "__") {
    		accumulator.push(propertyName);
    	}
    }
    return accumulator;
}

function Prevalent(options) {
	this.options = options;
	if (this.options === undefined) {
		this.options = {};
	}
	if (this.options.uuidFn === undefined) {
		this.options.uuidFn = uuid;
	}
	if (this.options.write === undefined) {
		this.options.write = function() {}; // do nothing
	}
	
	this.constructors = {};
	this.instances = {};
}

//var args = Array.prototype.slice.call(arguments); 

Prevalent.prototype.serialise = function(ob) { // change this to a plain function
	var ret = {};
	ret.__constructor = ob.constructor.name;
		
	for (var p in ob) {
		if (ob.hasOwnProperty(p)) {
			// is this property a registered instance
			if (ob[p] !== undefined && ob[p].hasOwnProperty("__uuid")) {
				ret[p] = "__ID__" + ob[p].__uuid;
			} else {
				if (ob[p] instanceof Date) {
					ret[p] = "__DATE__" + ob[p].getTime();;
				} else {
					ret[p] = ob[p];
				}
			}
		}
	}
	return ret;
}

Prevalent.prototype.register = function(instance) {
	var that = this;
	
	instance.__uuid = this.options.uuidFn();
	
	constructor = instance.constructor;
	// is it the first time we;ve seen an object of this type?
	if (this.constructors[constructor.name] === undefined) {
		this.constructors[constructor.name] = constructor;
	}
	this.instances[instance.__uuid] = instance;
	
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
	ownRealKeys(instance).forEach(function(p, i, all) {
	    //var args = Array.prototype.slice.call(arguments); 
		console.log("foo", p, i);
		//instance.__defineSetter__(p, function(val) {
		//	console.log("Setter", instance[p], p, val);
		//	instance[p] = val;
		//	that.options.write(that.serialise(instance));
		//});
	});
	
	
	// finally add the object to the log
	this.options.write(that.serialise(instance));
	
}

Prevalent.prototype.toJson = function() {
	var ret = {};
	for (var p in this.instances) {
		if (this.instances.hasOwnProperty(p)) {
			ret[p] = this.serialise(this.instances[p]);
		}
	}
	return ret;
}

	
	
exports.Prevalent = Prevalent;