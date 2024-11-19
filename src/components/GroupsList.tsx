import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { fetchGroupDetails, fetchInstruments, fetchGenres } from "../apiService";

interface GroupInstrument {
  instrumentId: number;
}

interface GroupGenre {
  genreId: number;
}

interface Group {
  id: number;
  name: string;
  createdAt: string;
  imageUrl?: string;
  groupInstruments: GroupInstrument[];
  groupGenres: GroupGenre[];
}

interface Instrument {
  id: number;
  instrument: string;
  count ?: number;
}

interface Genre {
  id: number;
  genre: string;
  count ?: number;
}

const GroupsList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [sortOrder, setSortOrder] = useState<"name" | "createdAt">("name");
  const [ascending, setAscending] = useState<boolean>(true);

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [filteredInstruments, setFilteredInstruments] = useState<Instrument[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<number[]>([]);
  
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filteredGenres, setFilteredGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  console.log(filteredGenres);
  console.log(filteredInstruments);

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

  useEffect(() => {
    const getInstruments = async () => {
      try {
        const fetchedInstruments = await fetchInstruments();
        setInstruments(fetchedInstruments);
      } catch (error) {
        console.error("Erreur lors de la récupération des instruments:", error);
      }
    };

    getInstruments();
  }, []);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error("Erreur lors de la récupération des genres:", error);
      }
    };

    getGenres();
  }, []);

  useEffect(() => {
    const instrumentCounts = groups.reduce((counts, group) => {
      group.groupInstruments.forEach((gi) => {
        counts[gi.instrumentId] = (counts[gi.instrumentId] || 0) + 1;
      });
      return counts;
    }, {} as Record<number, number>);

    const filtered = instruments
      .filter((instrument) => instrumentCounts[instrument.id]) 
      .map((instrument) => ({
        ...instrument,
        count: instrumentCounts[instrument.id] || 0,
      }));

    setFilteredInstruments(filtered);
  }, [groups, instruments]);

  useEffect(() => {
    const genreCounts = groups.reduce((counts, group) => {
      group.groupGenres.forEach((genre) => {
        counts[genre.genreId] = (counts[genre.genreId] || 0) + 1;
      });
      return counts;
    }, {} as Record<number, number>);

    const filtered = genres
      .filter((genre) => genreCounts[genre.id])
      .map((genre) => ({
        ...genre,
        count: genreCounts[genre.id] || 0, 
      }));

    setFilteredGenres(filtered);
  }, [groups, genres]);

  const filteredGroups = groups.filter((group) => {
    if (selectedInstruments.length > 0) {
      const groupInstrumentIds = group.groupInstruments.map((gi) => gi.instrumentId);
      if (!selectedInstruments.every((id) => groupInstrumentIds.includes(id))) {
        return false;
      }
    }

    if (selectedGenres.length > 0) {
      const groupGenreIds = group.groupGenres.map((gi) => gi.genreId);
      if (!selectedGenres.every((id) => groupGenreIds.includes(id))) {
        return false;
      }
    }

    return true;
  });

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
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Filtrer par instruments :</h2>
        <div className="flex flex-wrap gap-4">
          {filteredInstruments.map((instrument) => (
            <label key={instrument.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedInstruments.includes(instrument.id)}
                onChange={() => handleInstrumentFilterChange(instrument.id)}
                className="w-4 h-4"
              />
              {instrument.instrument} ({instrument.count})
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Filtrer par genres :</h2>
        <div className="flex flex-wrap gap-4">
          {filteredGenres.map((genre) => (
            <label key={genre.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreFilterChange(genre.id)}
                className="w-4 h-4"
              />
              {genre.genre} ({genre.count})
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedGroups.map((group) => (
          <Link
            to={`/groups/${group.id}`}
            key={group.id}
            className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={group.imageUrl || "https://via.placeholder.com/150"}
              alt={group.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{group.name}</h2>
              <p className="text-gray-500 text-sm">
                Créé le : {new Date(group.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">
                Instruments associés : {group.groupInstruments?.length || 0}
              </p>
              <p className="text-gray-500 text-sm">
                Genres associés : {group.groupGenres?.length || 0}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;