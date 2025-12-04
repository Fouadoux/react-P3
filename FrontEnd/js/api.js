


export async function getData() {
  try {
    const response = await fetch('//localhost:5678/api/works');
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error('Erreur getUsers:', error);
    throw error;
  }
}