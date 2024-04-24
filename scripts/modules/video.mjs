export class Video {

    initVideo(video, canvas, width, height, streaming, startbutton) {       
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
    }

    takepicture() {
        const context = canvas.getContext("2d");
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL("image/png");
            console.log("picture", data);

            var blob = dataURLtoBlob(data);

            console.log("blob", blob);

            var reader = new FileReader();
            reader.readAsBinaryString(blob);

            reader.onload = function (e) {
                let bits = e.target.result;
                let imageObject = {
                    created: new Date(),
                    data: bits
                };
                console.log("ob", imageObject);
                db.setImage(imageObject);
            }
            photo.setAttribute("src", data);
        } else {
            clearphoto();
        }
    }

    // showViewLiveResultButton() {
    //     if (window.self !== window.top) {
    //         document.querySelector(".contentarea").remove();
    //         const button = document.createElement("button");
    //         button.textContent = "View live result of the example code above";
    //         document.body.append(button);
    //         button.addEventListener("click", () => window.open(location.href));
    //         return true;
    //     }
    //     return false;
    // }

    clearphoto() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
    }

    dataURLtoBlob(dataURL) {
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
}