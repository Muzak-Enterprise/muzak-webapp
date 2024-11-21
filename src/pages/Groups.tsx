import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupById } from "../apiService";
import Badge from "../components/Badge";

interface Group {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  userGroups: {
    id: number;
    user: { id: number; firstName: string; lastName: string; email: string };
  }[];
  groupInstruments: {
    id: number;
    instrument: { id: number; instrument: string };
  }[];
  groupGenres: { id: number; genre: { id: number; genre: string } }[];
  reservations: {
    id: number;
    groupId: number;
    userId: number;
    addressId: number;
    date: string;
    duration: number;
    status: string;
  }[];
}

const Groups: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchGroupById(id)
        .then((data) => {
          setGroup(data);
        })
        .catch(() =>
          setError("Erreur lors du chargement des détails du groupe.")
        )
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center text-xl font-semibold">Chargement...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!group) {
    return <div className="text-center text-gray-500">Groupe introuvable</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.name}</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          {group.description}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Créé le : {new Date(group.createdAt).toLocaleDateString()}
        </p>

        <div className="mb-6 w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Genres associés
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {group.groupGenres.map((gg) => (
              <Badge
                key={gg.id}
                text={gg.genre.genre}
                color="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        <div className="mb-6 w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Instruments joués
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {group.groupInstruments.map((gi) => (
              <Badge
                key={gi.id}
                text={gi.instrument.instrument}
                color="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        <div className="mb-6 w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Membres du groupe
          </h2>
          <ul className="w-full max-w-md space-y-4 mx-auto">
            {group.userGroups.map((ug) => (
              <li
                key={ug.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <span className="text-lg font-medium text-gray-800">
                  {ug.user.firstName} {ug.user.lastName}
                </span>
                <span className="text-sm text-gray-600">{ug.user.email}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section pour afficher les réservations */}
        <div className="mb-6 w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Réservations
          </h2>
          <div className="w-full max-w-md space-y-4 mx-auto">
            {group.reservations.length === 0 ? (
              <p>Aucune réservation pour ce groupe.</p>
            ) : (
              group.reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {new Date(reservation.date).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Durée : {reservation.duration} heure(s)
                  </span>
                  <span className="text-sm text-gray-600">
                    Statut : {reservation.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
