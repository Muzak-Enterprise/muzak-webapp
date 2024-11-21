import React, { useEffect, useState } from "react";
import { fetchUserDetails, fetchGroupById, updateUser } from "../apiService";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string;
  userGroups: { groupId: number }[];
  reservations: { id: number; groupId: number; date: string }[];
}

interface Group {
  id: number;
  name: string;
  members: { id: number; name: string }[];
}

type UserProfileField = keyof UserProfile;

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedField, setEditedField] = useState<UserProfileField | null>(null);
  const [updatedUser, setUpdatedUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

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
          userGroups: userData.userGroups,
          reservations: userData.reservations,
        });
        setUpdatedUser(userData);
        return Promise.all(
          userData.userGroups.map(async (group: any) => {
            const groupDetails = await fetchGroupById(group.groupId.toString());
            return groupDetails;
          })
        );
      })
      .then((groupDetails) => {
        setGroups(groupDetails);
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

  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={user.profileImageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600 text-lg">{user.email}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Informations</h3>
          <div className="space-y-4">
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
          </div>
        </div>

        {isEditing && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-6 rounded-md"
              >
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Groupes :</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => handleGroupClick(group.id)}
                >
                  <h4 className="text-lg font-semibold text-gray-800">{group.name}</h4>
                  <ul className="mt-2 text-sm text-gray-600">
                    {group.members?.map((member: { id: number; name: string }) => (
                      <li key={member.id}>{member.name}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Vous n'êtes membre d'aucun groupe.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Réservations :</h3>
          <ul className="mt-4 space-y-2">
            {user.reservations.map((reservation) => (
              <li key={reservation.id} className="text-gray-800">
                Réservation pour le groupe {reservation.groupId} à la date{" "}
                {new Date(reservation.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
