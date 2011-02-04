// Copyright (c) 2010 Barricane Technology Ltd., All Rights Reserved.
// Released under the MIT open source licence.

// This file is the entry point for the NPM barricane-db package. 
// It only exports symbols required from other modules.

var db_mod = require('./db');
var disk_io_mod = require('./disk-io');
exports.DB = db_mod.DB;