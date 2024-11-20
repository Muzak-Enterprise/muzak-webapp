import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { fetchGroupDetails } from "../apiService";
import Badge from "./Badge"; // Assurez-vous que le composant Badge est bien importé

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

const GroupsList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [sortOrder, setSortOrder] = useState<"name" | "createdAt">("name");
  const [ascending, setAscending] = useState<boolean>(true);

  const [filteredInstruments, setFilteredInstruments] = useState<FilteredInstrument[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<number[]>([]);

  const [filteredGenres, setFilteredGenres] = useState<FilteredGenre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>(""); // État pour la barre de recherche

  useEffect(() => {
    const getGroups = async () => {
      try {
        const fetchedGroups = await fetchGroupDetails();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Erreur lors de la récupération des groupes:", error);
      }
    };

    getGroups();
  }, []);

  // Mettre à jour les données filtrées (instruments et genres)
  const updateFilteredData = (filteredGroups: Group[]) => {
    const instrumentCounts = filteredGroups.reduce((counts, group) => {
      group.groupInstruments.forEach((gi) => {
        counts[gi.instrument.id] = (counts[gi.instrument.id] || 0) + 1;
      });
      return counts;
    }, {} as Record<number, number>);

    const updatedInstruments = filteredGroups.flatMap((group) =>
      group.groupInstruments.map((gi) => ({
        id: gi.instrument.id,
        instrument: gi.instrument.instrument,
        count: instrumentCounts[gi.instrument.id] || 0,
      }))
    );

    const uniqueInstruments = Array.from(
      new Map(updatedInstruments.map((item) => [item.id, item])).values()
    );

    setFilteredInstruments(uniqueInstruments);

    const genreCounts = filteredGroups.reduce((counts, group) => {
      group.groupGenres.forEach((genre) => {
        counts[genre.genre.id] = (counts[genre.genre.id] || 0) + 1;
      });
      return counts;
    }, {} as Record<number, number>);

    const updatedGenres = filteredGroups.flatMap((group) =>
      group.groupGenres.map((genre) => ({
        id: genre.genre.id,
        genre: genre.genre.genre,
        count: genreCounts[genre.genre.id] || 0,
      }))
    );

    const uniqueGenres = Array.from(
      new Map(updatedGenres.map((item) => [item.id, item])).values()
    );

    setFilteredGenres(uniqueGenres);
  };

  // Filtrer les groupes
  const filteredGroups = groups.filter((group) => {
    if (selectedInstruments.length > 0) {
      const groupInstrumentIds = group.groupInstruments.map((gi) => gi.instrument.id);
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
      prev.includes(instrumentId) ? prev.filter((id) => id !== instrumentId) : [...prev, instrumentId]
    );
  };

  const handleGenreFilterChange = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Liste des groupes</h1>

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
                    `${userGroup.user.firstName.toUpperCase()} ${userGroup.user.lastName}`
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
