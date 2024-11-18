import React, { useState, ChangeEvent, FormEvent } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { EyeOpenIcon, EyeClosedIcon, HomeIcon } from "@radix-ui/react-icons";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const passwordCriteria = {
  minLength: 8,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

const validatePassword = (password: string) => {
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
  if (!passwordCriteria.special.test(password)) {
    missingCriteria.push("au moins un caractère spécial (ex : @, #, $)");
  }

  return missingCriteria;
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
    confirmPassword: "",
  });
  const [submittedData, setSubmittedData] = useState<
    (LoginData | RegisterData)[]
  >([]);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [activeTab, setActiveTab] = useState("tab1");

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

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setLoginError("Merci de remplir tous les champs.");
      return;
    }
    console.log("Formulaire de connexion soumis :", loginData);
    setSubmittedData((prev) => [...prev, { type: "login", ...loginData }]);
    setLoginData({ email: "", password: "" });
  };

  const handleRegisterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !registerData.firstName ||
      !registerData.lastName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setRegisterError("Merci de remplir tous les champs.");
      return;
    }

    const missingCriteria = validatePassword(registerData.password);
    if (missingCriteria.length > 0) {
      setPasswordErrors(missingCriteria);
      return;
    } else {
      setPasswordErrors([]);
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Les mots de passe ne correspondent pas.");
      return;
    }

    console.log("Formulaire d'enregistrement soumis :", registerData);
    setSubmittedData((prev) => [
      ...prev,
      { type: "register", ...registerData },
    ]);
    setRegisterData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleNoAccountClick = () => {
    setActiveTab("tab2");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Tabs.Root
        className="flex w-full max-w-md md:max-w-4xl md:h-[fit] flex-col rounded-lg shadow-lg bg-white p-6 md:p-8"
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
                  <input
                    id="loginPassword"
                    name="password"
                    type={showLoginPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2"
                    onMouseDown={() => setShowLoginPassword(true)}
                    onMouseUp={() => setShowLoginPassword(false)}
                    onTouchStart={() => setShowLoginPassword(true)}
                    onTouchEnd={() => setShowLoginPassword(false)}
                  >
                    {showLoginPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
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
                Crée ton compte Muzak !
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
                </div>
                <div className="relative">
                  <label
                    className="block text-gray-600 mb-1"
                    htmlFor="registerPassword"
                  >
                    Mot de passe
                  </label>
                  <input
                    id="registerPassword"
                    name="password"
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2"
                    onMouseDown={() => setShowRegisterPassword(true)}
                    onMouseUp={() => setShowRegisterPassword(false)}
                    onTouchStart={() => setShowRegisterPassword(true)}
                    onTouchEnd={() => setShowRegisterPassword(false)}
                  >
                    {showRegisterPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                <div className="relative">
                  <label
                    className="block text-gray-600 mb-1"
                    htmlFor="confirmPassword"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2"
                    onMouseDown={() => setShowConfirmPassword(true)}
                    onMouseUp={() => setShowConfirmPassword(false)}
                    onTouchStart={() => setShowConfirmPassword(true)}
                    onTouchEnd={() => setShowConfirmPassword(false)}
                  >
                    {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {passwordErrors.length > 0 && (
                  <ul className="text-red-500">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
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
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
        >
          <HomeIcon width="20px" height="20px" className="mr-2" />
          <span className="text-lg">Revenir à la page d'accueil</span>
        </button>
      </div>
    </div>
  );
};

export default TabsDemo;
