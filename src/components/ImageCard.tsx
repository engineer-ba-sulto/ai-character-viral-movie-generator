import Image from "next/image";
import React from "react";
import { DownloadIcon, ZoomInIcon } from "./icons";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ImageCardProps {
  base64Image: string;
  onPreview?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ base64Image, onPreview }) => {
  const imageUrl = `data:image/png;base64,${base64Image}`;

  return (
    <Card
      className="group relative overflow-hidden aspect-square cursor-pointer border-0"
      onClick={onPreview}
    >
      <CardContent className="p-0">
        <Image
          src={imageUrl}
          alt="Generated scene"
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2">
          {/* Preview Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (onPreview) {
                onPreview();
              }
            }}
            title="シーンをプレビュー"
            aria-label="シーンをプレビュー"
            variant="secondary"
            size="icon"
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ZoomInIcon />
          </Button>

          {/* Download Link as a Button */}
          <Button
            asChild
            variant="secondary"
            size="icon"
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <a
              href={imageUrl}
              download={`nanobanana_scene_${Date.now()}.png`}
              onClick={(e) => e.stopPropagation()} // Prevent modal from opening
              title="画像をダウンロード"
              aria-label="画像をダウンロード"
            >
              <DownloadIcon />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
