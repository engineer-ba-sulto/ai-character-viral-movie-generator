"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import CharacterGenerator from "../../components/CharacterGenerator";
import CharacterPreviewModal from "../../components/CharacterPreviewModal";
import Header from "../../components/Header";
import PageNavigator, { type Page } from "../../components/PageNavigator";
import SavedCharacters from "../../components/SavedCharacters";
import SceneCreator from "../../components/SceneCreator";
import ScenePreviewModal from "../../components/ScenePreviewModal";
import VideoCreator from "../../components/VideoCreator";
import type {
  Character,
  GeneratedResult,
  VideoClip,
} from "../../types/character-animation";

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
