import { getCatagory, getData, deleteData, addProject } from './api.js';
import { isAuthenticated, logout } from './auth.js';

/**
 * Displays projects in the gallery with optional category filtering
 * @param {string} categoryFilter - Category name to filter ('Tous' by default to display all projects)
 * @returns {Promise<void>}
 */
async function afficherProjet(categoryFilter = 'Tous') {
    // Fetch all projects from the API
    const projets = await getData();
    const container = document.querySelector('.gallery');

    // Clear the container before adding new projects
    container.innerHTML = '';

    // Iterate through each project and display it if it matches the filter
    projets.forEach(projet => {
        if (categoryFilter === 'Tous' || projet.category.name === categoryFilter) {
            // Create the figure element for the project
            const projetFigure = document.createElement('figure');

            // Create and configure the image
            const img = document.createElement('img');
            img.src = projet.imageUrl;
            img.alt = projet.title;

            // Create the caption with the title
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = projet.title;

            // Assemble elements and add to container
            projetFigure.appendChild(img);
            projetFigure.appendChild(figcaption);
            container.appendChild(projetFigure);
        }
    });
}

/**
 * Dynamically creates filter buttons by category
 * Displays an "All" button and a button for each available category
 * @returns {Promise<void>}
 */
async function creerFiltres() {
    // Fetch categories from the API
    const projets = await getCatagory();
    const categories = new Set();

    // Extract unique category names
    projets.forEach(projet => {
        console.log(projet.name);
        categories.add(projet.name);
    });

    const filtersContainer = document.getElementById('filters');

    // Create the "All" button (active by default)
    const btnTous = document.createElement('button');
    btnTous.textContent = 'Tous';
    btnTous.className = 'filter-btn active';
    btnTous.addEventListener('click', () => {
        afficherProjet('Tous');
        setActiveButton(btnTous);
    });
    filtersContainer.appendChild(btnTous);

    // Create a button for each category
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

/**
 * Manages the active state of filter buttons
 * Removes the 'active' class from all buttons and adds it to the clicked button
 * @param {HTMLElement} activeBtn - The button that should become active
 */
function setActiveButton(activeBtn) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

/**
 * Updates the interface based on the user's authentication state
 * - If logged in: displays "Logout", the "edit" button, and an edit mode banner
 * - If not logged in: displays "Login" and category filters
 */
function updateAuthButton() {
    const authLink = document.getElementById('auth-button');

    // Check if user is authenticated
    if (isAuthenticated()) {
        // Logged in mode: display logout and edit mode
        authLink.textContent = 'logout';
        authLink.href = '#';
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
        const img1 = document.createElement('img');
        img1.src = './assets/icons/vector-white.png';
        img1.alt = 'Modifier';
        img1.className = 'modif-img';


        // Create edit mode banner
        const banner = document.createElement('div');
        banner.id = 'edit-mode-banner';

        const bannerText = document.createElement('span');
        bannerText.textContent = 'Mode édition';
        banner.appendChild(img1);
        banner.appendChild(bannerText);

        // Insert banner at the beginning of body
        document.body.prepend(banner);

        // Add class to body for padding
        document.body.classList.add('edit-mode');

        // Create the "edit" button to access the gallery in edit mode
        const editModeContainer = document.getElementById('edit-mode');

        if (!editModeContainer) {
            return;
        }

        editModeContainer.innerHTML = '';

        const btn = document.createElement('button');
        btn.textContent = 'modifier';
        btn.className = 'modif-btn';

        // Add icon to button
        const img2 = document.createElement('img');
        img2.src = './assets/icons/vector.png';
        img2.alt = 'Modifier';
        img2.className = 'modif-img';
        btn.prepend(img2);

        // Event to open the gallery modal
        btn.onclick = () => {
            console.log('Opening gallery modal...');
            ouvrirModaleGalerie();
        };

        editModeContainer.appendChild(btn);

    } else {
        // Not logged in mode: display login and filters
        authLink.textContent = 'login';
        authLink.href = 'login.html';

        // Remove banner if it exists
        const existingBanner = document.getElementById('edit-mode-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        // Remove edit mode class from body
        document.body.classList.remove('edit-mode');

        creerFiltres();
    }
}

/**
 * Opens a modal displaying all projects with delete functionality
 * Also provides access to the project addition form
 * @returns {Promise<void>}
 */
async function ouvrirModaleGalerie() {
    console.log('Opening gallery modal');

    // Fetch all projects
    const projets = await getData();

    // Create the modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-galerie';

    // Generate HTML for each project with its delete button
    let galerieHTML = '';
    projets.forEach(projet => {
        galerieHTML += `
            <div class="projet-item" data-id="${projet.id}">
                <img src="${projet.imageUrl}" alt="${projet.title}">
                <button class="btn-delete" data-id="${projet.id}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });

    // Inject content into the modal
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Galerie photo</h2>
            
            <div class="galerie-projets">
                ${galerieHTML}
            </div>
            
            <hr class="separator">
            
            <button class="btn-ajouter-photo" id="btn-ajouter-photo">Ajouter une photo</button>
        </div>
    `;

    // Add modal to DOM and display it
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Handle closing with X button
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Handle closing when clicking outside the content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Handle project deletions
    const deleteButtons = modal.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Save references before async call
            const button = e.currentTarget;
            const projetId = button.getAttribute('data-id');
            const projetItem = button.closest('.projet-item');

            console.log('Deleting project:', projetId);

            // Ask for confirmation before deletion
            if (confirm('Do you really want to delete this project?')) {
                try {
                    // Call API to delete the project
                    await deleteData(projetId);

                    // Visually remove element from modal
                    projetItem.remove();

                    console.log('Project deleted');

                    // Refresh main gallery
                    await afficherProjet('Tous');

                } catch (error) {
                    console.error('Deletion error:', error);
                    alert('Error during deletion');
                }
            }
        });
    });

    // Handle "Add a photo" button
    const btnAjouter = modal.querySelector('#btn-ajouter-photo');
    btnAjouter.addEventListener('click', () => {
        modal.remove(); // Close gallery
        ouvrirModaleAjoutProjet(); // Open addition form
    });
}

