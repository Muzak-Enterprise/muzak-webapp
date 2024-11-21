import React, { useState, useEffect } from "react";
import { createReservation, fetchAddresses, fetchGroupDetails } from "../apiService";

const Reservations: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [groupId, setGroupId] = useState<number | string>("");  // Initialisation comme string pour la gestion des valeurs vides
  const [addressId, setAddressId] = useState<number | string>("");  // Initialisation comme string pour la gestion des valeurs vides
  const [date, setDate] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchAddressesList = async () => {
      try {
        const response = await fetchAddresses();
        setAddresses(response.addresses || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des adresses :", error);
      }
    };

    const fetchGroupsList = async () => {
      try {
        const fetchedGroups = await fetchGroupDetails();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Erreur lors de la récupération des groupes:", error);
      }
    };

    fetchAddressesList();
    fetchGroupsList();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupId || !addressId || !date || !duration) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    const numericGroupId = Number(groupId);
    const numericAddressId = Number(addressId);

    if (isNaN(numericGroupId) || isNaN(numericAddressId)) {
      setError("Les IDs de groupe et d'adresse doivent être des nombres.");
      return;
    }

    const selectedDate = new Date(date);

    const reservation = {
      groupId: numericGroupId,    
      addressId: numericAddressId, 
      date: selectedDate.toISOString(),
      duration: duration,
    };

    try {
      await createReservation(reservation);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la création de la réservation.");
      console.error("Erreur lors de la création de la réservation :", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Créer une Réservation
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && (
        <p className="text-green-500 mb-4">Réservation créée avec succès !</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="groupId"
            className="block text-sm font-medium text-gray-700"
          >
            Sélectionner le groupe
          </label>
          {groups.length === 0 ? (
            <p>Chargement des groupes...</p>
          ) : (
            <select
              id="groupId"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Choisir un groupe</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="addressId"
            className="block text-sm font-medium text-gray-700"
          >
            Sélectionner l'adresse
          </label>
          <select
            id="addressId"
            value={addressId}
            onChange={(e) => setAddressId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Choisir une adresse</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.name} - {address.city}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date de la réservation
          </label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Durée (en heures)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            min={1}
            max={3}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          Réserver
        </button>
      </form>
    </div>
  );
};

export default Reservations;