var request = require('request');
exports.create = function(address) {

    return new Promise(function(resolve, reject) {
        // address = JSON.stringify(address);
        console.log(address);
		request.post(
		    "http://addressservice-env.qyspwjiw5j.us-east-1.elasticbeanstalk.com/address",
		    { json: address},
		    function (error, response, body) {
		    	if(response.statusCode!=202){
		    		console.log(body);
		    		reject(body);
		    	}
		    	else{
		    		resolve(body.url);
		    	}
		    }
		);
    });
};

exports.getByUrl = function(address_url) {
    return new Promise(function(resolve, reject) {
		request.get(
		    address_url,
		    function (error, response, body) {
		    	if(response.statusCode!=200){
		    		console.log(body);
		    		reject(body);
		    	}
		    	else{
		    		resolve(JSON.parse(body).Item);
		    	}
		    }
		);
    });
};