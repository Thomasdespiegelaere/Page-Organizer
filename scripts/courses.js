import { Db } from "./modules/db.mjs";

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
    const card = document.createElement('div');
    card.className = 'card blue-grey darken-1';

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content white-text';

    const cardTitle = document.createElement('span');
    cardTitle.className = 'card-title';
    cardTitle.textContent = title; 

    cardContent.appendChild(cardTitle);

    card.appendChild(cardContent);

    return card;
}