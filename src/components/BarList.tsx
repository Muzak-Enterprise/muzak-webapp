import React from 'react';

const bars = [
  { id: 1, name: 'Bar 1' },
  { id: 2, name: 'Bar 2' },
  { id: 3, name: 'Bar 3' },
];

const BarList: React.FC = () => {
  return (
    <ul>
      {bars.map((bar) => (
        <li key={bar.id}>{bar.name}</li>
      ))}
    </ul>
  );
};

export default BarList;
