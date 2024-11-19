import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupById } from '../apiService';

interface Group {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  members: { name: string; instrument: string }[];
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
            imageUrl: data.imageUrl || 'https://via.placeholder.com/150',
            members: data.userGroups.map((ug: any) => ({
              name: `User ${ug.userId}`,
              instrument: `Instrument ID ${ug.groupId}`,
            })),
          });
        })
        .catch((err) => setError('Erreur lors du chargement des détails du groupe.'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!group) {
    return <div>Groupe introuvable</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <img
          src={group.imageUrl}
          alt={group.name}
          className="w-48 h-48 object-cover rounded-full mb-4"
        />
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <p className="mt-4 text-lg text-gray-700">{group.description}</p>
        
        <h2 className="mt-6 text-2xl font-semibold text-gray-800">{group.name}</h2>
        <ul className="mt-4 space-y-2">
          {group.members.map((member, index) => (
            <li key={index} className="text-lg text-gray-600">
              <strong>{member.name}</strong> - {member.instrument}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Groups;
