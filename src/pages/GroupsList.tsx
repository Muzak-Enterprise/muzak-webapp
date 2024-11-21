import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  fetchGroupDetails,
  createGroup,
  fetchInstruments,
  fetchGenres,
} from "../apiService";
import Badge from "../components/Badge";
import Modal from "../components/Modal";

interface GroupInstrument {
  instrumentId: number;
  instrument: {
    id: number;
    instrument: string;
  };
}

interface GroupGenre {
  genreId: number;
  genre: {
    id: number;
    genre: string;
  };
}

interface Group {
  id: number;
  name: string;
  createdAt: string;
  groupInstruments: GroupInstrument[];
  groupGenres: GroupGenre[];
  userGroups: UserGroup[];
}

interface UserGroup {
  groupId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface FilteredInstrument {
  id: number;
  instrument: string;
  count: number;
}

interface FilteredGenre {
  id: number;
  genre: string;
  count: number;
}

interface Instruments {
  id: number;
  instrument: string;
}

interface Genres {
  id: number;
  genre: string;
}

const GroupsList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [sortOrder, setSortOrder] = useState<"name" | "createdAt">("name");
  const [ascending, setAscending] = useState<boolean>(true);

  const [instruments, setInstruments] = useState<Instruments[]>([]);
  const [genres, setGenres] = useState<Genres[]>([]);

  const [newGroupName, setNewGroupName] = useState<string>("");
  const [newGroupDescription, setNewGroupDescription] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const [filteredInstruments, setFilteredInstruments] = useState<
    FilteredInstrument[]
  >([]);
  const [selectedInstruments, setSelectedInstruments] = useState<number[]>([]);
  const [modalSelectedInstruments, setModalSelectedInstruments] = useState<
    number[]
  >([]);
  const [modalSelectedGenres, setModalSelectedGenres] = useState<number[]>([]);

  const [filteredGenres, setFilteredGenres] = useState<FilteredGenre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setNewGroupName("");
    setNewGroupDescription("");
    setModalSelectedInstruments([]);
    setModalSelectedGenres([]);
    setFormError(null);
    setFormSuccess(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedInstruments = await fetchInstruments();
        setInstruments(fetchedInstruments);

        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);

        const fetchedGroups = await fetchGroupDetails();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  const updateFilteredData = (filteredGroups: Group[]) => {
    const uniqueInstruments = Array.from(
      new Map(
        filteredGroups
          .flatMap((group) =>
            group.groupInstruments
              .filter((gi) => gi.instrument && gi.instrument.instrument)
              .map((gi) => ({
                id: gi.instrument.id,
                instrument: gi.instrument.instrument,
                count: filteredGroups.reduce(
                  (count, g) =>
                    count +
                    g.groupInstruments.filter(
                      (item) =>
                        item.instrument &&
                        item.instrument.id === gi.instrument.id
                    ).length,
                  0
                ),
              }))
          )
          .map((item) => [item.id, item])
      ).values()
    ).filter((item) => item.instrument);

    uniqueInstruments.sort((a, b) =>
      (a.instrument || "").localeCompare(b.instrument || "")
    );

    setFilteredInstruments(uniqueInstruments);

    const uniqueGenres = Array.from(
      new Map(
        filteredGroups
          .flatMap((group) =>
            group.groupGenres
              .filter((gg) => gg.genre && gg.genre.genre)
              .map((gg) => ({
                id: gg.genre.id,
                genre: gg.genre.genre,
                count: filteredGroups.reduce(
                  (count, g) =>
                    count +
                    g.groupGenres.filter(
                      (item) => item.genre && item.genre.id === gg.genre.id
                    ).length,
                  0
                ),
              }))
          )
          .map((item) => [item.id, item])
      ).values()
    ).filter((item) => item.genre);

    uniqueGenres.sort((a, b) => (a.genre || "").localeCompare(b.genre || ""));

    setFilteredGenres(uniqueGenres);
  };

