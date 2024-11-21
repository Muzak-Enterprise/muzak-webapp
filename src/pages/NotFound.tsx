import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">404 - Page non trouvée</h1>
      <p className="text-lg">Désolé, la page que vous recherchez n'existe pas.</p>
    </div>
  );
};

export default NotFound;
