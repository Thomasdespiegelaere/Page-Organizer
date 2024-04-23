import { Db } from "./db.mjs";
var db = Db.getInstance();

window.addEventListener("load", () => {
    console.log("loaded");

    db.getLastImage('tempImages').then((image) => {
        console.log("image", image);
        document.getElementById("photo").src = 'data:image/jpeg;base64,' + btoa(image.data);
    });
});

function savepicture() {
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
            db.setImage(imageObject);
        }
        photo.setAttribute("src", data);
    } else {
        clearphoto();
    }
}