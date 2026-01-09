import { getCatagory, getData, deleteData, addProject } from './api.js';
import { isAuthenticated, logout } from './auth.js';

/**
 * Displays projects in the gallery with optional category filtering.
 * 
 * This function fetches all projects from the API, clears the gallery container,
 * then displays only the projects matching the specified category filter.
 * Each project is displayed with its image and title in a <figure> element.
 * 
 * @async
 * @param {string} [categoryFilter='Tous'] - Category name to filter projects.
 *                                            'Tous' displays all projects without filtering.
 * @returns {Promise<void>}
 * 
 * @example
 * // Display all projects
 * await afficherProjet('Tous');
 * 
 * @example
 * // Display only projects from the "Objects" category
 * await afficherProjet('Objets');
 */
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

/**
 * Dynamically creates filter buttons by category.
 * 
 * This function fetches all available categories from the API,
 * extracts unique names, then creates an "All" button and a button
 * for each category. The "All" button is active by default.
 * 
 * @async
 * @returns {Promise<void>}
 * 
 * @example
 * // Create category filters
 * await creerFiltres();
 */
async function creerFiltres() {
    const projets = await getCatagory();
    const categories = new Set();

    projets.forEach(projet => {
        categories.add(projet.name);
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

/**
 * Manages the active state of filter buttons.
 * 
 * Removes the 'active' class from all filter buttons and adds it
 * only to the specified button. Visually indicates which filter
 * is currently applied.
 * 
 * @param {HTMLElement} activeBtn - The button that should receive the 'active' class
 * @returns {void}
 * 
 * @example
 * const myButton = document.querySelector('.filter-btn');
 * setActiveButton(myButton);
 */
function setActiveButton(activeBtn) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

/**
 * Updates the user interface based on authentication state.
 * 
 * If the user is logged in:
 * - Displays "logout" in the authentication button
 * - Creates an "Edit mode" banner at the top of the page
 * - Adds a "modify" button to open the gallery management modal
 * - Applies the 'edit-mode' class to the body
 * 
 * If the user is not logged in:
 * - Displays "login" with a link to the login page
 * - Removes the edit mode banner
 * - Removes the 'edit-mode' class from the body
 * - Displays category filters
 * 
 * @returns {void}
 * 
 * @example
 * // Update interface after login/logout
 * updateAuthButton();
 */
function updateAuthButton() {
    const authLink = document.getElementById('auth-button');

    if (isAuthenticated()) {
        authLink.textContent = 'logout';
        authLink.href = '#';
        
        // Cloner pour retirer tous les anciens événements
        const newAuthLink = authLink.cloneNode(true);
        authLink.replaceWith(newAuthLink);
        const currentAuthLink = document.getElementById('auth-button');
        
        currentAuthLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });

        // Vérifier si la bannière existe déjà
        let banner = document.getElementById('edit-mode-banner');
        
        if (!banner) {
            // Créer la bannière seulement si elle n'existe pas
            banner = document.createElement('div');
            banner.id = 'edit-mode-banner';

            const img1 = document.createElement('img');
            img1.src = './assets/icons/vector-white.png';
            img1.alt = 'Modifier';
            img1.className = 'modif-img';

            const bannerText = document.createElement('span');
            bannerText.textContent = 'Mode édition';
            
            banner.appendChild(img1);
            banner.appendChild(bannerText);

            document.body.prepend(banner);
        }

        document.body.classList.add('edit-mode');

        const editModeContainer = document.getElementById('edit-mode');

        if (!editModeContainer) {
            return;
        }

        // Vérifier si le bouton existe déjà
        let btn = editModeContainer.querySelector('.modif-btn');
        
        if (!btn) {
            // Créer le bouton seulement s'il n'existe pas
            btn = document.createElement('button');
            btn.textContent = 'modifier';
            btn.className = 'modif-btn';

            const img2 = document.createElement('img');
            img2.src = './assets/icons/vector.png';
            img2.alt = 'Modifier';
            img2.className = 'modif-img';
            btn.prepend(img2);

            btn.onclick = () => {
                ouvrirModaleGalerie();
            };

            editModeContainer.appendChild(btn);
        }

    } else {
        authLink.textContent = 'login';
        authLink.href = 'login.html';

        const existingBanner = document.getElementById('edit-mode-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        document.body.classList.remove('edit-mode');

        creerFiltres();
    }
}

/**
 * Opens a modal displaying all projects with delete functionality.
 * 
 * This modal allows you to:
 * - View all gallery projects
 * - Delete a project (with confirmation)
 * - Access the project addition form
 * 
 * The modal closes by clicking the X button or clicking outside.
 * After deleting a project, the main gallery is automatically refreshed.
 * 
 * Modal structure:
 * - Title "Photo Gallery"
 * - Grid of projects with delete button on each project
 * - Horizontal separator
 * - "Add a photo" button
 * 
 * @async
 * @returns {Promise<void>}
 * 
 * @example
 * // Open the gallery management modal
 * await ouvrirModaleGalerie();
 */
async function ouvrirModaleGalerie() {
    const existingModal = document.getElementById('modal-galerie');
    if (existingModal) {
        existingModal.remove();
    }

    const projets = await getData();
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-galerie';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Galerie photo</h2>
            <div class="galerie-projets"></div>
            <hr class="separator">
            <button class="btn-ajouter-photo" id="btn-ajouter-photo">Ajouter une photo</button>
        </div>
    `;

    const galerieContainer = modal.querySelector('.galerie-projets');

    projets.forEach(projet => {
        const projetItem = document.createElement('div');
        projetItem.className = 'projet-item';
        projetItem.dataset.id = projet.id;

        const img = document.createElement('img');
        img.src = projet.imageUrl;
        img.alt = projet.title;

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.dataset.id = projet.id;
        btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        projetItem.appendChild(img);
        projetItem.appendChild(btnDelete);
        galerieContainer.appendChild(projetItem);
    });

    document.body.appendChild(modal);
    modal.style.display = 'block';

    function cleanupAndClose() {
        window.removeEventListener('click', handleOutsideClick);
        modal.remove();
    }

    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', cleanupAndClose);

    function handleOutsideClick(e) {
        if (e.target === modal) {
            cleanupAndClose();
        }
    }

    window.addEventListener('click', handleOutsideClick);

    const deleteButtons = modal.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const button = e.currentTarget;
            const projetId = button.getAttribute('data-id');
            const projetItem = button.closest('.projet-item');

            try{
            await deleteData(projetId);

            projetItem.remove();

            await afficherProjet('Tous');
            }catch(error){
                 console.error('Erreur lors de la suppression:', error);
            }
        });
    });

    const btnAjouter = modal.querySelector('#btn-ajouter-photo');
    btnAjouter.addEventListener('click', () => {
        cleanupAndClose();
        ouvrirModaleAjoutProjet();
    });
}

/**
 * Opens a modal with a form to add a new project.
 * 
 * The form includes:
 * - An image upload field (JPG, PNG, max 4 MB) with preview
 * - A title field (required text)
 * - A category dropdown (dynamically loaded from the API)
 * 
 * Validations performed:
 * - File type: only JPEG, JPG, PNG
 * - File size: maximum 4 MB
 * - All fields are required
 * - The "Validate" button is only active if all fields are filled
 * 
 * Features:
 * - Back arrow to return to the gallery
 * - Closes via X button or outside click
 * - Automatic preview of selected image
 * - Data sent via FormData
 * - Gallery refresh after successful addition
 * - Success/error notifications
 * 
 * @async
 * @returns {Promise<void>}
 * 
 * @example
 * // Open the project addition form
 * await ouvrirModaleAjoutProjet();
 */
async function ouvrirModaleAjoutProjet() {
    const existingModal = document.getElementById('modal-ajout');
    if (existingModal) {
        existingModal.remove();
    }

    const categories = await getCatagory();
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modal-ajout';

    const categoriesOptions = '<option value=""></option>' + categories.map(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        return option.outerHTML;
    }).join('');

    modal.innerHTML = `
        <div class="modal-content">
            <span class="back-arrow"><i class="fa-solid fa-arrow-left"></i></span>
            <span class="close">&times;</span>
            <h2>Ajout photo</h2>
            
            <form id="form-ajout-projet">
                <div class="form-group">
                    <div class="file-input-container" id="file-container">
                        <img src="./assets/icons/picture.png" alt="icon image" class="icon-image"/>
                        <label class="file-input-label">
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
                <hr class="separator">
                <button type="submit" class="btn-valider">Valider</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    const fileContainer = modal.querySelector('#file-container');
    const fileInput = modal.querySelector('#image');
    const pictureIcon = modal.querySelector('.icon-image');
    const fileInputLabel = modal.querySelector('.file-input-label');
    const fileInfo = modal.querySelector('.file-info');

    let isFilePickerOpen = false;

    function cleanupAndClose() {
        fileContainer.removeEventListener('click', handleContainerClick);
        fileInputLabel.removeEventListener('click', handleLabelClick);
        window.removeEventListener('click', handleOutsideClick);
        modal.remove();
    }

    const backArrow = modal.querySelector('.back-arrow');
    backArrow.addEventListener('click', () => {
        cleanupAndClose();
        ouvrirModaleGalerie();
    });

    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', cleanupAndClose);

    function handleOutsideClick(e) {
        if (e.target === modal) {
            cleanupAndClose();
        }
    }

    window.addEventListener('click', handleOutsideClick);

    function handleLabelClick(e) {
        e.stopPropagation();
        
        if (isFilePickerOpen) {
            return;
        }
        
        isFilePickerOpen = true;
        fileInput.click();
    }

    fileInputLabel.addEventListener('click', handleLabelClick);

    function handleContainerClick(e) {
        if (isFilePickerOpen) {
            return;
        }

        if (
            e.target.matches('.file-input-label') ||
            e.target.matches('.file-input-label *') ||
            e.target.matches('.file-info')
        ) {
            return;
        }

        isFilePickerOpen = true;
        fileInput.click();
    }

    fileContainer.addEventListener('click', handleContainerClick);

    function resetImagePreview() {
        pictureIcon.src = './assets/icons/picture.png';
        pictureIcon.alt = 'icon image';
        pictureIcon.style.width = '';
        pictureIcon.style.height = '';
        pictureIcon.style.maxHeight = '';
        pictureIcon.style.objectFit = '';
        
        fileInputLabel.style.display = '';
        fileInfo.style.display = '';
    }

    fileInput.addEventListener('change', (e) => {
        isFilePickerOpen = false;

        const file = e.target.files[0];

        if (!file) {
            resetImagePreview();
            checkFormValidity();
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Format de fichier non autorisé. Veuillez utiliser JPG ou PNG.');
            fileInput.value = '';
            resetImagePreview();
            checkFormValidity();
            return;
        }

        const maxSize = 4 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('Le fichier est trop volumineux. Taille maximale : 4 Mo.');
            fileInput.value = '';
            resetImagePreview();
            checkFormValidity();
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            pictureIcon.src = event.target.result;
            pictureIcon.alt = file.name;
            pictureIcon.style.width = '100%';
            pictureIcon.style.height = 'auto';
            pictureIcon.style.maxHeight = '169px';
            pictureIcon.style.objectFit = 'contain';

            fileInputLabel.style.display = 'none';
            fileInfo.style.display = 'none';

            checkFormValidity();
        };

        reader.onerror = () => {
            alert('Erreur lors de la lecture du fichier.');
            fileInput.value = '';
            resetImagePreview();
            checkFormValidity();
        };

        reader.readAsDataURL(file);
    });

    fileInput.addEventListener('cancel', () => {
        isFilePickerOpen = false;
    });

    const submitButton = modal.querySelector('.btn-valider');
    const titreInput = modal.querySelector('#titre');
    const categorieSelect = modal.querySelector('#categorie');

    function checkFormValidity() {
        const hasImage = fileInput.files.length > 0;
        const hasTitle = titreInput.value.trim() !== '';
        const hasCategorie = categorieSelect.value !== '';

        if (hasImage && hasTitle && hasCategorie) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        } else {
            submitButton.disabled = true;
            submitButton.classList.add('disabled');
        }
    }

    submitButton.disabled = true;
    submitButton.classList.add('disabled');

    titreInput.addEventListener('input', checkFormValidity);
    categorieSelect.addEventListener('change', checkFormValidity);

    const form = modal.querySelector('#form-ajout-projet');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titre = titreInput.value.trim();
        const image = fileInput.files[0];
        const categorie = categorieSelect.value;

        const formData = new FormData();
        formData.append('title', titre);
        formData.append('image', image);
        formData.append('category', categorie);

        try {
            await addProject(formData);
            await afficherProjet('Tous');
            cleanupAndClose();
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
        }
    });
}

/**
 * Application entry point.
 * 
 * Executed when the DOM is fully loaded. Initializes the application by:
 * 1. Retrieving the URL hash (if present)
 * 2. Waiting for loading and displaying all projects
 * 3. Updating the authentication button and interface based on login state
 * 4. Performing smooth scrolling to the targeted section if a hash is present in the URL
 * 
 * @listens document#DOMContentLoaded
 * 
 * @example
 * // The application loads automatically when the page loads
 * // If the URL contains #portfolio, the page will scroll to that section
 */
document.addEventListener('DOMContentLoaded', async () => {
    const targetHash = window.location.hash;

    await Promise.all([
        afficherProjet('Tous'),
    ]);

    updateAuthButton();

    if (targetHash) {
        const target = document.querySelector(targetHash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
});