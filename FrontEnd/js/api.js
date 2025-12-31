/**
 * Base URL for the API
 * @constant {string}
 */
const API_URL = 'http://localhost:5678/api';

import { getToken } from './auth.js';

/**
 * Fetches all projects/works from the API
 * @returns {Promise<Array>} Array of project objects
 * @throws {Error} If network request fails
 */
export async function getData() {
  try {
    const response = await fetch(`${API_URL}/works`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error('Error getData:', error);
    throw error;
  }
}

/**
 * Fetches all categories from the API
 * @returns {Promise<Array>} Array of category objects
 * @throws {Error} If network request fails
 */
export async function getCatagory() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error('Error getCategories:', error);
    throw error;
  }
}

/**
 * Authenticates a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data including authentication token
 * @throws {Error} If credentials are incorrect or request fails
 */
export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            switch (response.status) {
                case 401:
                    throw new Error('Identifiant ou mot de passe incorrect');
                case 404:
                    throw new Error('Utilisateur non trouvé');
                case 500:
                    throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
                default:
                    throw new Error(`Erreur de connexion (${response.status})`);
            }
        }
        
        return await response.json();
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Impossible de se connecter au serveur');
        }
        
        throw error;
    }
}

/**
 * Deletes a project by its ID
 * Requires authentication token
 * @param {string|number} id - The ID of the project to delete
 * @returns {Promise<Response>} The fetch response object
 * @throws {Error} If deletion fails or user is not authenticated
 */
export async function deleteData(id){
    try {
        const response = await fetch(`${API_URL}/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error during deletion');
        }
        
        return response;
        
    } catch (error) {
        console.error('Error deletion:', error);
        throw error;
    }
}

/**
 * Adds a new project to the API
 * Requires authentication token
 * @param {FormData} formData - Form data containing title, image, and category
 * @returns {Promise<Object>} The newly created project object
 * @throws {Error} If project creation fails or user is not authenticated
 */
export async function addProject(formData) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/works`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Note: Content-Type is automatically set by the browser for FormData
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error details:', errorData);
            throw new Error(`Error ${response.status}: ${errorData}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Error addProject:', error);
        throw error;
    }
}