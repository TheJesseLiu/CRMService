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
		    		resolve(body.url);
		    	}
		    }
		);
    });
};

exports.getByUrl = function(person_url) {
    return new Promise(function(resolve, reject) {
		request.get(
		    person_url,
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
function createID(email){
    let hash = 5381;
    for (i = 0; i < email.length; i++) {
        let char = email.charCodeAt(i);
        hash = Math.abs(((hash << 5) + hash) + char); /* hash * 33 + c */
    }
    return hash.toString();
}

exports.update = function(person) {
    return new Promise(function(resolve, reject) {
    	console.log("here is person");
        console.log(person);
        console.log("person end");
		request.put(
		    "http://personservice-env.qyspwjiw5j.us-east-1.elasticbeanstalk.com/person/"+createID(person.email),
		    {json: person},
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



