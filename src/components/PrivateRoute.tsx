import React from "react";
import Modal from "./PrivateModal";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  if (!token) {
    return (
      <Modal isOpen={true}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Connexion requise</h2>
          <p className="mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Aller à la page de connexion
          </button>
        </div>
      </Modal>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;