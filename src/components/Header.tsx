import { Button } from "@/components/ui/button";
import React from "react";

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <Button
          variant="ghost"
          onClick={onHomeClick}
          className="flex items-center h-auto p-2 -m-2 text-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="ホームに戻る"
        >
          <div className="text-3xl font-bold text-primary-foreground bg-primary rounded-full h-12 w-12 flex items-center justify-center font-mono flex-shrink-0">
            n
          </div>
          <h1 className="text-2xl md:text-3xl font-bold ml-4">
            nanobanana{" "}
            <span className="text-muted-foreground font-normal">AI</span>
          </h1>
        </Button>
      </div>
    </header>
  );
};

export default Header;
