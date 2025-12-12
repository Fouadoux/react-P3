import { getData } from './api.js';
import { isAuthenticated, logout } from './auth.js';

async function afficherProjet(categoryFilter = 'Tous') {
    const projets = await getData();
    const container = document.querySelector('.gallery');
    
    container.innerHTML = '';
    
    projets.forEach(projet => {
        if (categoryFilter === 'Tous' || projet.category.name === categoryFilter) {
            const projetFigure = document.createElement('figure');
            
            const img = document.createElement('img');
            img.src = projet.imageUrl;
            img.alt = projet.title;
            
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = projet.title;
            
            projetFigure.appendChild(img);
            projetFigure.appendChild(figcaption);
            container.appendChild(projetFigure);
        }
    });
}

async function creerFiltres() {
    const projets = await getData();
    const categories = new Set();
    
    projets.forEach(projet => {
        categories.add(projet.category.name);
    });
    
    const filtersContainer = document.getElementById('filters');
    
    const btnTous = document.createElement('button');
    btnTous.textContent = 'Tous';
    btnTous.className = 'filter-btn active';
    btnTous.addEventListener('click', () => {
        afficherProjet('Tous');
        setActiveButton(btnTous);
    });
    filtersContainer.appendChild(btnTous);
    
    categories.forEach(categoryName => {
        const btn = document.createElement('button');
        btn.textContent = categoryName;
        btn.className = 'filter-btn';
        btn.addEventListener('click', () => {
            afficherProjet(categoryName);
            setActiveButton(btn);
        });
        filtersContainer.appendChild(btn);
    });
}

function setActiveButton(activeBtn) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function updateAuthButton(){
    const authLink = document.getElementById('auth-button');

    if(isAuthenticated()){
        authLink.textContent='Logout';
        authLink.href='#';

        authLink.addEventListener('click',(e)=>{    
            e.preventDefault(); 
            logout();
        })
    }else{
        authLink.textContent='Login';
        authLink.href='login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    afficherProjet('Tous');
    creerFiltres();
    updateAuthButton();
});