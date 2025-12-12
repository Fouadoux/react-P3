
const API_URL = 'http://localhost:5678/api';

export async function getData() {
  try {
    const response = await fetch(`${API_URL}/works`);
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error('Erreur getUsers:', error);
    throw error;
  }
}

export async function getCatagory() {
  try {
    const response = await fetch(`${API_URL}/works`);
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error('Erreur getUsers:', error);
    throw error;
  }
}


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
            throw new Error('Identifiants incorrects');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Erreur login:', error);
        throw error;
    }
}