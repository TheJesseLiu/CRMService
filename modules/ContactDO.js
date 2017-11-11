var AWS = require("aws-sdk");


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
    for (i = 0; i < person_url.length; i++) {
        let char = person_url.charCodeAt(i);
        hash = Math.abs(((hash << 5) + hash) + char); /* hash * 33 + c */
    }
    return hash.toString();
}