import axios from "axios";

const API_BASE_URL = "http://localhost:3002/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error;
  }
};

export const fetchUserDetails = async () => {
  try {
    const response = await apiClient.get("/v1/users/me");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails utilisateur :", error);
    throw error;
  }
};


export const fetchInstruments = async () => {
  try {
    const response = await apiClient.get("/v1/instruments");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des instruments :", error);
    throw error;
  }
};

export default apiClient;
