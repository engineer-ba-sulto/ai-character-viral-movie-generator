import type { Character } from "@/types/character-animation";
import Image from "next/image";
import React from "react";
import { CloseIcon, DownloadIcon } from "./icons";

interface CharacterPreviewModalProps {
  character: Character | null;
  onClose: () => void;
}

const CharacterPreviewModal: React.FC<CharacterPreviewModalProps> = ({
  character,
  onClose,
}) => {
  // Effect to handle Escape key press
  React.useEffect(() => {
    if (!character) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, character]);

  if (!character) {
    return null;
  }

  const imageUrl = `data:${character.image.mimeType};base64,${character.image.base64}`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-preview-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-4 md:p-6 relative max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-banana-gray hover:text-banana-dark transition-colors z-10"
          aria-label="閉じる"
        >
          <CloseIcon />
        </button>
        <div className="relative w-full aspect-[9/16] bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <Image
            src={imageUrl}
            alt={character.description}
            width={400}
            height={600}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-4 right-4">
            <a
              href={imageUrl}
              download={`nanobanana_character_${character.id}.png`}
              className="bg-white/80 backdrop-blur-sm text-banana-dark p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg flex items-center gap-2"
              aria-label="画像をダウンロード"
              title="画像をダウンロード"
            >
              <DownloadIcon />
            </a>
          </div>
        </div>
        <div>
          <h3
            id="character-preview-title"
            className="text-lg font-bold text-banana-dark mb-2"
          >
            キャラクター設定
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-banana-gray">画風</p>
              <p className="text-banana-dark bg-banana-light p-2 rounded-md">
                {character.style}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-banana-gray">特徴</p>
              <p className="text-banana-dark bg-banana-light p-2 rounded-md max-h-40 overflow-y-auto">
                {character.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CharacterPreviewModal;
