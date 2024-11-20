import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGroupById } from "../apiService";
import Badge from "../components/Badge";

interface Group {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  members: { name: string; instrument: string }[];
  genres: string[];
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
          setGroup({
            id: data.id,
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl || "https://via.placeholder.com/150",
            members: data.userGroups.map((ug: any) => ({
              name: `User ${ug.userId}`,
              instrument: `Instrument ID ${ug.groupId}`,
            })),
            genres: data.groupGenres.map((gg: any) => `Genre ${gg.genre}`),
          });
        })
        .catch((err) =>
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
        {/* Image du groupe */}
        <img
          src={group.imageUrl}
          alt={group.name}
          className="w-48 h-48 object-cover rounded-full mb-4"
        />
        {/* Nom et description */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.name}</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          {group.description}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-6">
          {group.genres.map((genre, index) => (
            <Badge
              key={index}
              text={genre}
              color="bg-blue-500 hover:bg-blue-600"
              onClick={() => {}}
            />
          ))}
        </div>

        {/* Membres */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Membres du groupe
        </h2>
        <ul className="w-full max-w-md space-y-4">
          {group.members.map((member, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <span className="text-lg font-medium text-gray-800">
                {member.name}
              </span>
              <span className="text-sm text-gray-600">{member.instrument}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Groups;
