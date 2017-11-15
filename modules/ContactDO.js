var AWS = require("aws-sdk");
var CONTACT_URL = process.env.CONTACT_URL;
const querySet = {"title":true, "company_id":true, "startKey_id":true, "limit":true};
function addHateoas(item){
    item["links"] = [
        {"rel":"self", "href":CONTACT_URL+'/'+item.contact_id},

        //modi
        {"rel":"company", "href":CONTACT_URL+'/'+item.contact_id+"/company"}
    ];
}
function processQuery(query, params){
    if(query.startKey_id!== undefined){
        params['ExclusiveStartKey'] = {contact_id:query.startKey_id};
        delete query["startKey_id"]; 
    }
    if(query.limit!== undefined){
        params['Limit'] = query.limit;
        delete query["limit"];
    }

    Object.keys(query).forEach(function(key) {
        if(querySet[key]!==true){
            delete query[key]; 
        }
        else{
            if(params['FilterExpression']===undefined)  params['FilterExpression'] = "";
            else params['FilterExpression']+=" AND ";
            params['FilterExpression']+= key+"=:"+key;
            if(params['ExpressionAttributeValues']===undefined) params['ExpressionAttributeValues'] ={};
            params['ExpressionAttributeValues'][':'+key] = query[key];          
        }
    }); 
    console.log(params);
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
        console.log(queryStringParameters);
        var ddb = new AWS.DynamoDB.DocumentClient();

        let params = {
            TableName : 'ContactTable',
            Limit: 5
        };
        let queryCopy = JSON.parse(JSON.stringify(queryStringParameters));
        processQuery(queryCopy, params);
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
                if(data.LastEvaluatedKey!==undefined){
                    let q = "";
                    delete queryStringParameters["startKey_id"]; 
                    for (var key in queryStringParameters) {
                        if (queryStringParameters.hasOwnProperty(key)) {
                            q=q+key+"="+queryStringParameters[key]+"&";
                        }
                    }
                    data["links"] = [
                        {"rel":"next", "href":CONTACT_URL+"?"+q+"startKey_id="+data.LastEvaluatedKey.contact_id}
                    ]
                }
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






