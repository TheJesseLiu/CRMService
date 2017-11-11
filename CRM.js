const AddressBO = require('./modules/AddressBO');
const PersonBO = require('./modules/PersonBO');
const CompanyBO = require('./modules/CompanyBO');
const ContactBO = require('./modules/ContactBO');


exports.createCompany = function(createCompanyReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateCompanyReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		createCompanyReq = JSON.parse(createCompanyReq);
		createAddressTask(createCompanyReq)
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


function createAddressTask(createCompanyReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateCompanyReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		AddressBO.create(createCompanyReq.address)
			.then(
				function(result){
					console.log(result);
					createCompanyReq.person["address_url"] = result;
					resolve(createCompanyReq);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}

function createPersonTask(createCompanyReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateCompanyReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		PersonBO.create(createCompanyReq.person)
			.then(
				function(result){
					console.log(result);
					createCompanyReq.contact["person_url"] = result;
					resolve(createCompanyReq);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}
function createCompanyTask(createCompanyReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateCompanyReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		CompanyBO.create(createCompanyReq.company)
			.then(
				function(result){
					console.log(result);
					createCompanyReq.contact["company_id"] = result;
					resolve(createCompanyReq);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}

function createContactTask(createCompanyReq) {
	return new Promise(function(resolve, reject){
		// var preconditionSuccess = validateCreateCompanyReq();
		// if(!preconditionSuccess){
		// 	Promise.reject("Precondition Fail");
		// }
		ContactBO.create(createCompanyReq.contact)
			.then(
				function(result){
					console.log(result);
					createCompanyReq.contact["contact_id"] = result;
					resolve(createCompanyReq);
				},
				function(error){
					console.log(error);
					reject(error);
				}
			);
	});
}
function validateCreateCompanyReq(){
	return true;
}


