var vows = require('vows')
  , assert = require('assert')
  , pre = require('barricane-prevalent')
  ;

var p = new pre.Prevalent("/tmp/");
//p.registerConstructors(Bank, Customer, Account);

function Bank(name, sort_code) {
	this.name = name;
	this.sort_code = sort_code;
	p.register(this);
}
function Customer(personal_name, family_name) {
	this.personal_name = personal_name;
	this.family_name = family_name;
	p.register(this);
}
function Account(bank, customer, balance) {
	this.bank = bank;
	this.customer = customer;
	this.balance = balance;
	p.register(this);
}

var lloyds = new Bank('lloyds');
var barclays = new Bank('barclays');
var ben = new Customer('ben', 'white');
var ginny = new Customer('ginny', 'green');
var ben_account = new Account(lloyds, ben, 100);
var ginny_lloyds_account = new Account(lloyds, ginny, 10);
var ginny_barclays_account = new Account(barclays, ginny, 1000);

vows.describe('The First Test').addBatch({
    'Setting Up': { topic: p
	              , 'path is set': function(topic) {
						assert.equal(topic.path, "/tmp/"); 
					}
	              , 'constructors are registered': function(topic) {
	            	    assert.deepEqual(topic.constructors, 
	            	    	{ Bank: Bank
	            	        , Customer: Customer
	            	        , Account: Account
	            	        } );
					}
	              , 'serialisation_has_worked': function(topic) {
	            	    assert.deepEqual(topic.toJson(), 
	            	    	{} );
	                }
				  } 
}).export(module);
