import axios from "axios";

// URL de base pour votre API
const API_BASE_URL = "http://localhost:3002/api";

// Création de l'instance Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter automatiquement le token aux requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Récupérer le token depuis le stockage local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API: Connexion utilisateur
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/v1/auth/login", { email, password });
    // Stocker le token dans localStorage en cas de succès
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data; // Cela renverra le token ou d'autres données liées à l'utilisateur
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

// API: Inscription utilisateur
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    const response = await apiClient.post("/v1/auth/register", {
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    });
    // Optionnellement, tu peux directement connecter l'utilisateur après l'inscription
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data; // Cela renverra des informations comme un message de succès ou le token
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error;
  }
};

// API: Récupération des instruments
export const fetchInstruments = async () => {
  try {
    const response = await apiClient.get("/v1/instruments");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des instruments :", error);
    throw error;
  }
};

// Export par défaut pour `apiClient`, si nécessaire ailleurs
export default apiClient;