  const filteredGroups = groups.filter((group) => {
    if (selectedInstruments.length > 0) {
      const groupInstrumentIds = group.groupInstruments.map(
        (gi) => gi.instrument.id
      );
      if (!selectedInstruments.every((id) => groupInstrumentIds.includes(id))) {
        return false;
      }
    }

    if (selectedGenres.length > 0) {
      const groupGenreIds = group.groupGenres.map((gi) => gi.genre.id);
      if (!selectedGenres.every((id) => groupGenreIds.includes(id))) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      return group.name.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGroupName.trim() || !newGroupDescription.trim()) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    if (
      modalSelectedInstruments.length === 0 ||
      modalSelectedGenres.length === 0
    ) {
      setFormError("Veuillez sélectionner au moins un instrument et un genre.");
      return;
    }

    try {
      const newGroup = {
        name: newGroupName,
        description: newGroupDescription,
        instruments: modalSelectedInstruments,
        genres: modalSelectedGenres,
      };

      await createGroup(newGroup);

      const updatedGroups = await fetchGroupDetails();
      setGroups(updatedGroups);

      setNewGroupName("");
      setNewGroupDescription("");
      setModalSelectedInstruments([]);
      setModalSelectedGenres([]);
      setFormError(null);
      setFormSuccess(true);

      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      setFormError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const handleSelectChange = (
    setter: React.Dispatch<React.SetStateAction<number[]>>,
    value: string[]
  ) => {
    const ids = value.map((id) => parseInt(id, 10));
    
    if (ids.length <= 3) {
      setter(ids);
    } else {
      alert("Vous ne pouvez sélectionner que 3 genres maximum.");
    }
  };

  useEffect(() => {
    updateFilteredData(filteredGroups);
  }, [groups, selectedInstruments, selectedGenres, searchQuery]);

  // Tri des groupes
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (sortOrder === "name") {
      return ascending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortOrder === "createdAt") {
      return ascending
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const handleSort = (order: "name" | "createdAt") => {
    if (sortOrder === order) {
      setAscending(!ascending);
    } else {
      setSortOrder(order);
      setAscending(true);
    }
  };

  const handleInstrumentFilterChange = (instrumentId: number) => {
    setSelectedInstruments((prev) =>
      prev.includes(instrumentId)
        ? prev.filter((id) => id !== instrumentId)
        : [...prev, instrumentId]
    );
  };

  const handleGenreFilterChange = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Créer un nouveau groupe</h2>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            {formSuccess && (
              <p className="text-green-500 mb-4">Groupe créé avec succès !</p>
            )}
            <form onSubmit={handleCreateGroup}>
              {/* Formulaire actuel */}
              <div className="mb-4">
                <label
                  htmlFor="groupName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom du groupe
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="groupDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="groupDescription"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="groupInstruments"
                  className="block text-sm font-medium text-gray-700"
                >
                  Instruments
                </label>
                <select
                  id="groupInstruments"
                  value={modalSelectedInstruments.map(String)}
                  onChange={(e) =>
                    handleSelectChange(
                      setModalSelectedInstruments,
                      Array.from(e.target.selectedOptions, (opt) => opt.value)
                    )
                  }
                  multiple
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {instruments.map((instrument) => (
                    <option key={instrument.id} value={instrument.id}>
                      {instrument.instrument}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="groupGenres"
                  className="block text-sm font-medium text-gray-700"
                >
                  Genres
                </label>
                <select
                  id="groupGenres"
                  value={modalSelectedGenres.map(String)}
                  onChange={(e) =>
                    handleSelectChange(
                      setModalSelectedGenres,
                      Array.from(e.target.selectedOptions, (opt) => opt.value)
                    )
                  }
                  multiple
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.genre}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Créer le groupe
              </button>
            </form>
          </div>
        </Modal>
      )}
      <div className="flex justify-around items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des groupes</h1>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Créer un groupe
        </button>
      </div>

      <div className="mb-6 text-center text-lg text-gray-600">
        {sortOrder === "createdAt"
          ? ascending
            ? "Du plus ancien au plus récent"
            : "Du plus récent au plus ancien"
          : ascending
          ? "De A à Z"
          : "De Z à A"}
      </div>

      <div className="flex flex-wrap justify-between mb-6 gap-4">
        <button
          onClick={() => handleSort("name")}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Trier par nom{" "}
          {sortOrder === "name" &&
            (ascending ? (
              <ChevronUpIcon className="inline-block" />
            ) : (
              <ChevronDownIcon className="inline-block" />
            ))}
        </button>
        <button
          onClick={() => handleSort("createdAt")}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Trier par date{" "}
          {sortOrder === "createdAt" &&
            (ascending ? (
              <ChevronUpIcon className="inline-block" />
            ) : (
              <ChevronDownIcon className="inline-block" />
            ))}
        </button>
        <input
          type="text"
          placeholder="Rechercher un groupe"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Filtrer par instruments :</h2>
        <div className="flex flex-wrap gap-4">
          {filteredInstruments.map((instrument) => (
            <Badge
              key={instrument.id}
              text={`${instrument.instrument} (${instrument.count})`}
              color={
                selectedInstruments.includes(instrument.id)
                  ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  : "bg-gray-300 hover:bg-gray-400 cursor-pointer"
              }
              onClick={() => handleInstrumentFilterChange(instrument.id)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Filtrer par genres :</h2>
        <div className="flex flex-wrap gap-4">
          {filteredGenres.map((genre) => (
            <Badge
              key={genre.id}
              text={`${genre.genre} (${genre.count})`}
              color={
                selectedGenres.includes(genre.id)
                  ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                  : "bg-gray-300 hover:bg-gray-400 cursor-pointer"
              }
              onClick={() => handleGenreFilterChange(genre.id)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sortedGroups.map((group) => (
          <Link
            to={`/groups/${group.id}`}
            key={group.id}
            className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-100"
          >
            <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
            <p className="text-sm text-gray-600">
              Créé le : {new Date(group.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Membres :{" "}
              {group.userGroups
                .map(
                  (userGroup) =>
                    `${userGroup.user.firstName.toUpperCase()} ${
                      userGroup.user.lastName
                    }`
                )
                .join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
