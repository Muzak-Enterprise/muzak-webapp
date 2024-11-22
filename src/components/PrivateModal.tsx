import React from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const PrivateModal: React.FC<ModalProps> = ({ isOpen, children }) => {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PrivateModal;
