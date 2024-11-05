import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        navigate('/bars');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate]);

  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4 shadow-md">
      {/* Logo Section */}
      <div className="text-white text-2xl font-bold">
        <Link to="/">Booking Platform</Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        <Link to="/">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">Home</button>
        </Link>
        <Link to="/artists">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">Artists</button>
        </Link>
        <Link to="/bars">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">Bars</button>
        </Link>
        <Link to="/reservations">
          <button className="text-white hover:bg-gray-700 px-3 py-2 rounded">Reservations</button>
        </Link>
      </div>

      {/* Mobile Navigation (Hamburger Menu) */}
      <div className="md:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="text-white hover:bg-gray-700 p-2 rounded">
              ☰
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-gray-800 text-white rounded-md shadow-lg p-2">
            <DropdownMenu.Item>
              <Link to="/" className="block px-4 py-2 hover:bg-gray-700 rounded">Home</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link to="/artists" className="block px-4 py-2 hover:bg-gray-700 rounded">Artists</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link to="/bars" className="block px-4 py-2 hover:bg-gray-700 rounded">Bars</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link to="/reservations" className="block px-4 py-2 hover:bg-gray-700 rounded">Reservations</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </nav>
  );
};

export default Navbar;