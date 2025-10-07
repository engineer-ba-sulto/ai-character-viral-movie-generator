import React from "react";
import { CloseIcon, DownloadIcon } from "./icons";

interface ScenePreviewModalProps {
  imageBase64: string | null;
  onClose: () => void;
}

const ScenePreviewModal: React.FC<ScenePreviewModalProps> = ({
  imageBase64,
  onClose,
}) => {
  // Effect to handle Escape key press
  React.useEffect(() => {
    if (!imageBase64) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, imageBase64]);

  if (!imageBase64) {
    return null;
  }

  const imageUrl = `data:image/png;base64,${imageBase64}`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scene-preview-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-4 md:p-6 relative max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-banana-gray hover:text-banana-dark transition-colors z-20 bg-white/50 backdrop-blur-sm rounded-full p-1"
          aria-label="閉じる"
        >
          <CloseIcon />
        </button>
        <div className="relative">
          <img
            src={imageUrl}
            alt="Generated scene preview"
            className="w-full h-auto object-contain rounded-lg max-h-[80vh]"
          />
          <div className="absolute bottom-4 right-4">
            <a
              href={imageUrl}
              download={`nanobanana_scene_${Date.now()}.png`}
              className="bg-white/80 backdrop-blur-sm text-banana-dark p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg flex items-center gap-2"
              aria-label="画像をダウンロード"
              title="画像をダウンロード"
            >
              <DownloadIcon />
            </a>
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

export default ScenePreviewModal;
