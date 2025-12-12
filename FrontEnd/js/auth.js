import { loginUser } from './api.js';

/**
 * Authenticates a user and stores the authentication token
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data including the authentication token
 * @throws {Error} If authentication fails
 */
export async function login(email, password) {
    try {
        // Call API to authenticate user
        const data = await loginUser(email, password);
        
        // Store authentication token in localStorage
        localStorage.setItem('token', data.token);
        
        return data;
        
    } catch (error) {
        throw error;
    }
}

/**
 * Logs out the current user
 * Removes the authentication token and redirects to the home page
 */
export function logout() {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

/**
 * Checks if a user is currently authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

/**
 * Retrieves the current authentication token
 * @returns {string|null} The authentication token, or null if not authenticated
 */
export function getToken() {
    return localStorage.getItem('token');
}