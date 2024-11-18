import React from 'react';
import BarList from '../components/BarList';
import { fetchInstruments } from '../apiService';
import { useState, useEffect } from 'react';


const Bars: React.FC = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInstruments = async () => {
      try {
        setLoading(true);
        const data = await fetchInstruments();
        setInstruments(data);
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    getInstruments();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  
  return (
    <div>
      <h1>Bars</h1>
      {instruments.map((instrument: any, index: number) => (
          <li key={index} className="py-2 border-b">
            {instrument.name} - {instrument.type}
          </li>
        ))}
      <BarList />
    </div>
  );
};

export default Bars;