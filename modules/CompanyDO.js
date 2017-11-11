var AWS = require("aws-sdk");


exports.create = function(company) {
    return new Promise(function(resolve, reject) {
        var ddb = new AWS.DynamoDB.DocumentClient();
        company["company_id"] = createID(company.company_name);

        let params = {
            TableName : 'CompanyTable',
            Item: company,
            //'ConditionExpression':'attribute_not_exists(company_id)',
        };
        ddb.put(params, function(err, data) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(company["company_id"]);
            }
        });
    });
};

function createID(company_name){
    let hash = 5381;
    for (i = 0; i < company_name.length; i++) {
        let char = company_name.charCodeAt(i);
        hash = Math.abs(((hash << 5) + hash) + char); /* hash * 33 + c */
    }
    return hash.toString();
}


