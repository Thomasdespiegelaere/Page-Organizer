import { Db } from '../modules/db.mjs';
import { pageType } from '../helpers/pagetype.js';
import { Video } from '../modules/video.mjs';
const width = 320;
let height = 0; 

let streaming = false;
let video = null;
let canvas = null;
let startbutton = null;
const db = Db.getInstance();

addEventListener("resize", (event) => { 
    document.getElementById("video").style.height = screen.height * 0.65 + "px";
    document.getElementById("video").style.width = screen.width + "px";
});

window.addEventListener("load", () => {    
    document.getElementById("video").style.height = screen.height * 0.65  + "px";
    document.getElementById("video").style.width = screen.width  + "px";
    if (showViewLiveResultButton()) {
        return;
    }
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    startbutton = document.getElementById("startbutton");

    var videoObject = new Video(video);

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
            videoObject.takepicture(canvas, video, width, height, db, pageType);
            ev.preventDefault();
        },
        false,
    );

    videoObject.clearphoto(canvas);    
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

