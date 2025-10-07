"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import CharacterGenerator from "../../components/CharacterGenerator";
import CharacterPreviewModal from "../../components/CharacterPreviewModal";
import Header from "../../components/Header";
import SavedCharacters from "../../components/SavedCharacters";
import SceneCreator from "../../components/SceneCreator";
import ScenePreviewModal from "../../components/ScenePreviewModal";
import VideoCreator from "../../components/VideoCreator";
import type {
  Character,
  GeneratedResult,
  VideoClip,
} from "../../types/character-animation";

type Page = "character" | "scene" | "video";

// --- Page Navigator Component ---
interface PageNavigatorProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  canGoToVideo: boolean;
}

const steps: { page: Page; title: string }[] = [
  { page: "character", title: "1. キャラクター生成" },
  { page: "scene", title: "2. シーン作成" },
  { page: "video", title: "3. 動画作成" },
];

const PageNavigator: React.FC<PageNavigatorProps> = ({
  currentPage,
  onNavigate,
  canGoToVideo,
}) => {
  return (
    <nav className="bg-white rounded-xl shadow-lg p-3 mb-8">
      <ol className="flex items-center justify-around gap-2">
        {steps.map((step, index) => {
          const isCurrent = currentPage === step.page;
          const isDisabled =
            isCurrent || (step.page === "video" && !canGoToVideo);

          return (
            <React.Fragment key={step.page}>
              <li className="flex-1">
                <button
                  onClick={() => onNavigate(step.page)}
                  disabled={isDisabled}
                  className={`w-full text-center px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base ${
                    isCurrent
                      ? "bg-banana-dark text-white cursor-default"
                      : step.page === "video" && !canGoToVideo
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white text-banana-dark hover:bg-banana-light"
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {step.title}
                </button>
              </li>
              {index < steps.length - 1 && (
                <li className="text-banana-gray" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

const NO_CHARACTER_ID = "__NONE__";

const CharacterAnimationPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [modalCharacter, setModalCharacter] = useState<Character | null>(null);
  const [modalSceneImage, setModalSceneImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("character");
  const [allGeneratedImages, setAllGeneratedImages] = useState<
    Record<string, GeneratedResult[]>
  >({});
  const [allVideoClips, setAllVideoClips] = useState<
    Record<string, VideoClip[]>
  >({});

  const handleCharacterSave = (character: Character) => {
    setCharacters((prev) => [...prev, character]);
    setSelectedCharacterId(character.id);
    setCurrentPage("scene");
  };

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacterId(id);
    if (currentPage === "character") {
      setCurrentPage("scene");
    }
  };

  const handleNavigateHome = () => {
    setCurrentPage("character");
    setSelectedCharacterId(null);
  };

  const handleUpdateGeneratedImages = useCallback(
    (id: string, results: GeneratedResult[]) => {
      setAllGeneratedImages((prev) => ({
        ...prev,
        [id]: results,
      }));
    },
    []
  );

  const handleUpdateVideoClips = useCallback(
    (id: string, clips: VideoClip[]) => {
      setAllVideoClips((prev) => ({
        ...prev,
        [id]: clips,
      }));
    },
    []
  );

  const selectedCharacter = useMemo(() => {
    return characters.find((c) => c.id === selectedCharacterId) || null;
  }, [characters, selectedCharacterId]);

  const canGoToVideo = useMemo(() => {
    const idToCheck = selectedCharacter
      ? selectedCharacter.id
      : NO_CHARACTER_ID;
    return (allGeneratedImages[idToCheck] || []).length > 0;
  }, [selectedCharacter, allGeneratedImages]);

  const handlePageNavigation = (page: Page) => {
    if (page === "video" && !canGoToVideo) {
      return;
    }
    setCurrentPage(page);
  };

  const handlePreviewCharacter = (character: Character) => {
    setModalCharacter(character);
  };

  const handleCloseCharacterModal = () => {
    setModalCharacter(null);
  };

  const handlePreviewScene = (imageBase64: string) => {
    setModalSceneImage(imageBase64);
  };

  const handleCloseSceneModal = () => {
    setModalSceneImage(null);
  };

  const handleGoToVideo = () => {
    if (canGoToVideo) {
      setCurrentPage("video");
    }
  };

  useEffect(() => {
    // If a character was selected but has been deleted, clear the selection.
    if (selectedCharacterId && !selectedCharacter) {
      setSelectedCharacterId(null);
    }
  }, [characters, selectedCharacter, selectedCharacterId]);

  return (
    <div className="bg-banana-light min-h-screen font-sans text-banana-dark">
      <Header onHomeClick={handleNavigateHome} />
      <main className="container mx-auto p-4 md:p-8">
        <PageNavigator
          currentPage={currentPage}
          onNavigate={handlePageNavigation}
          canGoToVideo={canGoToVideo}
        />

        {currentPage === "character" && (
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            <CharacterGenerator onCharacterSave={handleCharacterSave} />
            {characters.length > 0 && (
              <SavedCharacters
                characters={characters}
                selectedId={null} // No character is "selected" on this page, clicking navigates
                onSelect={handleSelectCharacter}
                onPreview={handlePreviewCharacter}
              />
            )}
          </div>
        )}
        {currentPage === "scene" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-8">
              <SavedCharacters
                characters={characters}
                selectedId={selectedCharacterId}
                onSelect={handleSelectCharacter}
                onPreview={handlePreviewCharacter}
              />
            </div>
            <div className="lg:sticky lg:top-8">
              <SceneCreator
                key={selectedCharacter?.id || NO_CHARACTER_ID}
                character={selectedCharacter}
                generatedImages={
                  allGeneratedImages[
                    selectedCharacter?.id || NO_CHARACTER_ID
                  ] || []
                }
                onUpdateGeneratedImages={(results) =>
                  handleUpdateGeneratedImages(
                    selectedCharacter?.id || NO_CHARACTER_ID,
                    results
                  )
                }
                onPreviewScene={handlePreviewScene}
                onGoToVideoCreator={handleGoToVideo}
              />
            </div>
          </div>
        )}
        {currentPage === "video" && (
          <VideoCreator
            character={selectedCharacter}
            generatedImages={
              allGeneratedImages[selectedCharacter?.id || NO_CHARACTER_ID] || []
            }
            savedClips={
              allVideoClips[selectedCharacter?.id || NO_CHARACTER_ID] || []
            }
            onUpdateClips={(clips) =>
              handleUpdateVideoClips(
                selectedCharacter?.id || NO_CHARACTER_ID,
                clips
              )
            }
            onBack={() => setCurrentPage("scene")}
            onUpdateGeneratedImages={(results) =>
              handleUpdateGeneratedImages(
                selectedCharacter?.id || NO_CHARACTER_ID,
                results
              )
            }
          />
        )}
      </main>
      <CharacterPreviewModal
        character={modalCharacter}
        onClose={handleCloseCharacterModal}
      />
      <ScenePreviewModal
        imageBase64={modalSceneImage}
        onClose={handleCloseSceneModal}
      />
    </div>
  );
};

export default CharacterAnimationPage;
