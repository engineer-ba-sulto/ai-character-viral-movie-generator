import React from 'react';
import { ZoomInIcon, DownloadIcon } from './icons';

interface ImageCardProps {
  base64Image: string;
  onPreview?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ base64Image, onPreview }) => {
  const imageUrl = `data:image/png;base64,${base64Image}`;

  return (
    <div
      className="group relative rounded-lg overflow-hidden aspect-square cursor-pointer"
      onClick={onPreview}
    >
      <img
        src={imageUrl}
        alt="Generated scene"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2">
        {/* Preview Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onPreview) {
              onPreview();
            }
          }}
          title="シーンをプレビュー"
          aria-label="シーンをプレビュー"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-90 bg-white/80 backdrop-blur-sm text-banana-dark p-2 rounded-full hover:bg-white"
        >
          <ZoomInIcon />
        </button>

        {/* Download Link as a Button */}
        <a
          href={imageUrl}
          download={`nanobanana_scene_${Date.now()}.png`}
          onClick={(e) => e.stopPropagation()} // Prevent modal from opening
          title="画像をダウンロード"
          aria-label="画像をダウンロード"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-90 bg-white/80 backdrop-blur-sm text-banana-dark p-2 rounded-full hover:bg-white"
        >
          <DownloadIcon />
        </a>
      </div>
    </div>
  );
};

export default ImageCard;
