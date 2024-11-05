import React from 'react';

const artists = [
  { id: 1, name: 'Artist 1' },
  { id: 2, name: 'Artist 2' },
  { id: 3, name: 'Artist 3' },
];

const ArtistList: React.FC = () => {
  return (
    <ul>
      {artists.map((artist) => (
        <li key={artist.id}>{artist.name}</li>
      ))}
    </ul>
  );
};

export default ArtistList;
