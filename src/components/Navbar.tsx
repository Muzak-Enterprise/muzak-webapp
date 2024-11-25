import React from "react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { FaceIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { fetchUserDetails } from "../apiService";

const Navbar: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await fetchUserDetails();
        if (userDetails && userDetails.firstName) {
          setFirstName(userDetails.firstName);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails utilisateur:",
          error
        );
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    setFirstName(null);
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4 shadow-md">
      <div className="text-white text-2xl font-bold">
        <img src="MuzakLogo.png" alt="Muzak Logo" className="h-14"/>
      </div>

      <div className="hidden md:flex space-x-6">
        <Link to="/groups">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Groupes
          </button>
        </Link>
        <Link to="/reservations">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Réservations
          </button>
        </Link>
        <Link to="/address">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Adresses
          </button>
        </Link>
        {firstName ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <button className="flex items-center text-white hover:bg-gray-700 px-3 py-2 rounded">
                <FaceIcon className="mr-2" />
                {firstName}
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="text-white hover:bg-red-600 px-3 py-2 rounded bg-red-500"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
              Se connecter
            </button>
          </Link>
        )}
      </div>

      {/* Menu Burger */}
      <div className="md:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <button className="text-white hover:bg-gray-700 p-2 rounded">
              <HamburgerMenuIcon className="h-6 w-6" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-gray-800 text-white rounded-md shadow-lg p-2">
            <DropdownMenu.Item>
              <Link
                to="/groups"
                className="block px-4 py-2 hover:bg-gray-700 rounded"
              >
                Groupes
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link
                to="/reservations"
                className="block px-4 py-2 hover:bg-gray-700 rounded"
              >
                Réservations
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link to="/address">
                <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
                  Adresses
                </button>
              </Link>
            </DropdownMenu.Item>
            {firstName ? (
              <>
                <DropdownMenu.Item>
                  <Link to="/profile">
                    <button className="flex items-center text-white hover:bg-gray-700 px-3 py-2 rounded">
                      <FaceIcon className="mr-2" />
                      {firstName}
                    </button>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-600 rounded bg-red-500"
                  >
                    Se déconnecter
                  </button>
                </DropdownMenu.Item>
              </>
            ) : (
              <DropdownMenu.Item>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-gray-700 rounded"
                >
                  Se connecter
                </Link>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </nav>
  );
};

export default Navbar;
