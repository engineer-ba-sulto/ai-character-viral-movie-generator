import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <button 
          onClick={onHomeClick} 
          className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-banana-yellow rounded-lg -m-2 p-2"
          aria-label="ホームに戻る"
        >
          <div className="text-3xl font-bold text-banana-yellow bg-banana-dark rounded-full h-12 w-12 flex items-center justify-center font-mono flex-shrink-0">
            n
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-banana-dark ml-4">
            nanobanana <span className="text-banana-gray font-normal">AI</span>
          </h1>
        </button>
      </div>
    </header>
  );
};

export default Header;