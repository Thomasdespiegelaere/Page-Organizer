import { Db } from "../modules/db.mjs";
var db = Db.getInstance();

window.addEventListener("load", () => {
    console.log("loaded");

    const courses = [];
    const inputField = document.getElementById("courseName");
    const suggestionsContainer = document.getElementById("autocomplete-suggestions");

    db.getAllCourses().then(folders => {
        folders.forEach(folder => {     
            courses.push(folder.Name);       

            inputField.addEventListener("input", function () {
                showSuggestions(this.value);
            });

            inputField.addEventListener("blur", function () {
                setTimeout(() => {
                    suggestionsContainer.innerHTML = "";
                }, 100);
            });
        });
    });       

    function showSuggestions(query) {
        suggestionsContainer.innerHTML = "";

        if (query.length > 0) {
            const filtered = courses.filter(fruit =>
                fruit.toLowerCase().startsWith(query.toLowerCase())
            );

            filtered.forEach(fruit => {
                const suggestion = document.createElement("li");
                suggestion.className = "autocomplete-suggestion";
                suggestion.textContent = fruit;
                suggestionsContainer.appendChild(suggestion);

                suggestion.addEventListener("click", function () {
                    inputField.value = fruit;
                    suggestionsContainer.innerHTML = "";
                });
            });
        }
    }

    db.getLastImage('tempImages').then((image) => {
        console.log("image", image);
        document.getElementById("hiddenId").value = image.id;
        document.getElementById("photo").src = 'data:image/jpeg;base64,' + btoa(image.data);
    });

    document.getElementById("save").addEventListener("click", () => {
        var page = document.getElementById("pageNumber").value;
        var tags = document.getElementById("tags").value;
        tags = tags.split(",").map(tag => tag.trim());
        var courseName = document.getElementById("courseName").value;
        var type = document.getElementById("type").value;
        var imageId = document.getElementById("hiddenId").value;
        console.log("saving:", page, tags, courseName, type, imageId);

        db.getImage('tempImages', Number(imageId)).then(async (image) => {
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
            if (await db.doesCourseExist(courseName) === false) {
                let courseObject = {
                    created: new Date(),
                    Name: courseName,
                };   
                db.setCourse(courseObject);
            }
            window.location = "http://localhost:3000/";  
        });
    });
});