"use strict";
var CRM = require('./CRM');

const collectionHandlers = {
    "GET": getAllContacts,
    "POST": createContact,
}

const itemHandlers = {
    "DELETE": deleteContact,
    "GET": getContact,
    "PUT": updateContact,
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


function createContact(event, context, callback) {
	CRM.createContact(event.body).then(
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


function getAllContacts(event, context, callback) {
	CRM.getAllContacts(event["queryStringParameters"]).then(
	    function (result) {
			const response = {
				statusCode: 200,
				headers: {
			  		"Access-Control-Allow-Origin" : "*",
			  		"Access-Control-Allow-Credentials" : true
				},
				body: JSON.stringify(result)
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

function getContact(event, context, callback) {
	CRM.getContact(event["queryStringParameters"]).then(
	    function (result) {
			const response = {
				statusCode: 200,
				headers: {
			  		"Access-Control-Allow-Origin" : "*",
			  		"Access-Control-Allow-Credentials" : true
				},
				body: JSON.stringify(result)
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




