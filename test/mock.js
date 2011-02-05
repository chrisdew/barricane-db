// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// This source exists because the demo-model uses process.db to register its
// instances and constructors.

function MockDB() {	
}

MockDB.prototype.registerInstance = function(instance) {
	instance["__uuid__"] = mockUuid();
};
MockDB.prototype.registerConstructors = function() {};

var nextUuid = 0;
function mockUuid() {
	return "" + nextUuid++;
}


// Export the MockDB in place of DB.
exports.DB = MockDB;
exports.uuid = mockUuid;