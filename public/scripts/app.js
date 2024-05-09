window.addEventListener('load', function () {
    console.log("Loaded.");

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../../service-worker.js')
            .then((registration) => {
                console.log('Registered: ');
                console.log(registration);
            })
            .catch((err) => console.log(err));
    }
    else {
        alert('No service worker support in this browser.');
    }

    if ('PushManager' in window)
        console.log("Pushing possible.")
});

window.addEventListener('load', function () {    
    if (!("Notification" in window))
        console.log("Notifications are not supported in this browser.");
    else {        
        if (Notification.permission == "granted") {
            console.log("Permission granted before.");
        }
        else
            if (Notification.permission !== "denied") {                
                Notification.requestPermission()
                    .then(permission => {
                        if (permission === "granted") {
                            console.log("Permission granted.");
                        }
                    });
            }
            else {
                console.log("Permission denied befor. No notifications will be send.");
            }
    }

    navigator.serviceWorker.getRegistration()
        .then(registration => {
            registration.pushManager.getSubscription()
                .then(subscription => {
                    if (subscription) {
                        console.log("Existing subscription: ", JSON.stringify(subscription));                                             
                    } else {                        
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: "BDt2wFhIreQupXUeE-SmeHNjXOGR-tPU8nweBvPV7fl2bvHneTRlSXXxFMwHByKskHCk-WOARxz0Yh4cYTvMnqA"
                        })
                            .then(newSubscription => {
                                console.log("New subscription: ", JSON.stringify(newSubscription));
                                sendSubscriptionToServer(newSubscription); 
                            })
                            .catch(error => console.log("Error subscribing: ", error));
                    }
                })
                .catch(error => console.log("Error getting subscription: ", error));
        })
        .catch(error => console.log("Error getting registration: ", error));

    function sendSubscriptionToServer(subscription) {
        const options = {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(subscription)
        };

        fetch("api/save-subscription", options)
            .then(response => response.json())
            .then(data => {
                console.log("Server response: ", data);
            })
            .catch(error => console.log("Error sending subscription to server: ", error));
    }
});