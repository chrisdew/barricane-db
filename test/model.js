// This is demonstration model code.

// A house constructor.
function House(address) {
    this.address = address;
    process.db.register(this);
}
// A pointless method, just because.
House.prototype.logConstructionMaterial = function() {
    console.log(this.address + ' is made of stone');
}

// A person constructor.
function Person(personalName, familyName) {
    this.personalName = personalName;
    this.familyName = familyName;
    // MUST declare any field which needs to trigger persistance.
    // ONLY registered constructors, plain objects, arrays, strings, numbers and
    // dates will be persisted.
    this.spouse = null;

    process.db.register(this);
}

// Export the symbols.
exports.House = House;
exports.Person = Person;