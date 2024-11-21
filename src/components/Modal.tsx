interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
  }
  
  const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="bg-white w-full max-w-lg mx-auto rounded-lg shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
          <div>{children}</div>
        </div>
      </div>
    );
  };
  
  export default Modal;