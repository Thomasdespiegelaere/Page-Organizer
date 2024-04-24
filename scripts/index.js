import { Db } from './modules/db.mjs';
const width = 320;
let height = 0; 
const pageType = {
    Kladblad: 1,
    Cursus: 2,
}

let streaming = false;
let video = null;
let canvas = null;
let photo = null;
let startbutton = null;
const db = Db.getInstance();

window.addEventListener("load", () => {    
    document.getElementById("video").style.height = screen.height + "px";
    document.getElementById("video").style.width = screen.width + "px";
    if (showViewLiveResultButton()) {
        return;
    }
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");

    var selector = document.querySelector("#selectMediaDevice");

    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            console.log(devices);

            // Alle devices in de selection tonen.    
            var option = document.createElement('option');
            option.textContent = "None";
            option.setAttribute('data-id', "None");
            selector.appendChild(option);
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].kind == "videoinput") {
                    option = document.createElement('option');
                    option.textContent = devices[i].label + " (" + devices[i].kind + ")";
                    option.setAttribute('data-id', devices[i].deviceId);
                    selector.appendChild(option);
                    console.log("Single option: ", option);
                }
            }

            var deviceId = selector.options[selector.selectedIndex].getAttribute("data-id");

            navigator.mediaDevices
                .getUserMedia({ video: { deviceId: deviceId } })
                .then((stream) => {
                    video.srcObject = stream;
                    video.play();
                })
                .catch((err) => {
                    console.error(`An error occurred: ${err}`);
                });
        })
        .catch(error => console.log(error));



    video.addEventListener(
        "canplay",
        (ev) => {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute("width", width);
                video.setAttribute("height", height);
                canvas.setAttribute("width", width);
                canvas.setAttribute("height", height);
                streaming = true;
            }
        },
        false,
    );

    startbutton.addEventListener(
        "click",
        (ev) => {
            takepicture();
            ev.preventDefault();
        },
        false,
    );

    clearphoto();    
});

function showViewLiveResultButton() {
    if (window.self !== window.top) {
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
    }
    return false;
}

function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    // photo.setAttribute("src", data);
}

function takepicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        const data = canvas.toDataURL("image/png");
        var blob = dataURLtoBlob(data);        
        var reader = new FileReader();
        reader.readAsBinaryString(blob);

        reader.onload = function (e) {
            let bits = e.target.result;
            let imageObject = {
                created: new Date(),
                data: bits,
                page: 3,
                tags: ['tag1', 'tag2'],
                courseName: "Wiskunde",
                type: pageType.Kladblad
            };
            console.log("ob", imageObject);
            db.setImage('tempImages', imageObject);
        }
        window.location = "http://127.0.0.1:5500/Project-Web-Apps/Page-Organizer/pages/confirm.html";        
    } else {
        clearphoto();
    }
}

function dataURLtoBlob(dataURL) {
    var arr = dataURL.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}