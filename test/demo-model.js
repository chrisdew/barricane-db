// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// This is demonstration model code, as used in test suites.

// A house constructor.
function House(address) {
    this.address = address;
    
    // Managed objects need to be registered - this causes them to be persisted.
    // Registering in the constructor is just convenient, not required.
    process.db.registerInstance(this);
}
// A pointless method, just because.
House.prototype.logConstructionMaterial = function() {
    console.log(this.address + ' is made of stone');
}

// A person constructor.
function Person(personalName, familyName) {
    this.personalName = personalName;
    this.familyName = familyName;
    // MUST declare any field which needs to trigger persistence.
    // ONLY registered constructors, plain objects, arrays, strings, numbers and
    // dates will be persisted.
    this.spouse = null;
    this.house = null;

    process.db.registerInstance(this);
}

// Register the constructors.
process.db.registerConstructors(House, Person);

// Export the symbols.
exports.House = House;
exports.Person = Person;