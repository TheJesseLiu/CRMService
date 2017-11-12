var AWS = require("aws-sdk");
var CONTACT_URL = process.env.CONTACT_URL;

function addHateoas(item){
    item["links"] = [
        {"rel":"self", "href":CONTACT_URL+'/'+item.contact_id},

        //modi
        {"rel":"company", "href":CONTACT_URL+'/'+item.contact_id+"/company"}
    ];
}
exports.create = function(contact) {
    return new Promise(function(resolve, reject) {
        var ddb = new AWS.DynamoDB.DocumentClient();
        contact["contact_id"] = createID(contact.person_url);

        let params = {
            TableName : 'ContactTable',
            Item: contact,
            'ConditionExpression':'attribute_not_exists(contact_id)',
        };
        ddb.put(params, function(err, data) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(contact["contact_id"]);
            }
        });
    });
};

function createID(person_url){
    let hash = 5381;
    for (let i = 0; i < person_url.length; i++) {
        let char = person_url.charCodeAt(i);
        hash = Math.abs(((hash << 5) + hash) + char); /* hash * 33 + c */
    }
    return hash.toString();
}

exports.getAll = function(queryStringParameters) {
    return new Promise(function(resolve, reject) {
        var ddb = new AWS.DynamoDB.DocumentClient();

        let params = {
            TableName : 'ContactTable',
            // Limit: 20
        };
        ddb.scan(params, function(err, data) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
            // adding HATEOAS format
                for(let i=0; i<data.Items.length; i++){
                    addHateoas(data.Items[i]);  
                }
                // if(data.LastEvaluatedKey!==undefined){
                //     q = req.originalUrl.split("?")[1]===undefined? "":req.originalUrl.split("?")[1]+"&";
                //     data["links"] = [
                //         {"rel":"next", "href":CONTACT_URL+"?"+q+"startKey_id="+data.LastEvaluatedKey.person_id}
                //     ]
                // }
                resolve(data);
            }
        });
    });
};




