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
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
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
}

export const fetchGenres = async () => {
  try {
    const response = await apiClient.get("/v1/genres");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des genres :", error);
    throw error;
  }
}

export const fetchGroupDetails = async () => {
  try {
    const response = await apiClient.get(`/v1/groups`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du groupe :", error);
    throw error;
  }
};

export const fetchGroupById = async (id: string) => {
  try {
    const response = await apiClient.get(`/v1/groups/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du groupe :", error);
    throw error;
  }
};

export const createGroup = async (group: any) => {
  try {
    const response = await apiClient.post("/v1/groups", group);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du groupe :", error);
    throw error;
  }
};

export const updateUser = async (userId: number, updatedData: any) => {
  const apiUrl = `https://votre-api.com/users/${userId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de l'utilisateur.");
    }

    const data = await response.json();
    return data; // Retourne les données mises à jour de l'utilisateur
  } catch (error) {
    console.error("Erreur de mise à jour utilisateur", error);
  }
};

export const createAddress = async (address: any) => {
  try {
    const response = await apiClient.post("/v1/addresses", address);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'adresse :", error);
    throw error;
  }
};

export const fetchAddresses = async () => {
  try {
    const response = await apiClient.get("/v1/addresses");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des adresses :", error);
    throw error;
  }
};


export const createReservation = async (reservation: any) => {
  try {
    const response = await apiClient.post("/v1/reservations", reservation);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la réservation :", error);
    throw error;
  }
};

export const updateUserGroups = async (userId: number, groupId: number) => {
  try {
    const response = await apiClient.post("/v1/user-groups");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des groupes de l'utilisateur :", error);
    throw error;
  }
}

export default apiClient;