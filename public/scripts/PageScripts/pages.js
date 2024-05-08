import { Db } from "../modules/db.mjs";
import { getPageType, pageType } from "../helpers/pagetype.js";
const db = Db.getInstance();

window.addEventListener("load", async () => {
    var backArrow = document.getElementById('arrow_back');    
    var grid = document.querySelector('.card-grid');
    var searchPage = document.getElementById('searchPage');
    var searchTags = document.getElementById('searchTags');
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const course = urlParams.get('course');
    const type = urlParams.get('type');
    backArrow.setAttribute('href', 'http://localhost:3000/pages/typeselection.html?course=' + course);

    document.getElementById('searchForm').addEventListener('submit', async () => {
        event.preventDefault();
        if (searchPage.value === '' && searchTags.value === '')
        {
            grid.innerHTML = '';
            createPageContent(type, course, grid);
            return;
        }
        grid.innerHTML = '';        
        var filterdImages = await db.getFilteredImages('Images', 'courseNames', course);
        filterdImages.forEach(image => {            
            if (image.type == getPageType(type)) {                         
                if (image.page == Number(searchPage.value) || filtertags(image, searchTags.value)) {
                    createCard(grid, image);
                }
            }
        });
    });

    createPageContent(type, course, grid);
});

async function createPageContent(type, course, grid){
    switch (type) {
        case 'cursus':
            var filterdImages = await db.getFilteredImages('Images', 'courseNames', course);
            filterdImages.forEach(image => {
                if (image.type === pageType.Cursus) {
                    createCard(grid, image);
                }
            });
            break;
        case 'kladbladen':
            var filterdImages = await db.getFilteredImages('Images', 'courseNames', course);
            filterdImages.forEach(image => {
                if (image.type === pageType.Kladblad) {
                    createCard(grid, image);
                }
            });
            break;
        default:
            break;
    }
}

function createCard(grid, image) {    
    var card = document.createElement('div');
    card.className = 'card';

    var img = document.createElement('img');
    img.src = 'data:image/jpeg;base64,' + btoa(image.data);
    img.addEventListener('click', () => {
        img.requestFullscreen();
    });

    var p = document.createElement('p');
    p.textContent = "Pagina: " + image.page + " Tags: " + image.tags;

    card.appendChild(img);
    card.appendChild(p);

    grid.appendChild(card);
}

function filtertags(image, searchTags){
    var isFound = false;
    image.tags.forEach(tag => {        
        if (tag.toLowerCase() == searchTags.toLowerCase())
            isFound = true;  
    });
    return isFound;
}