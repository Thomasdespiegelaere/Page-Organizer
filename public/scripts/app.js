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
            registration.pushManager.subscribe(
                {
                    userVisibleOnly: true,
                    applicationServerKey: "BB757PmYD3aPowj19csNSjH6akjspyueJryyZJjZwVhn3xkl0NmQBuAQMExEKibOB_p_EicDiBb-jQZMZcU39Xk"
                }
            )
            .then(subscription => {
                console.log("Subscription: ");
                console.log(JSON.stringify(subscription));    

                var options = {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(subscription)
                };
                fetch("api/save-subscription", options)
                    .then(response => {
                        console.log("Response: ", response)
                        return response.json();
                    })
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => console.log("Error: ", error));
            })
            .catch(error => console.log(error));
    });
});