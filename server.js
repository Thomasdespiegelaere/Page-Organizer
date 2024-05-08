var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = new Datastore();
var webpush = require('web-push');

const vapidKeys = {
    publicKey: "BB757PmYD3aPowj19csNSjH6akjspyueJryyZJjZwVhn3xkl0NmQBuAQMExEKibOB_p_EicDiBb-jQZMZcU39Xk",
    privateKey: "Az33_EvD7g2AEuQk8wMikH2RXFFrdGH_oLTteEjQ9TE"
};

webpush.setVapidDetails(
    'mailto:ruben.buysschaert@vives.be',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.use(express.static('public'));

app.use(express.json());

app.post("/api/save-subscription/", function(request, response){
    console.log("POST info arrived...");
    console.log(request.body);

    if(!request.body || !request.body.endpoint){        
        response.status(400);
        response.setHeader('Content-type','application/json');
        response.send(JSON.stringify({
            error: {
                id: 'no endpoint',
                message: 'Subscription must have an endpoint.'
            }
        }));
    }
    else
    {        
        saveSubscriptionToDatabase(request.body)
        .then(function(subscriptionId) {
            console.log("Saved _id: ", subscriptionId);
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({ data: { success: true } }));
        })
        .catch(function(err) {
            console.log(err);
            response.status(500);
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({
                error: {
                            id: 'unable-to-save-subscription',
                            message: 'The subscription was received but we were unable to save it to our database.'
                        }
            }));
        });
    }
});

app.post("/api/trigger-push-message/", function(request, response){
    console.log("Trigger push at backend received...");
    console.log(request.body);    

    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({ data: { success: true } }));

    db.find({}, function (err, subscriptions) {
        console.log(subscriptions);

        if(err)
            console.log("Error during searching in NeDB: ", err);
        else
        {            
            for (let i = 0; i < subscriptions.length; i++) 
                triggerPushMessage(subscriptions[i], request.body.message);
        }
    });
});

function saveSubscriptionToDatabase(subscription)
{
    return new Promise(function(resolve, reject) {        
        db.insert(subscription, function(err, newDoc) {
            if (err)
                reject(err);
            else
                resolve(newDoc._id);
        });
    });
}

function triggerPushMessage(subscription, dataToSend)
{
    return webpush.sendNotification(subscription, dataToSend)
        .catch((err) => {
            if (err.statusCode === 404 || err.statusCode === 410) 
            {
                console.log('Subscription has expired or is no longer valid: ', err);
                
                db.remove({_id: subscription._id},{}, function(){
                    console.log("Subscription removed with _id: ", subscription._id);
                });
            }
            else
            {
                throw err;
            }
        });
}

app.listen(3000);

console.log("Express-server gestart op http://localhost:3000");