import { login, isAuthenticated } from './auth.js';

/**
 * Login Page Handler
 * Manages user authentication through a login form
 * Redirects authenticated users to the home page
 */

// Redirect to home page if user is already authenticated
if (isAuthenticated()) {
    window.location.href = 'index.html';
}

// Get DOM elements
const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

/**
 * Handles login form submission
 * @listens submit
 */
form.addEventListener('submit', async (e) => {
    // Prevent default form submission
    e.preventDefault();
    
    // Get form input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Hide any previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    try {
        // Attempt to authenticate user
        await login(email, password);
        
        // Display success message
        successMessage.style.display = 'block';
        
        // Redirect to home page after 1 second
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        // Display error message if authentication fails
        errorMessage.style.display = 'block';
    }
});