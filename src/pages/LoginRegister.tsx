import React, { useState, ChangeEvent, FormEvent } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { EyeOpenIcon, EyeClosedIcon, HomeIcon } from "@radix-ui/react-icons";
import { loginUser, registerUser } from "../apiService";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const passwordCriteria = {
  minLength: 8,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
};

const validatePassword = (password: string): string[] => {
  const missingCriteria: string[] = [];

  if (password.length < passwordCriteria.minLength) {
    missingCriteria.push(`au moins ${passwordCriteria.minLength} caractères`);
  }
  if (!passwordCriteria.lowercase.test(password)) {
    missingCriteria.push("au moins une lettre minuscule");
  }
  if (!passwordCriteria.uppercase.test(password)) {
    missingCriteria.push("au moins une lettre majuscule");
  }
  if (!passwordCriteria.number.test(password)) {
    missingCriteria.push("au moins un chiffre");
  }

  return missingCriteria;
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string) => {
  return name.length >= 2;
};

const TabsDemo: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [submittedData, setSubmittedData] = useState<
    (LoginData | RegisterData)[]
  >([]);

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [activeTab, setActiveTab] = useState("tab1");

  const navigate = useNavigate();

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setLoginError(null);
  };

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    setRegisterError(null);
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setLoginError("Merci de remplir tous les champs.");
      return;
    }

    try {
      const response = await loginUser(loginData.email, loginData.password);
      localStorage.setItem("authToken", response.token);
      console.log("Connexion réussie, token :", response.token);
      setLoginData({ email: "", password: "" });
      setLoginError(null);

      navigate("/groups");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setLoginError("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(null);
    setNameError(null);
    if (
      !registerData.firstName ||
      !registerData.lastName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.passwordConfirmation
    ) {
      setRegisterError("Merci de remplir tous les champs.");
      return;
    }

    if (
      !validateName(registerData.firstName) ||
      !validateName(registerData.lastName)
    ) {
      setNameError(
        "Le prénom et le nom doivent contenir au moins 2 caractères."
      );
      return;
    }

    if (!validateEmail(registerData.email)) {
      setEmailError("L'email n'est pas valide.");
      return;
    }

    const missingCriteria = validatePassword(registerData.password);

    if (missingCriteria.length > 0) {
      setPasswordErrors(missingCriteria);
      return;
    } else {
      setPasswordErrors([]);
    }

    if (registerData.password !== registerData.passwordConfirmation) {
      setRegisterError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await registerUser(
        registerData.firstName,
        registerData.lastName,
        registerData.email,
        registerData.password,
        registerData.passwordConfirmation
      );
      localStorage.setItem("authToken", response.token);
      console.log("Inscription réussie, token :", response.token);
      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      });
      setRegisterError(null);
      setActiveTab("tab1");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setRegisterError("Échec de l'inscription. Essayez de nouveau.");
    }
  };

  const handleNoAccountClick = () => {
    setActiveTab("tab2");
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('Background.avif')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 w-full max-w-md md:max-w-4xl md:h-[fit] flex-col rounded-lg shadow-lg bg-white p-6 md:p-8">
        <Tabs.Root
          className="flex flex-col"
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <Tabs.List className="flex border-b mb-4">
            <Tabs.Trigger
              className={`flex-1 py-3 text-center cursor-pointer text-lg font-semibold ${
                activeTab === "tab1"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              value="tab1"
            >
              Se connecter
            </Tabs.Trigger>
            <Tabs.Trigger
              className={`flex-1 py-3 text-center cursor-pointer text-lg font-semibold ${
                activeTab === "tab2"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              value="tab2"
            >
              S'enregistrer
            </Tabs.Trigger>
          </Tabs.List>

          <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2 pr-0 md:pr-8">
              <Tabs.Content value="tab1">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Bienvenue sur Muzak !
                </h2>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="relative">
                    <label
                      className="block text-gray-600 mb-1"
                      htmlFor="loginEmail"
                    >
                      Email
                    </label>
                    <input
                      id="loginEmail"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-600 mb-1"
                      htmlFor="loginPassword"
                    >
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="loginPassword"
                        name="password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-2 border rounded-md pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onMouseDown={() => setShowLoginPassword(true)}
                        onMouseUp={() => setShowLoginPassword(false)}
                        onTouchStart={() => setShowLoginPassword(true)}
                        onTouchEnd={() => setShowLoginPassword(false)}
                      >
                        {showLoginPassword ? (
                          <EyeClosedIcon />
                        ) : (
                          <EyeOpenIcon />
                        )}
                      </button>
                    </div>
                  </div>

                  {loginError && <p className="text-red-500">{loginError}</p>}
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Se connecter
                  </button>
                </form>
                <p className="mt-4 text-center">
                  Vous n'avez pas de compte ?{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={handleNoAccountClick}
                  >
                    S'enregistrer ici.
                  </span>
                </p>
              </Tabs.Content>

              <Tabs.Content value="tab2">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Créez votre compte Muzak !
                </h2>
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="relative">
                    <label
                      className="block text-gray-600 mb-1"
                      htmlFor="firstName"
                    >
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-600 mb-1"
                      htmlFor="lastName"
                    >
                      Nom
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-600 mb-1"
                      htmlFor="registerEmail"
                    >
                      Email
                    </label>
                    <input
                      id="registerEmail"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    {emailError && (
                      <div className="text-red-500 text-sm">{emailError}</div>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      className="block text-gray-600 mb-1"
                      htmlFor="registerPassword"
                    >
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="registerPassword"
                        name="password"
                        type={showRegisterPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-2 border rounded-md pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onMouseDown={() => setShowRegisterPassword(true)}
                        onMouseUp={() => setShowRegisterPassword(false)}
                        onTouchStart={() => setShowRegisterPassword(true)}
                        onTouchEnd={() => setShowRegisterPassword(false)}
                      >
                        {showRegisterPassword ? (
                          <EyeClosedIcon />
                        ) : (
                          <EyeOpenIcon />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      className="block text-gray-600 mb-1"
                      htmlFor="passwordConfirmation"
                    >
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerData.passwordConfirmation}
                        onChange={handleRegisterChange}
                        className="w-full px-4 py-2 border rounded-md pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onMouseDown={() => setShowConfirmPassword(true)}
                        onMouseUp={() => setShowConfirmPassword(false)}
                        onTouchStart={() => setShowConfirmPassword(true)}
                        onTouchEnd={() => setShowConfirmPassword(false)}
                      >
                        {showConfirmPassword ? (
                          <EyeClosedIcon />
                        ) : (
                          <EyeOpenIcon />
                        )}
                      </button>
                    </div>
                  </div>
                  {passwordErrors.length > 0 && (
                    <div className="text-red-500 text-sm mt-1">
                      {passwordErrors.map((error, index) => (
                        <p key={index}>
                          Le mot de passe doit contenir {error}.
                        </p>
                      ))}
                    </div>
                  )}
                  {nameError && (
                    <div className="text-red-500 text-sm">{nameError}</div>
                  )}
                  {registerError && (
                    <p className="text-red-500">{registerError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    S'inscrire
                  </button>
                </form>
              </Tabs.Content>
            </div>

            <div className="hidden md:flex w-full md:w-1/2 items-center justify-center">
              <img
                src="MuzakPicture.webp"
                alt="Muzak Logo"
                className="object-cover w-full h-full rounded-md shadow-md"
              />
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default TabsDemo;
