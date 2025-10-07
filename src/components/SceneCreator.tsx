import React, { useState, useRef } from 'react';
import type { Character, GeneratedResult } from '../types';
import { generateScene } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ImageCard from './ImageCard';
import { PlusIcon, TrashIcon, DownloadIcon, FilmIcon, UploadIcon } from './icons';

declare var JSZip: any;

interface SceneCreatorProps {
  character: Character | null;
  generatedImages: GeneratedResult[];
  onUpdateGeneratedImages: (results: GeneratedResult[]) => void;
  onPreviewScene: (imageBase64: string) => void;
  onGoToVideoCreator: () => void;
}

interface SceneInput {
  id: number;
  description: string;
}


const SceneCreator: React.FC<SceneCreatorProps> = ({ character, generatedImages, onUpdateGeneratedImages, onPreviewScene, onGoToVideoCreator }) => {
  const [scenes, setScenes] = useState<SceneInput[]>([{ id: Date.now(), description: '' }]);
  const [numImages, setNumImages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSceneDescriptionChange = (id: number, value: string) => {
    setScenes(scenes.map(scene => scene.id === id ? { ...scene, description: value } : scene));
  };

  const addSceneInput = () => {
    setScenes([...scenes, { id: Date.now(), description: '' }]);
  };

  const removeSceneInput = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id));
  };
  
  const handleClearSceneImages = (sceneDescription: string) => {
    const updatedImages = generatedImages.filter(
      result => result.sceneDescription !== sceneDescription
    );
    onUpdateGeneratedImages(updatedImages);
  };

  const handleGenerate = async () => {
    if (!character) {
      setError("シーン生成にはキャラクターの選択が必要です。");
      return;
    }

    const validScenes = scenes.filter(s => s.description.trim() !== '');
    
    const scenesToGenerate = validScenes.filter(
      scene => !generatedImages.some(
        result => result.sceneDescription === scene.description.trim()
      )
    );

    if (scenesToGenerate.length === 0) {
      setError('すべてのシーンは既に生成済みです。画像をクリアして再生成するか、新しいシーンを追加してください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generationTasks = scenesToGenerate.map(scene => {
        const fullPrompt = `${scene.description.trim()}, in the style of ${character.style}. The image should fill the entire 9:16 frame. Vertical image, 9:16 aspect ratio.`;
        const promises = Array(numImages).fill(null).map(() => 
          generateScene(character.image, fullPrompt)
        );
        return Promise.all(promises).then(images => ({
          sceneDescription: scene.description.trim(),
          images: images
        }));
      });

      const newResults = await Promise.all(generationTasks);
      
      const updatedImages = [...generatedImages, ...newResults];
      onUpdateGeneratedImages(updatedImages);

    } catch (err) {
      setError('シーンの生成中にエラーが発生しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const UPLOADED_SCENE_DESC = "アップロードした画像";
    setError(null);
    setIsLoading(true);
  
    try {
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const [, base64Data] = result.split(',');
            resolve(base64Data);
          };
          reader.onerror = (error) => reject(new Error(`File reading error for ${file.name}: ${error}`));
          reader.readAsDataURL(file);
        });
      });
  
      const newBase64Images = await Promise.all(imagePromises);
  
      const existingUploads = generatedImages.find(r => r.sceneDescription === UPLOADED_SCENE_DESC);
      
      let updatedGeneratedImages: GeneratedResult[];
      if (existingUploads) {
        updatedGeneratedImages = generatedImages.map(r => 
          r.sceneDescription === UPLOADED_SCENE_DESC
            ? { ...r, images: [...r.images, ...newBase64Images] }
            : r
        );
      } else {
        const newResult: GeneratedResult = {
          sceneDescription: UPLOADED_SCENE_DESC,
          images: newBase64Images,
        };
        updatedGeneratedImages = [...generatedImages, newResult];
      }
  
      onUpdateGeneratedImages(updatedGeneratedImages);
  
    } catch (err) {
      setError('画像のアップロード中にエラーが発生しました。');
      console.error(err);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset for next upload
      }
    }
  };


  const handleDownloadAll = async () => {
    if (typeof JSZip === 'undefined') {
      setError("ZIP機能の読み込みに失敗しました。ページを再読み込みしてください。");
      return;
    }

    setIsZipping(true);
    setError(null);
    try {
      const zip = new JSZip();
      
      if (character) {
        zip.file("character.png", character.image.base64, { base64: true });
      }
      
      generatedImages.forEach(result => {
        const safePrefix = result.sceneDescription.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '_').substring(0, 50);
        result.images.forEach((imgBase64, imgIndex) => {
          const fileName = `${safePrefix}_${imgIndex + 1}.png`;
          zip.file(fileName, imgBase64, { base64: true });
        });
      });
  
      const blob = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `nanobanana_assets_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
  
    } catch (err)
      {
      setError("ZIPファイルの作成中にエラーが発生しました。");
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };


  const validScenes = scenes.filter(s => s.description.trim() !== '');
  const scenesToGenerateCount = validScenes.filter(
    scene => !generatedImages.some(result => result.sceneDescription === scene.description.trim())
  ).length;

  const isGenerateDisabled = isLoading || !character || validScenes.length === 0 || scenesToGenerateCount === 0;
  const hasGeneratedImages = generatedImages.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-banana-dark mb-1">2. シーン作成</h2>
      <p className="text-banana-gray mb-4">
        {character ? "キャラクターのポーズ、表情、背景を記述してください。" : "画像をアップロードして動画の素材を追加します。"}
      </p>
      
      <div className="flex flex-col gap-4">
        {character && (
          <>
            <div>
              <p className="text-sm font-medium text-banana-gray mb-1">画風 (キャラクターに紐付いています)</p>
              <p className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 font-medium">{character.style}</p>
            </div>
            
            <div className="space-y-3">
              {scenes.map((scene) => (
                <div key={scene.id} className="flex items-start gap-2">
                  <textarea
                    value={scene.description}
                    onChange={(e) => handleSceneDescriptionChange(scene.id, e.target.value)}
                    placeholder="例：散らかった机で頭を抱えている"
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-banana-yellow focus:border-banana-yellow transition"
                    rows={3}
                    disabled={isLoading}
                  />
                  {scenes.length > 1 && (
                    <button 
                      onClick={() => removeSceneInput(scene.id)} 
                      disabled={isLoading}
                      className="p-3 text-banana-gray hover:text-red-500 transition-colors disabled:opacity-50"
                      aria-label="このシーンを削除"
                      title="このシーンを削除"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addSceneInput}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full text-banana-dark font-bold py-2 px-4 rounded-lg hover:bg-banana-light transition duration-200 border-2 border-dashed border-banana-gray/50 hover:border-banana-yellow disabled:opacity-50"
            >
              <PlusIcon /> シーンを追加
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="num-images-select" className="block text-sm font-medium text-banana-gray mb-1">各シーンの生成枚数</label>
                <select
                  id="num-images-select"
                  value={numImages}
                  onChange={(e) => setNumImages(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-banana-yellow focus:border-banana-yellow transition"
                  disabled={isLoading}
                >
                  <option value={1}>1枚</option>
                  <option value={2}>2枚</option>
                  <option value={3}>3枚</option>
                  <option value={4}>4枚</option>
                </select>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="w-full bg-banana-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? <LoadingSpinner /> : `シーンを生成`}
              </button>
            </div>
            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-banana-gray text-sm">または</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </>
        )}

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            multiple
        />
        <button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="w-full border-2 border-banana-dark text-banana-dark font-bold py-2.5 px-4 rounded-lg hover:bg-banana-dark/10 transition duration-200 flex items-center justify-center disabled:opacity-50 gap-2"
        >
            <UploadIcon />
            <span>シーン画像をアップロード</span>
        </button>


        <button
          onClick={handleDownloadAll}
          disabled={isLoading || isZipping || !hasGeneratedImages}
          className="w-full border-2 border-banana-dark text-banana-dark font-bold py-2.5 px-4 rounded-lg hover:bg-banana-dark/10 transition duration-200 flex items-center justify-center disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 mt-4"
        >
          {isZipping ? 
            <LoadingSpinner color="dark" /> : 
            <><DownloadIcon /> <span className="ml-2">全画像をZIPでダウンロード</span></>
          }
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {(isLoading || hasGeneratedImages) && (
        <div className="mt-6">
          <h3 className="font-bold mb-4">利用可能なシーン</h3>
            {isLoading && scenesToGenerateCount > 0 && (
              <div className="text-center p-8">
                <LoadingSpinner color="dark" />
                <p className="mt-2 text-banana-gray">シーンを生成中です… これには数分かかることがあります。</p>
              </div>
            )}
            <div className="space-y-6">
              {generatedImages.map((result, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center border-b pb-1 mb-2">
                    <h4 className="font-semibold text-banana-dark break-words">{result.sceneDescription}</h4>
                    <button
                      onClick={() => handleClearSceneImages(result.sceneDescription)}
                      disabled={isLoading}
                      className="p-1 text-banana-gray hover:text-red-500 transition-colors disabled:opacity-50 flex-shrink-0 ml-2"
                      aria-label="このシーンの画像をクリア"
                      title="このシーンの画像をクリア"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {result.images.map((imgBase64, imgIndex) => (
                      <ImageCard
                        key={imgIndex}
                        base64Image={imgBase64}
                        onPreview={() => onPreviewScene(imgBase64)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {hasGeneratedImages && !isLoading && (
              <div className="mt-8 border-t pt-6">
                <button
                    onClick={onGoToVideoCreator}
                    className="w-full bg-banana-yellow text-banana-dark font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 flex items-center justify-center gap-2"
                >
                    <FilmIcon />
                    追加したシーンで動画を作成する
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SceneCreator;