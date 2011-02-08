BarricaneDB
===========

Alpha development.  Does NOT yet work yet.

BarricaneDB is a loose implementation of the [Prevalence](http://www.ibm.com/developerworks/library/wa-objprev/) System Design Pattern, as implemented in Java by [Prevaylor](http://www.prevayler.org/), but for [NodeJS](http://nodejs.org/).

BarricaneDB is really just an ultra-simple persistance layer for a single process.  It can persist your application's model without any explicit 'save' commands.  Every Javascript <code>x.y = "foo";</code> (on registered instances) causes asynchronous persistance to disk.

See the [examples](https://github.com/chrisdew/barricane-db/tree/master/examples) for how easy it is to get started.

Installation
------------
* Package not available yet - will be <code>npm install barricane-db</code>

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

