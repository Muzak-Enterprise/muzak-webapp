import React, { useEffect, useState } from "react";
import { fetchUserDetails, updateUser } from "../apiService";
import { Pencil1Icon, ResetIcon } from "@radix-ui/react-icons";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string;
}

type UserProfileField = keyof UserProfile;

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedField, setEditedField] = useState<UserProfileField | null>(null);
  const [updatedUser, setUpdatedUser] = useState<UserProfile | null>(null);

  // Gestion de l'état pour réinitialiser le mot de passe
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchUserDetails()
      .then((userData) => {
        setUser({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          profileImageUrl: userData.profileImageUrl || "https://via.placeholder.com/150",
        });
        setUpdatedUser(userData);
      })
      .catch(() => setError("Erreur lors du chargement des données utilisateur."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleEdit = (field: UserProfileField) => {
    setIsEditing(true);
    setEditedField(field);
  };

  const handleSave = () => {
    if (updatedUser && editedField) {
      updateUser(updatedUser.id, updatedUser)
        .then((updatedUserData) => {
          setUser(updatedUserData);
          setIsEditing(false);
          setEditedField(null);
        })
        .catch(() => setError("Erreur lors de la mise à jour des données."));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedUser && editedField) {
      setUpdatedUser({
        ...updatedUser,
        [editedField]: e.target.value,
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "oldPassword") {
      setOldPassword(e.target.value);
    } else if (e.target.name === "password") {
      setNewPassword(e.target.value);
    } else if (e.target.name === "passwordConfirmation") {
      setConfirmPassword(e.target.value);
    }
  };

  const handlePasswordReset = () => {
    if (newPassword === confirmPassword) {
      setPasswordError("");

      if (updatedUser) {
        // Préparer les données pour la requête PATCH
        const updatedData = {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          oldPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        };

        updateUser(updatedUser.id, updatedData)
          .then((updatedUserData) => {
            setUser(updatedUserData);
            setIsResettingPassword(false); // Fermer le formulaire après la mise à jour
          })
          .catch(() => setError("Erreur lors de la mise à jour du mot de passe."));
      }
    } else {
      setPasswordError("Les mots de passe ne correspondent pas.");
    }
  };

  if (isLoading) {
    return <div className="text-center text-xl font-semibold">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center text-gray-500">Profil utilisateur introuvable</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.profileImageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800">
            {user.firstName} {user.lastName}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Prénom */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Prénom :</span>
            {isEditing && editedField === "firstName" ? (
              <input
                type="text"
                value={updatedUser?.firstName || ""}
                onChange={handleChange}
                className="border p-2 rounded-md text-gray-900"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-900">{user.firstName}</span>
                <button
                  className="text-gray-500 hover:text-gray-700 transition"
                  aria-label="Modifier le prénom"
                  onClick={() => handleEdit("firstName")}
                >
                  <Pencil1Icon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Nom */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Nom :</span>
            {isEditing && editedField === "lastName" ? (
              <input
                type="text"
                value={updatedUser?.lastName || ""}
                onChange={handleChange}
                className="border p-2 rounded-md text-gray-900"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-900">{user.lastName}</span>
                <button
                  className="text-gray-500 hover:text-gray-700 transition"
                  aria-label="Modifier le nom"
                  onClick={() => handleEdit("lastName")}
                >
                  <Pencil1Icon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Email :</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900">{user.email}</span>
            </div>
          </div>

          {/* Mot de passe */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Mot de passe :</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900">*****</span>
              <button
                className="text-blue-600 hover:text-blue-700 transition font-medium"
                onClick={() => setIsResettingPassword(true)}
                aria-label="Réinitialiser le mot de passe"
              >
                <ResetIcon className="w-5 h-5" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Formulaire de réinitialisation du mot de passe */}
        {isResettingPassword && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="oldPassword" className="text-gray-700">
                Ancien mot de passe
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={oldPassword}
                onChange={handlePasswordChange}
                className="border p-2 rounded-md text-gray-900"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={newPassword}
                onChange={handlePasswordChange}
                className="border p-2 rounded-md text-gray-900"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="passwordConfirmation" className="text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                value={confirmPassword}
                onChange={handlePasswordChange}
                className="border p-2 rounded-md text-gray-900"
              />
            </div>

            {passwordError && (
              <div className="text-red-500 text-sm mt-2">{passwordError}</div>
            )}

            <button
              onClick={handlePasswordReset}
              className="w-full bg-blue-600 text-white py-2 rounded-md mt-4"
            >
              Réinitialiser le mot de passe
            </button>
          </div>
        )}

        {/* Bouton de sauvegarde */}
        {isEditing && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="w-full bg-green-600 text-white py-2 rounded-md"
            >
              Sauvegarder les modifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
