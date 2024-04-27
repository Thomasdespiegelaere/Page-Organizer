import { Db } from "./modules/db.mjs";
import { pageType } from "./helpers/pagetype.js";

const db = Db.getInstance();
window.addEventListener("load", async () => {   
    var grid = document.querySelector('.card-grid');
    
    db.getAllCourses().then(folders => {
        folders.forEach(folder => {
            var card = createCard(folder.Name);
            grid.appendChild(card);
        });
    });
});

function createCard(title) {
    var grid = document.querySelector('.card-grid');
    const card = document.createElement('div');
    card.className = 'card blue-grey darken-1';
    card.style.cursor = 'pointer';

    switch (title) {
        case 'cursus':
            card.addEventListener('click', async () => {                
                var course = document.getElementById('hiddenCourseName').value;
                grid.innerHTML = '';
                var filterdImages = await db.getFilteredImages('Images', 'courseNames', course);
                filterdImages.forEach(image => {        
                    if (image.type === pageType.Cursus)
                    {
                        var card = document.createElement('img');
                        card.src = 'data:image/jpeg;base64,' + btoa(image.data);
                        grid.appendChild(card);
                    }                                
                });
            });
            break;
        case 'kladbladen':
            card.addEventListener('click', async () => {
                var course = document.getElementById('hiddenCourseName').value;
                grid.innerHTML = '';
                var filterdImages = await db.getFilteredImages('Images', 'courseNames', course);
                filterdImages.forEach(image => {
                    if (image.type === pageType.Kladblad) {
                        var card = document.createElement('img');
                        card.src = 'data:image/jpeg;base64,' + btoa(image.data);
                        grid.appendChild(card);
                    }
                });
            });
            break;
        default:
            card.addEventListener('click', () => {
                grid.innerHTML = '';
                grid.appendChild(createCard('cursus'));
                grid.appendChild(createCard('kladbladen'));
                var hiddenCourseName = document.createElement('input');
                hiddenCourseName.type = 'hidden';   
                hiddenCourseName.value = title;
                hiddenCourseName.id = 'hiddenCourseName';
                grid.appendChild(hiddenCourseName);
            });
            break;
    }    

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content white-text';

    const cardTitle = document.createElement('span');
    cardTitle.className = 'card-title';
    cardTitle.textContent = title; 

    cardContent.appendChild(cardTitle);

    card.appendChild(cardContent);

    return card;
}