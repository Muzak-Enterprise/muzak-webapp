import React from 'react';
import { Link } from 'react-router-dom';

// Liste des artistes (tu pourrais récupérer ça d'une API par exemple)
const artists = [
  { id: 1, name: 'Artist 1', imageUrl: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Artist 2', imageUrl: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Artist 3', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 5', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Artist 4', imageUrl: 'https://via.placeholder.com/150' },
];

const ArtistList: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Artists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <Link
            to={`/artists/${artist.id}`}
            key={artist.id}
            className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{artist.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistList;
