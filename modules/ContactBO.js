var ContactDO = require('./ContactDO');

exports.create = function(contact) {

    return new Promise(function(resolve, reject) {
        console.log(contact);
        let preconditionSuccess = false;

        if (contact.company_id){
            preconditionSuccess = true;
        }

        if (preconditionSuccess) {
            ContactDO.create(contact).then(
                function(result) {
                	console.log(result);
                    resolve(result);
                },
                function(error) {
                    reject(error);
                }
            );
        }
        else {
            console.log("company_id in contact cannot be empty");
            reject("company_id in contact cannot be empty");
        }

    });
};

exports.getAll = function(queryStringParameters){
    return new Promise(function(resolve, reject) {
        ContactDO.getAll(queryStringParameters).then(
            function(result) {
                // console.log(result);
                resolve(result);
            },
            function(error) {
                reject(error);
            }
        );
    });    
}