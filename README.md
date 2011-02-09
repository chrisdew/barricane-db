BarricaneDB
===========

Alpha development.  Just about works - may contain bugs.

BarricaneDB is a loose implementation of the [Prevalence](http://www.ibm.com/developerworks/library/wa-objprev/) System Design Pattern, as implemented in Java by [Prevaylor](http://www.prevayler.org/), but for [NodeJS](http://nodejs.org/).

BarricaneDB is really just an ultra-simple persistance layer for a single process.  It can persist your application's model without any explicit 'save' commands.  Every Javascript <code>x.y = "foo";</code> (on registered instances) causes asynchronous persistance to disk.

Examples
--------
* [example-create-database](http://www.barricane.com/barricane-db/example-create-database.html) 
* [example-model](http://www.barricane.com/barricane-db/example-model.html) 
* [example-read-database](http://www.barricane.com/barricane-db/example-read-database.html) 

There's also full, docco-generated, documentation online at [http://www.barricane.com/barricane-db/](http://www.barricane.com/barricane-db/).

Installation
------------
* <code>npm install barricane-db</code>

Reasons why BarricaneDB will never be a good fit for your application.
----------------------------------------------------------------------
* Your data set is too big to fit in RAM.
* Your application needs ACID guarantees.  BarricaneDB could loose 1-5 seconds of data on a process crash (OS dependent).
* Your application doesn't happily shard into BarricaneDB's one-DB-per-process design.
* You need to query your database from outside the NodeJS process - e.g. Crystal Reports.

Reasons why BarricaneDB is not _currently_ a good fit.
------------------------------------------------------
* Your application needs a production-tested solution.
* You need good error handling.
* You need async database opening (persistence is already fully async).
* Transactions are important to you.

