
import { login, isAuthenticated } from './auth.js';

if (isAuthenticated()) {
    window.location.href = 'index.html';
}

const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    try {
        await login(email, password);
        
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        errorMessage.style.display = 'block';
    }
});