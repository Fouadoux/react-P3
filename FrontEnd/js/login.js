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
        
        let errorMsg = 'Erreur de connexion';
        
        const errorText = error.message.toLowerCase();
        
        if (errorText.includes('incorrect credentials') || 
            errorText.includes('unauthorized') || 
            errorText.includes('401')) {
            errorMsg = 'Identifiant ou mot de passe incorrect';
        } else if (errorText.includes('network') || 
                   errorText.includes('failed to fetch') ||
                   errorText.includes('networkerror')) {
            errorMsg = 'Erreur de connexion au serveur. Veuillez réessayer.';
        } else if (errorText.includes('500')) {
            errorMsg = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (error.message && !errorText.includes('incorrect')) {
            errorMsg = error.message;
        }
        
        showError(errorMsg);
        
        submitButton.disabled = false;
        submitButton.textContent = 'Se connecter';
    }
});