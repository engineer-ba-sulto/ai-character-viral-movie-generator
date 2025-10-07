import type { Character } from "@/types/character-animation";
import Image from "next/image";
import React from "react";
import { DownloadIcon, ZoomInIcon } from "./icons";

interface SavedCharactersProps {
  characters: Character[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview: (character: Character) => void;
}

const SavedCharacters: React.FC<SavedCharactersProps> = ({
  characters,
  selectedId,
  onSelect,
  onPreview,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-banana-dark mb-4">
        あなたのキャラクター
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => onSelect(char.id)}
            className={`group relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all duration-200 ${
              selectedId === char.id
                ? "border-banana-yellow"
                : "border-transparent hover:border-banana-yellow/50"
            }`}
            aria-label={`キャラクターを選択: ${char.description.substring(
              0,
              30
            )}`}
          >
            <Image
              src={`data:${char.image.mimeType};base64,${char.image.base64}`}
              alt={char.description}
              width={200}
              height={200}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Important: prevent onSelect from firing
                  onPreview(char);
                }}
                title="キャラクター詳細を表示"
                aria-label="キャラクター詳細を表示"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-90 bg-white/80 backdrop-blur-sm text-banana-dark p-2 rounded-full hover:bg-white"
              >
                <ZoomInIcon />
              </button>
              <a
                href={`data:${char.image.mimeType};base64,${char.image.base64}`}
                download={`nanobanana_character_${char.id}.png`}
                onClick={(e) => e.stopPropagation()}
                title="画像をダウンロード"
                aria-label="画像をダウンロード"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-90 bg-white/80 backdrop-blur-sm text-banana-dark p-2 rounded-full hover:bg-white"
              >
                <DownloadIcon />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCharacters;