/**
 * Opens a modal with a form to add a new project
 * The form contains: image, title, and category
 * Categories are dynamically loaded from the API
 * @returns {Promise<void>}
 */
async function ouvrirModaleAjoutProjet() {

    // Fetch categories from the API
    const categories = await getCatagory();
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-ajout';

    // Generate select options for categories
    let categoriesOptions = '<option value=""></option>';
    categories.forEach(cat => {
        categoriesOptions += `<option value="${cat.id}">${cat.name}</option>`;
    });

    // Create modal HTML structure
    modal.innerHTML = `
        <div class="modal-content">
            <span class="back-arrow"><i class="fa-solid fa-arrow-left"></i></span>
            <span class="close">&times;</span>
            <h2>Ajout photo</h2>
            
            <form id="form-ajout-projet">
                <div class="form-group">
                    <label for="image">Image</label>
                    <div class="file-input-container" id="file-container">
                        <img src="./assets/icons/picture.png" alt="icon image" class="icon-image"/>
                        <label for="image" class="file-input-label">
                            <span>+ Ajouter photo</span>
                        </label>
                        <input type="file" id="image" accept="image/*" required style="display: none;">
                        <p class="file-info">jpg, png : 4mo max</p>
                    </div>
                </div>

                <div class="form-group">
                    <label for="titre">Titre</label>
                    <input type="text" id="titre" required>
                </div>
                
                <div class="form-group">
                    <label for="categorie">Catégorie</label>
                    <select id="categorie" required>
                        ${categoriesOptions}
                    </select>
                </div>
                
                <button type="submit" class="btn-valider">Valider</button>
            </form>
        </div>
    `;

    // Add modal to DOM and display it
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Handle back arrow to return to gallery modal
    const backArrow = modal.querySelector('.back-arrow');
    backArrow.addEventListener('click', () => {
        modal.remove();
        ouvrirModaleGalerie();
    });

    // Handle closing with X button
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Handle closing when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Get DOM elements for file input handling
    const fileContainer = modal.querySelector('#file-container');
    const fileInput = modal.querySelector('#image');
    const pictureIcon = modal.querySelector('.icon-image');
    const fileInputLabel = modal.querySelector('.file-input-label');
    const fileInfo = modal.querySelector('.file-info');

    // Open file selector when clicking on container
    fileContainer.addEventListener('click', () => {
        fileInput.click();
    });

   // ========== IMAGE PREVIEW AND VALIDATION ==========
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    // Reset if no file selected
    if (!file) {
        checkFormValidity();
        return;
    }
    
    // ===== VALIDATION DU TYPE DE FICHIER =====
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        alert('Format de fichier non autorisé. Veuillez utiliser JPG ou PNG.');
        fileInput.value = ''; // Reset input
        checkFormValidity();
        return;
    }
    
    // ===== VALIDATION DE LA TAILLE (4 Mo max) =====
    const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
    if (file.size > maxSize) {
        alert('Le fichier est trop volumineux. Taille maximale : 4 Mo.');
        fileInput.value = ''; // Reset input
        checkFormValidity();
        return;
    }
    
    // ===== PREVIEW DE L'IMAGE SI VALIDATION OK =====
    const reader = new FileReader();
    
    reader.onload = (event) => {
        // Replace picture.png with imported image
        pictureIcon.src = event.target.result;
        pictureIcon.alt = file.name;
        pictureIcon.style.width = '100%';
        pictureIcon.style.height = 'auto';
        pictureIcon.style.maxHeight = '169px';
        pictureIcon.style.objectFit = 'contain';
        
        // Hide "Add photo" button
        fileInputLabel.style.display = 'none';
        fileInfo.style.display = 'none';
        
        // Check form validity after image is selected
        checkFormValidity();
    };
    
    reader.readAsDataURL(file);
});
// =============================================
    // ============================================


    const submitButton = modal.querySelector('.btn-valider');
    const titreInput = modal.querySelector('#titre');
    const categorieSelect= modal.querySelector('#categorie')


    function checkFormValidity(){
        const hasImage=fileInput.files.length >0;
        const hasTitle=titreInput.value != '';
        const hasCategorie=categorieSelect.value!='';

        if(hasImage && hasTitle && hasCategorie){
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        }else {
           submitButton.disabled = false;
            submitButton.classList.add('disabled');
        }
    }

    submitButton.disabled=true;
    submitButton.classList.add('disabled');

    

    titreInput.addEventListener('input', checkFormValidity);
    categorieSelect.addEventListener('change', checkFormValidity);



    // Handle form submission
    const form = modal.querySelector('#form-ajout-projet');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const titre = document.getElementById('titre').value;
        const image = document.getElementById('image').files[0];
        const categorie = document.getElementById('categorie').value;

        // Create FormData to send file
        const formData = new FormData();
        formData.append('title', titre);
        formData.append('image', image);
        formData.append('category', categorie);

        try {
            // Send project to API
            await addProject(formData);
            
            // Refresh gallery to display new project
            await afficherProjet('Tous');
            
            // Close modal
            modal.remove();
            
            // Notify user of success
            alert('Project added successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Error during addition');
        }
    });
}

/**
 * Application entry point
 * Executed when DOM is fully loaded
 * Initializes project display and manages authentication
 */
document.addEventListener('DOMContentLoaded', async () => {
    const targetHash = window.location.hash;
    
    // Wait for all async operations to complete
    await Promise.all([
        afficherProjet('Tous'),
        // Add other async operations here if needed
    ]);

    updateAuthButton();

    // Scroll after everything is done
    if (targetHash) {
        const target = document.querySelector(targetHash);
        if (target) {
            // Small delay to ensure rendering
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
});