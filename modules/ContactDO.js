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

exports.getByID = function(contact_id) {
    return new Promise(function(resolve, reject){
        let ddb = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName:'ContactTable',
            Key:{
                contact_id: contact_id
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



exports.deleteByID = function(contact_id) {
    return new Promise(function(resolve, reject){
        let ddb = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName:'ContactTable',
            Key:{
                contact_id: contact_id
            }
        };
        ddb.delete(params, function(err, data) {
            if (err) {
                console.log(err);
                reject(JSON.stringify({"error message":"400 Bad Request or the contact_id should be number"}));
            }
            else {
                resolve(contact_id+" has been deleted.");
            }
        });
    });
};


exports.updateByID = function(contact) {
    return new Promise(function(resolve, reject){
        console.log(contact);
        let ddb = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName:'ContactTable',
            Key:{
                contact_id: contact.contact_id
            },
            UpdateExpression: "set title =:title, company_id =:company_id",
            ExpressionAttributeValues:{
                ":title" : contact.title,
                ":company_id" : contact.company_id
            }            
        };
        ddb.update(params, function(err, data) {
            if (err) {
                console.log(err);
                reject(JSON.stringify({"error message":"400 Bad Request or the contact_id should be number"}));
            }
            else {
                resolve(contact.contact_id+" has been updated.");
            }
        });
    });
};






