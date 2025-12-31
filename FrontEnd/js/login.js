import { login, isAuthenticated } from './auth.js';

/**
 * Login Page Handler
 */

if (isAuthenticated()) {
    window.location.href = 'index.html';
}

const form = document.getElementById('login-form');
const errorMessageDiv = document.getElementById('error-message');
const successMessageDiv = document.getElementById('success-message');

function showError(message) {
    errorMessageDiv.querySelector('p').textContent = message;
    errorMessageDiv.style.display = 'block';
    successMessageDiv.style.display = 'none';
}

function showSuccess(message) {
    successMessageDiv.querySelector('p').textContent = message;
    successMessageDiv.style.display = 'block';
    errorMessageDiv.style.display = 'none';
}

function hideMessages() {
    errorMessageDiv.style.display = 'none';
    successMessageDiv.style.display = 'none';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    hideMessages();
    
    if (!email || !password) {
        showError('Veuillez remplir tous les champs');
        return;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Connexion...';
    
    try {
        await login(email, password);
        
        showSuccess('Connexion réussie ! Redirection en cours...');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        
       
        
        showError(error.message);
        
        submitButton.disabled = false;
        submitButton.textContent = 'Se connecter';
    }
});