export class Video {
    constructor(video) {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                console.log(devices);
                var deviceIds = [];
                var deviceId;
                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].kind == "videoinput") {
                        deviceIds.push(devices[i]);

                    }
                }

                deviceIds.forEach(element => {
                    if (element.label.includes("back")) {
                        deviceId = element.deviceId;
                    }
                });

                if (deviceId == undefined) {
                    deviceId = deviceIds[0].deviceId;
                }
                console.log("Single option: ", deviceId);

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
    }

    clearphoto(canvas) {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
    }

    takepicture(canvas, video, width, height, db, pageType) {
        const context = canvas.getContext("2d");
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL("image/png");
            var blob = this.dataURLtoBlob(data);
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
            this.clearphoto();
        }
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