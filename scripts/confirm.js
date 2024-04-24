import { Db } from "./modules/db.mjs";
var db = Db.getInstance();

window.addEventListener("load", () => {
    console.log("loaded");

    db.getLastImage('tempImages').then((image) => {
        console.log("image", image);
        document.getElementById("hiddenId").value = image.id;
        document.getElementById("photo").src = 'data:image/jpeg;base64,' + btoa(image.data);
    });

    document.getElementById("save").addEventListener("click", () => {
        var page = document.getElementById("pageNumber").value;
        var tags = document.getElementById("tags").value;
        tags = tags.split(",");
        var courseName = document.getElementById("courseName").value;
        var type = document.getElementById("type").value;
        var imageId = document.getElementById("hiddenId").value;
        console.log("saving:", page, tags, courseName, type, imageId);

        db.getImage('tempImages', Number(imageId)).then((image) => {
            console.log("image:", image);
            let imageObject = {
                created: new Date(),
                data: image.data,
                page: Number(page),
                tags: tags,
                courseName: courseName,
                type: Number(type)
            };   
            db.setImage("Images", imageObject);       
            window.location = "http://127.0.0.1:5500/Project-Web-Apps/Page-Organizer/";  
        });
    });
});