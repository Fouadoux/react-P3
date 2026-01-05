import { loginUser } from './api.js';

/**
 * Authentication Module
 * 
 * This module provides functions for user authentication management including:
 * - User login with token storage
 * - User logout with token removal
 * - Authentication state checking
 * - Token retrieval for API requests
 * 
 * Authentication tokens are stored in localStorage for persistence across sessions.
 */

/**
 * Authenticates a user and stores the authentication token.
 * 
 * This function calls the API to authenticate the user with their credentials.
 * Upon successful authentication, it stores the received token in localStorage
 * for subsequent authenticated requests.
 * 
 * @async
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data including the authentication token
 * @throws {Error} If authentication fails (invalid credentials, network error, etc.)
 * 
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
 * Logs out the current user.
 * 
 * Removes the authentication token from localStorage and redirects
 * the user to the home page. This effectively ends the user's session.
 * 
 * @returns {void}
 * 
 */
export function logout() {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

/**
 * Checks if a user is currently authenticated.
 * 
 * Determines authentication status by checking for the presence
 * of an authentication token in localStorage.
 * 
 * @returns {boolean} True if user is authenticated (token exists), false otherwise
 * 
 */
export function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

/**
 * Retrieves the current authentication token.
 * 
 * Returns the stored authentication token from localStorage.
 * This token is typically used in API request headers for
 * authenticated endpoints.
 * 
 * @returns {string|null} The authentication token if user is authenticated, 
 *                        null if not authenticated
 * 
 */
export function getToken() {
    return localStorage.getItem('token');
}