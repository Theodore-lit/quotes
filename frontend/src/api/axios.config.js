import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    // 'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // withCredentials: true
});




// Ajoute le token JWT pour les requêtes authentifiées
api.interceptors.request.use((config) => {
  const storedData = localStorage.getItem('token');
  
  if (storedData) {
    try {
      // 1. On essaie de parser car c'est un objet JSON {"token": "..."}
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token; // On extrait uniquement la valeur du token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // 2. Si le parse échoue, c'est que le token est déjà une chaîne brute
      config.headers.Authorization = `Bearer ${storedData}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Gestion des erreurs globales
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401){
      // Token expiré ou invalide
      // localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


