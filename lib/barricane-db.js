// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// BarricaneDB - a transparent object persistence mechanism for NodeJS.
// ====================================================================

// Status v0.2.0 - Just about works - there will be bugs.

// BarricaneDB is a persistence layer for [NodeJS](http://nodejs.org/) which was developed to meet my following requirements:

// * My app's state exists as a heap of objects in RAM.  I just want to be able to shutdown my app and get that same heap of objects the next time I start my app.
// * I don't want to have to add or change more than a dozen lines of code.
// * I want a proper transaction log, so that the data is resilient against application crashes.
// * I want to be able to read the transaction log - I care more about making my app easily debuggable than saving disk space.

// BarricaneDB is a loose implementation of the [Prevalence](http://www.ibm.com/developerworks/library/wa-objprev/) System Design Pattern, as implemented in Java by [Prevaylor](http://www.prevayler.org/), but for [NodeJS](http://nodejs.org/).

// Examples
// --------
// * [example-create-database](http://www.barricane.com/barricane-db/example-create-database.html) 
// * [example-model](http://www.barricane.com/barricane-db/example-model.html) 
// * [example-read-database](http://www.barricane.com/barricane-db/example-read-database.html) 

// There's also docco-generated, documentation online at [http://www.barricane.com/barricane-db/](http://www.barricane.com/barricane-db/).

// Installation
// ------------
// * <code>npm install barricane-db</code>

// Reasons why BarricaneDB will never be a good fit for your application.
// ----------------------------------------------------------------------
// * Your data set is too big to fit in RAM.
// * Your application doesn't happily shard into BarricaneDB's one-DB-per-process design.
// * You need to query your database from outside the NodeJS process - e.g. Crystal Reports.

// Reasons why BarricaneDB is not _currently_ a good fit.
// ------------------------------------------------------
// * Your application needs a production-tested solution.
// * You need good error handling.
// * You need async database opening (persistence is already fully async).
// * Transactions are important to you.
// * Your application needs ACID guarantees.  BarricaneDB could loose 1-5 seconds of data on a process crash (OS dependent).

// Backwards compatibility.
// ------------------------
// * We use codecs to separate the data representation from the database.
// * All future versions of BarricaneDB will be able to read v0.2.0 <code>.swoj</code> files.

// Keep up with BarricaneDB.
// -------------------------
// * [Watch](https://github.com/chrisdew/barricane-db/toggle_watch) this project on [GitHub](https://github.com/chrisdew/barricane-db).
// * Follow the [barricane-db](https://groups.google.com/group/barricane-db) Google Group.
// * Look at the documentation on [www.barricane.com](http://www.barricane.com/barricane-db).
// * Send me an [email](mailto:cmsdew@gmail.com).
// * Follow [chrisdew](http://twitter.com/chrisdew) on Twitter.

// Roadmap
// -------
// * Whether I do anything more to this project, beyond functionality required for some of my other projects, really depends on there being some level of interest in the community.  If you want things to happen, please [watch](https://github.com/chrisdew/barricane-db/toggle_watch) this project on [GitHub](https://github.com/chrisdew/barricane-db) and subscribe to the [Google Group](https://groups.google.com/group/barricane-db).
// * Some of the features I'd like to add include:
// # Change the DB to an emitter and make the open async.
// # Create a subscribe facility so that webclient-proxy objects can be notified on changes to objects which are displayed on user's browsers.
// # Create a more efficient delta-codec which only logs the changed fields of registered instances.
// # Add ACID transactions.
// * Anything you'd like to add? - Create an issue on GitHub.

// This file is the entry point for the NPM barricane-db package. 
// It only exports symbols required from other modules.

var bdb = require('./db');
exports.DB = bdb.DB;