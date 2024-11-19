import React from "react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
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
        <Link to="/">
          <img src="MuzakLogo.png" alt="Muzak Logo" className="h-14 " />
        </Link>
      </div>

      <div className="hidden md:flex space-x-6">
        <Link to="/">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Home
          </button>
        </Link>
        <Link to="/artists">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Artists
          </button>
        </Link>
        <Link to="/bars">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Bars
          </button>
        </Link>
        <Link to="/reservations">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
            Reservations
          </button>
        </Link>
        {firstName ? (
          <div className="flex items-center space-x-4">
            <span className="text-white">Bienvenue, {firstName}!</span>
            <button
              onClick={handleLogout}
              className="text-white hover:bg-red-600 px-3 py-2 rounded bg-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Menu Burger*/}
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
                to="/"
                className="block px-4 py-2 hover:bg-gray-700 rounded"
              >
                Home
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link
                to="/artists"
                className="block px-4 py-2 hover:bg-gray-700 rounded"
              >
                Artists
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link
                to="/bars"
                className="block px-4 py-2 hover:bg-gray-700 rounded"
              >
                Bars
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link
                to="/reservations"
                className="block px-4 py-2 hover:bg-gray-700 rounded"
              >
                Reservations
              </Link>
            </DropdownMenu.Item>
            {firstName ? (
              <>
                <DropdownMenu.Item>
                  <span className="block px-4 py-2 rounded">
                    Bienvenue, {firstName}
                  </span>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-red-600 rounded bg-red-500"
                  >
                    Logout
                  </button>
                </DropdownMenu.Item>
              </>
            ) : (
              <DropdownMenu.Item>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-gray-700 rounded"
                >
                  Login
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
