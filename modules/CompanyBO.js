var CompanyDO = require('./CompanyDO');

exports.create = function(company) {

    return new Promise(function(resolve, reject) {
        console.log(company);
        let preconditionSuccess = false;

        if (company["company_name"]){
            preconditionSuccess = true;
        }

        if (preconditionSuccess) {
            CompanyDO.create(company).then(
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
            console.log("company_name cannot be empty");
            reject("company_name cannot be empty");
        }

    });
};

exports.getByID = function(company_id) {
    return new Promise(function(resolve, reject) {
        CompanyDO.getByID(company_id).then(
            function(result) {
                // console.log(result); 
                resolve(result);
            },
            function(error) {
                resolve(error);
            }
        );
    });
};

