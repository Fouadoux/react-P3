import { getData } from './api.js';

async function afficherProjet() {
    const projets = await getData();
    const container = document.querySelector('.gallery');
    
    container.innerHTML = ''; 
    
    projets.forEach(projet => {
        const projetFigure = document.createElement('figure');
        
        const img = document.createElement('img');
        img.src = projet.imageUrl;
        img.alt = projet.title;
        
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = projet.title;
        
        projetFigure.appendChild(img);
        projetFigure.appendChild(figcaption);
        container.appendChild(projetFigure);
    });
}

async function filtrerParCategorie(categoryName) {
    const projets = await getData();
    const container = document.querySelector('.gallery');
    
    container.innerHTML = '';
    
    projets.forEach(projet => {
        if (categoryName === 'Tous' || projet.category.name === categoryName) {
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

async function afficherCategories() {
    const projets = await getData();
    const categoryCount = new Map();
    
    projets.forEach(projet => {
        const count = categoryCount.get(projet.category.name) || 0;
        categoryCount.set(projet.category.name, count + 1);
    });
    
    const dropdown = document.getElementById('category-menu');
    
    const liTous = document.createElement('li');
    liTous.textContent = `Tous (${projets.length})`;
    liTous.addEventListener('click', () => {
        filtrerParCategorie('Tous');
    });
    dropdown.appendChild(liTous);
    
    categoryCount.forEach((count, categoryName) => {
        const li = document.createElement('li');
        li.textContent = `${categoryName} (${count})`;
        li.addEventListener('click', () => {
            filtrerParCategorie(categoryName);
        });
        dropdown.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    afficherProjet();
    afficherCategories(); 
});