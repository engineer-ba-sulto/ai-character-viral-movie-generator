import Image from "next/image";
import React from "react";
import { DownloadIcon } from "./icons";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface ScenePreviewModalProps {
  imageBase64: string | null;
  onClose: () => void;
}

const ScenePreviewModal: React.FC<ScenePreviewModalProps> = ({
  imageBase64,
  onClose,
}) => {
  if (!imageBase64) {
    return null;
  }

  const imageUrl = `data:image/png;base64,${imageBase64}`;

  return (
    <Dialog open={!!imageBase64} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full p-0">
        <div className="relative">
          <Image
            src={imageUrl}
            alt="Generated scene preview"
            width={800}
            height={1200}
            className="w-full h-auto object-contain rounded-lg max-h-[80vh]"
          />
          <div className="absolute bottom-4 right-4">
            <Button
              asChild
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <a
                href={imageUrl}
                download={`nanobanana_scene_${Date.now()}.png`}
                aria-label="画像をダウンロード"
                title="画像をダウンロード"
              >
                <DownloadIcon />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScenePreviewModal;
