var vows = require('vows')
  , assert = require('assert')
  , bdb = require('barricane-db')
  ;

// mock up uuids for testing
var nextMockUuid = 0;
function mockUuid() {
	return "" + nextMockUuid++;
}

var db = new bdb.DB(options={ uuid: mockUuid
		                    } );
//p.registerConstructors(Bank, Customer, Account);

function Bank(name, sort_code, contacts) {
	this.name = name;
	this.sort_code = sort_code;
	this.contacts = contacts;
	db.register(this);
}
function Customer(personal_name, family_name, dob) {
	this.personal_name = personal_name;
	this.family_name = family_name;
	this.dob = dob;
	db.register(this);
}
function Account(bank, customer, balance) {
	this.bank = bank;
	this.customer = customer;
	this.balance = balance;
	db.register(this);
}

var lloyds = new Bank('lloyds', "01-02-03");
lloyds.name = "LloydsTSB";
var barclays = new Bank('barclays', "02-03-04",
								   { tel: "02345 678901"
								   , email: "info@barclays.com"
								   } );
var ben_dob = new Date();
ben_dob.setTime(0);
ben_dob.setYear("2001");
ben_dob.setMonth("01");
ben_dob.setDate("01");
var ben = new Customer('ben', 'white', ben_dob);
var ginny = new Customer('ginny', 'green');
var ben_account = new Account(lloyds, ben, 100);
var ginny_lloyds_account = new Account(lloyds, ginny, 10);
var ginny_barclays_account = new Account(barclays, ginny, 1000);

vows.describe('The First Test').addBatch({
    'Setting Up': { topic: db
	              , 'constructors are registered': function(topic) {
	            	    assert.deepEqual(topic.constructors, 
	            	    	{ Bank: Bank
	            	        , Customer: Customer
	            	        , Account: Account
	            	        } );
					}
	              , 'serialisation_has_worked': function(topic) {
	            	    assert.deepEqual(topic.toJson(), 
	            	    		{
	            	        0: {
	            	            __constructor: 'Bank',
	            	            name: 'LloydsTSB',
	            	            sort_code: '01-02-03',
	            	            contacts: undefined,
	            	            __uuid: '0'
	            	        },
	            	        1: {
	            	            __constructor: 'Bank',
	            	            name: 'barclays',
	            	            sort_code: '02-03-04',
	            	            contacts: { tel: '02345 678901', email: 'info@barclays.com' },
	            	            __uuid: '1'
	            	        },
	            	        2: {
	            	            __constructor: 'Customer',
	            	            personal_name: 'ben',
	            	            family_name: 'white',
	            	            dob: '__DATE__980985600000',
	            	            __uuid: '2'
	            	        },
	            	        3: {
	            	            __constructor: 'Customer',
	            	            personal_name: 'ginny',
	            	            family_name: 'green',
	            	            dob: undefined,
	            	            __uuid: '3'
	            	        },
	            	        4: {
	            	            __constructor: 'Account',
	            	            bank: '__ID__0',
	            	            customer: '__ID__2',
	            	            balance: 100,
	            	            __uuid: '4'
	            	        },
	            	        5: {
	            	            __constructor: 'Account',
	            	            bank: '__ID__0',
	            	            customer: '__ID__3',
	            	            balance: 10,
	            	            __uuid: '5'
	            	        },
	            	        6: {
	            	            __constructor: 'Account',
	            	            bank: '__ID__1',
	            	            customer: '__ID__3',
	            	            balance: 1000,
	            	            __uuid: '6'
	            	        }
	            	    } );
	                }
				  } 
}).export(module);
