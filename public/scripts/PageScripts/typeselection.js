window.addEventListener("load", async () => {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const course = urlParams.get('course'); 
    var grid = document.querySelector('.card-grid');
    grid.appendChild(createCard('cursus', course));
    grid.appendChild(createCard('kladbladen', course));
});

function createCard(title, course) {
    const card = document.createElement('div');
    card.className = 'card blue-grey darken-1'; 

    const cardContent = document.createElement('div');
    cardContent.className = 'card-content white-text';

    const cardTitle = document.createElement('span');
    cardTitle.className = 'card-title';
    cardTitle.textContent = title;

    cardContent.appendChild(cardTitle);

    card.appendChild(cardContent);

    card.addEventListener('click', () => {
        window.location.href = `http://localhost:3000/pages/pages.html?course=${course}&type=${title}`;
    });

    return card;
}