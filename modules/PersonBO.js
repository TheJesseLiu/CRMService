var request = require('request');
exports.create = function(person) {

    return new Promise(function(resolve, reject) {
        console.log(person);
		request.post(
		    "http://personservice-env.qyspwjiw5j.us-east-1.elasticbeanstalk.com/person",
		    { json: person},
		    function (error, response, body) {
		    	if(response.statusCode!=202){
		    		console.log(body);
		    		reject(body);
		    	}
		    	else{
		    		resolve(body);
		    	}
		    }
		);
    });
};