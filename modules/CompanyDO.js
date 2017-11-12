var AWS = require("aws-sdk");
var COMPANY_URL = process.env.COMPANY_URL;

function addHateoas(item){
    item["links"] = [
        {"rel":"self", "href":COMPANY_URL+'/'+item.company_id},
    ];
}

exports.create = function(company) {
    return new Promise(function(resolve, reject) {
        let ddb = new AWS.DynamoDB.DocumentClient();
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


exports.getByID = function(company_id) {
    return new Promise(function(resolve, reject){
        let ddb = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName:'CompanyTable',
            Key:{
                company_id: company_id
            }
        };
        ddb.get(params, function(err, data){
            if (err) {
                console.log(err, err.stack);
                reject(err);
            }
            else {
                if(data.length!=0){
                    addHateoas(data.Item);
                    // console.log(data.Item);
                    resolve(data.Item);
                }
            }
        });
    });
};




