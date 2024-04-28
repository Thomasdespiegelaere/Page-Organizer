import { Db } from "./modules/db.mjs";
import { pageType } from "./helpers/pagetype.js";
const db = Db.getInstance();

window.addEventListener("load", async () => {
    var backArrow = document.getElementById('arrow_back');    
    var grid = document.querySelector('.card-grid');
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const course = urlParams.get('course');
    const type = urlParams.get('type');
    backArrow.setAttribute('href', 'http://127.0.0.1:5500/Project-Web-Apps/Page-Organizer/pages/typeselection.html?course=' + course);

    switch (type) {
        case 'cursus':             
                var filterdImages = await db.getFilteredImages('Images', 'courseNames', course);
                filterdImages.forEach(image => {        
                    if (image.type === pageType.Cursus)
                    {
                        var card = document.createElement('img');
                        card.src = 'data:image/jpeg;base64,' + btoa(image.data);
                        grid.appendChild(card);
                    }                                
                });
            break;
        case 'kladbladen':
                var filterdImages = await db.getFilteredImages('Images', 'courseNames', course);
                filterdImages.forEach(image => {
                    if (image.type === pageType.Kladblad) {
                        var card = document.createElement('img');
                        card.src = 'data:image/jpeg;base64,' + btoa(image.data);
                        grid.appendChild(card);
                    }
                });
            break;
        default:
            break;
        }
});