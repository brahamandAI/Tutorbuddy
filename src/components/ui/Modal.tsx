import React, { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({ open, onClose, title, children }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-6 relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {title && <div className="text-lg font-bold mb-4">{title}</div>}
        {children}
      </div>
    </div>
  );
}; 