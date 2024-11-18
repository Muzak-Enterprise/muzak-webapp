import React from 'react';
import { useParams } from 'react-router-dom';

// Mise à jour des données pour inclure les membres et leurs instruments
const artists = [
  {
    id: 1,
    name: 'Artist 1',
    groupName: 'The Rockers',
    description: 'Description of Artist 1',
    imageUrl: 'https://via.placeholder.com/150',
    members: [
      { name: 'John Doe', instrument: 'Guitar' },
      { name: 'Jane Smith', instrument: 'Drums' },
      { name: 'Alice Johnson', instrument: 'Bass' }
    ]
  },
  {
    id: 2,
    name: 'Artist 2',
    groupName: 'The Blues Band',
    description: 'Description of Artist 2',
    imageUrl: 'https://via.placeholder.com/150',
    members: [
      { name: 'Mike Taylor', instrument: 'Vocals' },
      { name: 'Sara White', instrument: 'Keyboard' }
    ]
  },
  {
    id: 3,
    name: 'Artist 3',
    groupName: 'The Jazz Trio',
    description: 'Description of Artist 3',
    imageUrl: 'https://via.placeholder.com/150',
    members: [
      { name: 'David Green', instrument: 'Saxophone' },
      { name: 'Emily Brown', instrument: 'Piano' },
      { name: 'George Black', instrument: 'Drums' }
    ]
  },
  {
    id: 4,
    name: 'Artist 4',
    groupName: 'The Indie Band',
    description: 'Description of Artist 4',
    imageUrl: 'https://via.placeholder.com/150',
    members: [
      { name: 'Lucas King', instrument: 'Vocals' },
      { name: 'Sophia White', instrument: 'Guitar' },
      { name: 'Liam Harris', instrument: 'Bass' }
    ]
  }
];

const Artists: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const artist = artists.find((a) => a.id.toString() === id);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-48 h-48 object-cover rounded-full mb-4"
        />
        <h1 className="text-3xl font-bold">{artist.name}</h1>
        <p className="mt-4 text-lg text-gray-700">{artist.description}</p>
        
        <h2 className="mt-6 text-2xl font-semibold text-gray-800">{artist.groupName}</h2>
        <ul className="mt-4 space-y-2">
          {artist.members.map((member, index) => (
            <li key={index} className="text-lg text-gray-600">
              <strong>{member.name}</strong> - {member.instrument}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Artists;
