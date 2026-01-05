import { login, isAuthenticated } from './auth.js';

/**
 * Login Page Handler
 * 
 * This module manages the login page functionality including:
 * - Automatic redirection if user is already authenticated
 * - Form validation and submission
 * - Error and success message display
 * - Loading state management during authentication
 */

/**
 * Redirects to homepage if user is already authenticated.
 * 
 * This check runs immediately when the script loads to prevent
 * authenticated users from accessing the login page.
 */
if (isAuthenticated()) {
    window.location.href = 'index.html';
}

/**
 * Main login form element.
 * @type {HTMLFormElement}
 */
const form = document.getElementById('login-form');

/**
 * Container for displaying error messages.
 * @type {HTMLElement}
 */
const errorMessageDiv = document.getElementById('error-message');

/**
 * Container for displaying success messages.
 * @type {HTMLElement}
 */
const successMessageDiv = document.getElementById('success-message');

/**
 * Displays an error message to the user.
 * 
 * Shows the error message container and hides the success message container.
 * 
 * @param {string} message - The error message to display
 * @returns {void}
 * 
 * @example
 * showError('Invalid email or password');
 */
function showError(message) {
    errorMessageDiv.querySelector('p').textContent = message;
    errorMessageDiv.style.display = 'block';
    successMessageDiv.style.display = 'none';
}

/**
 * Displays a success message to the user.
 * 
 * Shows the success message container and hides the error message container.
 * 
 * @param {string} message - The success message to display
 * @returns {void}
 * 
 * @example
 * showSuccess('Login successful!');
 */
function showSuccess(message) {
    successMessageDiv.querySelector('p').textContent = message;
    successMessageDiv.style.display = 'block';
    errorMessageDiv.style.display = 'none';
}

/**
 * Hides both error and success message containers.
 * 
 * Used to clear all messages before attempting a new login
 * or when resetting the form state.
 * 
 * @returns {void}
 * 
 * @example
 * hideMessages();
 */
function hideMessages() {
    errorMessageDiv.style.display = 'none';
    successMessageDiv.style.display = 'none';
}

/**
 * Handles login form submission.
 * 
 * Process:
 * 1. Prevents default form submission
 * 2. Retrieves and trims email and password values
 * 3. Validates that both fields are filled
 * 4. Disables submit button and shows loading state
 * 5. Attempts authentication via login() function
 * 6. On success: displays success message and redirects to homepage
 * 7. On error: displays error message and re-enables submit button
 * 
 * Validations:
 * - Checks that email field is not empty
 * - Checks that password field is not empty
 * 
 * @listens form#submit
 * 
 * @example
 * // Form automatically handles submission when user clicks submit button
 * // or presses Enter while focused on form fields
 */
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
        window.location.href = 'index.html';
        
    } catch (error) {
        
        showError(error.message);
        
        submitButton.disabled = false;
        submitButton.textContent = 'Se connecter';
    }
});