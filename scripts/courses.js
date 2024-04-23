import { Db } from "./db.mjs";

const db = Db.getInstance();
window.addEventListener("load", async () => {    
    const courseList = document.getElementById("courselist");

    db.getAllImages().then(images => {
        images.forEach(image => {
            var img = document.createElement("img");
            img.src = 'data:image/jpeg;base64,' + btoa(image.data);
            courseList.appendChild(img);
        });
    });
});

function CreateFolders() {
    var folder = document.createElement("div");
}