
import { loginUser } from './api.js';

export async function login(email, password) {
    try {
        const data = await loginUser(email, password);
        
        localStorage.setItem('token', data.token);
        
        return data;
        
    } catch (error) {
        throw error;
    }
}

export function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

export function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

export function getToken() {
    return localStorage.getItem('token');
}