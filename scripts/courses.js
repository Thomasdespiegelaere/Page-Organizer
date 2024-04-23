import { Db } from "./db.mjs";

const db = Db.getInstance();
window.addEventListener("load", async () => {    
    const courseList = document.getElementById("courselist");

    for (let index = 1; index < 3; index++) {
        var image = document.createElement("img");
        var record = await db.getImage(index);
        image.src = 'data:image/jpeg;base64,' + btoa(record.data);
        courseList.appendChild(image);
    }    
});