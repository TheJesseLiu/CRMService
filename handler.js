"use strict";
var CRM = require('./CRM');

const collectionHandlers = {
    "GET": getAllCompanies,
    "POST": createCompany,
}

const itemHandlers = {
    // "DELETE": deleteCompany,
    // "GET": getCompany,
    // "PUT": updateCompany,
}

module.exports.router = (event, context, callback) => {
	let handlers = (event["pathParameters"] == null) ? collectionHandlers : itemHandlers;
	let httpMethod = event["httpMethod"];
	if (httpMethod in handlers) {
		return handlers[httpMethod](event, context, callback);
	}
	const response = {
		statusCode: 405,
		headers: {
			"Access-Control-Allow-Origin" : "*",
			"Access-Control-Allow-Credentials" : true
		},
		body: JSON.stringify({
			message: `Invalid HTTP Method: ${httpMethod}`
		}),
	};
	callback(null, response);	
};


function createCompany(event, context, callback) {
	CRM.createCompany(event.body).then(
	    function (result) {
			const response = {
				statusCode: 202,
				headers: {
			  		"Access-Control-Allow-Origin" : "*",
			  		"Access-Control-Allow-Credentials" : true
				},
				body: JSON.stringify({ message: result })
			};
			callback(null, response);
	    },
	    function (error) {
			const response = {
				statusCode: 400,
				headers: {
					
			  		"Access-Control-Allow-Origin" : "*",
			  		"Access-Control-Allow-Credentials" : true
				},
				body: JSON.stringify({ message: error })
			};
			callback(null, response);
	    }		    	
	);
}


function getAllCompanies(event, context, callback) {
	const response = {
		statusCode: 200,
		headers: {
	  		"Access-Control-Allow-Origin" : "*",
	  		"Access-Control-Allow-Credentials" : true
			},
		body: JSON.stringify({ message: "getAllCompanies" })
	};

	callback(null, response);
}






