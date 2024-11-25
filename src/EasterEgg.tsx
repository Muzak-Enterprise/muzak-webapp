import React, { useEffect, useState } from "react";

const EasterEgg: React.FC = () => {
  const [showImage, setShowImage] = useState(false);
  const [audio] = useState(new Audio("macron.mp3"));

  useEffect(() => {
    let currentInput: string[] = [];
    const keySequence = "macron";

    const handleKeyPress = (event: KeyboardEvent) => {
      currentInput.push(event.key);

      if (currentInput.join("") === keySequence) {
        setShowImage(true);
        audio.play(); 
        currentInput = [];

        setTimeout(() => {
          setShowImage(false);
        }, 2000); 
      }

      if (currentInput.length >= keySequence.length) {
        currentInput = [];
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [audio]);

  return (
    <>
      {showImage && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-50">
          <img
            src="macron.jpg"
            alt="Macron"
            className="transition-all transform scale-100 opacity-100 animate-grow"
          />
        </div>
      )}
    </>
  );
};

export default EasterEgg;
