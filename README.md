BarricaneDB
===========

Alpha development.  Does NOT yet work yet.

BarricaneDB is a loose implementation of the [Prevalence](http://www.ibm.com/developerworks/library/wa-objprev/) System Design Pattern, as implemented in Java by [Prevaylor](http://www.prevayler.org/), but for [NodeJS](http://nodejs.org/).

Features
--------
* Fantastically fast.
* Stupidly simple, thank you __defineSetter__ and friends.
* ORM-less, just work with your objects directly.
* Snapshot plus transaction log gives persistance in event of an application crash.

Anti-Features
-------------
* Untested in production.
* Performance can still be greatly improved.
* Single process.
* Not durable - you will lose 1-5 seconds of changes on a crash (OS dependent).

Usage
-----
First install it:

    npm install barricane-db

Then create and populate a test database:

    var bdb = require('barricane-db');
    
    var db = new bdb.DB({path: '/tmp', name: 'test_db'});
    
    // run of the mill constructors and a method
    function House(address) {
        this.address = address;
        db.register(this);
    }
    House.prototype.logConstructionMaterial = function() {
        console.log(this.address + ' is made of stone');
    }

    function Person(personalName, familyName) {
        this.personalName = personalName;
        this.familyName = familyName;
        this.spouse = null; // MUST declare any field which needs persistance
                            // ONLY registered constructors, plain objects,
                            // arrays, strings, numbers and dates will be
                            // persisted.
        db.register(this);
    }

    // This is only needed if the database is found on disk - BDB needs to know
    // how to reconstruct the objects from the snapshot and transaction log.
    db.registerConstructors(House, Person);

    // the database should not exist yet
    var alreadyExisted = db.loadDBIfExists();
    console.log("alreadyExisted:", alreadyExists);
    // ->> false

    
    var house = new House("301 Cobblestone Wy., Bedrock, 70777");
    var fred = new Person("Fred", "Flintstone");
    var wilma = new Person("Wilma", "Flintsone");
    fred.spouse = wilma;
    wilma.spouse = fred;
    
    db.end();   // this waits for all writes to complete before performing
                // a snapshot and closing the database


Then load and reconstitute the database:

    var bdb = require('barricane-db');

    var db = new bdb.DB({path: '/tmp', name: 'test_db'});

    // if course you'll really be requiring your constructors from a common
    // file - this needless duplication is just to keep this example simple
    function House(address) {
        this.address = address;
        db.register(this);
    }
    House.prototype.logConstructionMaterial = function() {
        console.log(this.address + ' is made of stone');
    }

    function Person(personalName, familyName) {
        this.personalName = personalName;
        this.familyName = familyName;
        this.spouse = null; // MUST declare any field which needs persistance
                            // ONLY registered constructors, plain objects,
                            // arrays, strings, numbers and dates will be
                            // persisted.

        db.register(this);
    }

    db.registerConstructors(House, Person);
    var alreadyExisted = db.loadDBIfExists();
    console.log("alreadyExisted:", alreadyExists);
    // ->> true

    // get all the people
    var people = db.getInstancesByConstructor(Person);
    console.log("numPeople:", people.length);    // 2

    // find wilma
    var wilma = null;
    people.forEach(function(i, person, people) {
        if (person.name === "Wilma") {
            wilma = person;
        }
    });
        
    console.log("wilma:", wilma.firstName, wilma.familyName);
    // --> wilma: Wilma Flintstone

    // once you've found an object you can follow references, as normal,
    // through your object graph

    var house = fred.house
    console.log("house:", house.address);   
    // --> house: 301 Cobblestone Wy., Bedrock, 70777

    var fred = wilma.spouse
    console.log("fred:", fred.firstName, fred.familyName);
    // --> fred: Fred Flintstone

    // methods still work correctly
    house.logConstructionMaterial();
    // --> 301 Cobblestone Wy., Bedrock, 70777 is made of stone

    db.end();

