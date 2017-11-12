const AddressBO = require('./modules/AddressBO');
const PersonBO = require('./modules/PersonBO');
const CompanyBO = require('./modules/CompanyBO');
const ContactBO = require('./modules/ContactBO');


exports.createContact = function(createContactReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateContactReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		createContactReq = JSON.parse(createContactReq);
		createAddressTask(createContactReq)
			.then(createPersonTask, (error) =>{reject(error)})
			.then(createCompanyTask,(error) =>{reject(error)})
			.then(createContactTask,(error) =>{reject(error)})
			.then(
				function(result){
					console.log(result);
					resolve(result);
				},
				function(error){
					console.log(error);
					reject(error);
				}				
			);
	});

};

function createAddressTask(createContactReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateContactReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		AddressBO.create(createContactReq.address)
			.then(
				function(result){
					console.log(result);
					createContactReq.person["address_url"] = result;
					resolve(createContactReq);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}

function createPersonTask(createContactReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateContactReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		PersonBO.create(createContactReq.person)
			.then(
				function(result){
					console.log(result);
					createContactReq.contact["person_url"] = result;
					resolve(createContactReq);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}
function createCompanyTask(createContactReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateContactReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		CompanyBO.create(createContactReq.company)
			.then(
				function(result){
					console.log(result);
					createContactReq.contact["company_id"] = result;
					resolve(createContactReq);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}

function createContactTask(createContactReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateContactReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		ContactBO.create(createContactReq.contact)
			.then(
				function(result){
					console.log(result);
					createContactReq.contact["contact_id"] = result;
					resolve(createContactReq);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}



exports.getAllContacts = function(queryStringParameters) {
	return new Promise(function(resolve, reject){
		getAllContactsTask(queryStringParameters)
			.then(
				(result)=>{
					console.log(result);
					let promises = [];
					for(let i=0; i<result.Items.length; i++){
						promises.push(tryTask(result.Items[i]));
					}
					Promise.all(promises).then(function() {
						console.log(result);
					    resolve(result);
					});					
				},
				(error)=>{
					reject(error);
				}				
			);
			// .then(getCompaniesOfContactsTask, (error) =>{reject(error)})
			// .then(getPersonOfContactsTask, (error) =>{reject(error)})
			// .then(getAddressesOfContactsTask, (error) =>{reject(error)})
			// .then(
			// 	function(result){
			// 		console.log(result);
			// 		resolve(result);
			// 	},
			// 	function(error){
			// 		console.log(error);
			// 		reject(error);
			// 	}				
			// );
	});

};

function getAllContactsTask(queryStringParameters) {
	return new Promise(function(resolve, reject){
		ContactBO.getAll()
			.then(
				function(result){
					// console.log(result);
					resolve(result);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}



// function getCompaniesOfContactsTask(contacts) {
// 	let promises = [];
// 	return new Promise(function(resolve, reject){
// 		for(let i=0; i<contacts.Items.length; i++){
// 			promises.push(CompanyBO.getByID(contacts.Items[i].company_id));
// 		}
// 		Promise.all(promises).then(function() {
// 		    for(let i=0; i<contacts.Items.length; i++){
// 		    	promises[i].then(
// 		    		(result)=>{contacts.Items[i]["company"] =result;} 
// 		    	);
// 		    }
// 		    resolve(contacts);
// 		});
// 	});
// }
// function getPersonOfContactsTask(contacts) {
// 	let promises = [];
// 	return new Promise(function(resolve, reject){
// 		for(let i=0; i<contacts.Items.length; i++){
// 			promises.push(PersonBO.getByUrl(contacts.Items[i].person_url));
// 		}
// 		Promise.all(promises).then(function() {
// 		    for(let i=0; i<contacts.Items.length; i++){
// 		    	promises[i].then(
// 		    		(result)=>{contacts.Items[i]["person"] =result;} 
// 		    	);
// 		    }
// 		    resolve(contacts);
// 		});
// 	});
// }

// function getAddressesOfContactsTask(contacts) {
// 	let promises = [];
// 	return new Promise(function(resolve, reject){
// 		for(let i=0; i<contacts.Items.length; i++){
// 			promises.push(AddressBO.getByUrl(contacts.Items[i].person.address_url));
// 		}
// 		Promise.all(promises).then(function() {
// 		    for(let i=0; i<contacts.Items.length; i++){
// 		    	promises[i].then(
// 		    		(result)=>{contacts.Items[i]["address"] =result;} 
// 		    	);
// 		    }
// 		    resolve(contacts);
// 		});
// 	});
// }

function tryTask(contact) {
	return new Promise(function(resolve, reject){
		getCompanyOfContactTask(contact)
			.then(getPersonOfContactTask, (error) =>{reject(error)})
			.then(getAddressOfContactTask, (error) =>{reject(error)})
			.then(
				function(result){
					resolve(contact);
				},
				function(error){
					console.log(error);
					reject(error);
				}				
			);			
	});
}


exports.getContact = function(event) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateContactReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		getContactTask(event)
			.then(getCompanyOfContactTask, (error) =>{reject(error)})
			.then(getPersonOfContactTask, (error) =>{reject(error)})
			.then(getAddressOfContactTask, (error) =>{reject(error)})
			.then(
				function(result){
					console.log(result);
					resolve(result);
				},
				function(error){
					console.log(error);
					reject(error);
				}				
			);
	});

};

function getContactTask	(event) {
	return new Promise(function(resolve, reject){
		ContactBO.getByID(event["pathParameters"].id)
			.then(
				function(result){
					// console.log(result);
					resolve(result);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}

function getCompanyOfContactTask(contact) {
	return new Promise(function(resolve, reject){
		CompanyBO.getByID(contact.company_id)
			.then(
				function(result){
					contact["company"] = result;
					resolve(contact);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}


function getPersonOfContactTask(contact) {
	return new Promise(function(resolve, reject){
		PersonBO.getByUrl(contact.person_url)
			.then(
				function(result){
					contact["person"] =result;
					resolve(contact);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}


function getAddressOfContactTask(contact) {
	return new Promise(function(resolve, reject){
		AddressBO.getByUrl(contact.person.address_url)
			.then(
				function(result){
					console.log(result);
					contact["address"] =result;
					resolve(contact);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}





