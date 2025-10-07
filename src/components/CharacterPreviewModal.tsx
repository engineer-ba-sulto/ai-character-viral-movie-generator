import type { Character } from "@/types/character-animation";
import Image from "next/image";
import React from "react";
import { DownloadIcon } from "./icons";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface CharacterPreviewModalProps {
  character: Character | null;
  onClose: () => void;
}

const CharacterPreviewModal: React.FC<CharacterPreviewModalProps> = ({
  character,
  onClose,
}) => {
  if (!character) {
    return null;
  }

  const imageUrl = `data:${character.image.mimeType};base64,${character.image.base64}`;

  return (
    <Dialog open={!!character} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full p-0">
        <div className="relative w-full aspect-[9/16] bg-muted rounded-t-lg mb-4 overflow-hidden">
          <Image
            src={imageUrl}
            alt={character.description}
            width={400}
            height={600}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-4 right-4">
            <Button
              asChild
              variant="secondary"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <a
                href={imageUrl}
                download={`nanobanana_character_${character.id}.png`}
                aria-label="画像をダウンロード"
                title="画像をダウンロード"
              >
                <DownloadIcon />
              </a>
            </Button>
          </div>
        </div>
        <DialogHeader className="px-6 pb-6">
          <DialogTitle className="text-lg font-bold text-foreground mb-2">
            キャラクター設定
          </DialogTitle>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                画風
              </p>
              <p className="text-foreground bg-accent p-2 rounded-md">
                {character.style}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                特徴
              </p>
              <p className="text-foreground bg-accent p-2 rounded-md max-h-40 overflow-y-auto">
                {character.description}
              </p>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterPreviewModal;
