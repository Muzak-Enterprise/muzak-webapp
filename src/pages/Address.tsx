import React, { useState, useEffect } from "react";
import { createAddress, fetchAddresses } from "../apiService";

const Address: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [addresses, setAddresses] = useState<any[]>([]);

  const fetchAndSetAddresses = async () => {
    try {
      const response = await fetchAddresses();
      setAddresses(response.addresses);
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses :", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !postcode || !city) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    try {
      const address = { name, postcode, city };
      const newAddress = await createAddress(address);

      setSuccess(true);
      setError(null);

      const updatedAddresses = await fetchAddresses();
      if (updatedAddresses && updatedAddresses.addresses) {
        setAddresses(updatedAddresses.addresses);
      }
    } catch (err) {
      setError("Erreur lors de la création de l'adresse.");
      console.error("Erreur lors de la création de l'adresse : ", err);
    }
  };

  useEffect(() => {
    fetchAndSetAddresses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="w-full md:w-2/3 mb-8 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Liste des adresses
          </h1>
          {addresses.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Nom
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Code Postal
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Ville
                  </th>
                </tr>
              </thead>
              <tbody>
                {addresses.map((address) => (
                  <tr key={address.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {address.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {address.postcode}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {address.city}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-700">
              Aucune adresse disponible pour le moment.
            </p>
          )}
        </div>

        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Créer une adresse
          </h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 mb-4">Adresse créée avec succès!</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nom de l'adresse
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="postcode"
                className="block text-sm font-medium text-gray-700"
              >
                Code Postal
              </label>
              <input
                type="text"
                id="postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Ville
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Créer l'adresse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Address;
