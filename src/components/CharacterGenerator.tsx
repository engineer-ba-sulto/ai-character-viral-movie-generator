
import React, { useState, useRef } from 'react';
import type { Character } from '../types';
import { generateCharacterSheet } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { STYLE_PRESETS } from '../constants';
import { UploadIcon } from './icons';

interface CharacterGeneratorProps {
  onCharacterSave: (character: Character) => void;
}

const CharacterGenerator: React.FC<CharacterGeneratorProps> = ({ onCharacterSave }) => {
  const [description, setDescription] = useState<string>('');
  const [style, setStyle] = useState<string>(STYLE_PRESETS[0]);
  const [generatedImage, setGeneratedImage] = useState<{ base64: string, mimeType: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('キャラクターの説明を入力してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageData = await generateCharacterSheet(description, style);
      setGeneratedImage(imageData);
    } catch (err) {
      setError('キャラクターの生成中にエラーが発生しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    if (generatedImage && description) {
      const newCharacter: Character = {
        id: `char_${Date.now()}`,
        description,
        style,
        image: generatedImage,
      };
      onCharacterSave(newCharacter);
      // Reset for next character
      setGeneratedImage(null);
      setDescription('');
      setStyle(STYLE_PRESETS[0]);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const [header, base64] = result.split(',');
          const mimeTypeMatch = header.match(/:(.*?);/);
          if (!mimeTypeMatch || !mimeTypeMatch[1]) {
            throw new Error("MIMEタイプを判別できませんでした。");
          }
          setGeneratedImage({ base64, mimeType: mimeTypeMatch[1] });
          // If description is empty, provide a default one to enable saving.
          if (description.trim() === '') {
            setDescription(`アップロードされたキャラクター: ${file.name}`);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('画像の読み込みに失敗しました。');
        console.error(err);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset input for re-uploading the same file
        }
      }
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-banana-dark mb-1">1. キャラクター生成</h2>
      <p className="text-banana-gray mb-4">動画の主役を作成します。特徴と画風を選択してください！</p>

      <div className="flex flex-col gap-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例：茶色いお団子ヘア、丸メガネ、紫色のゆったりしたセーター、優しくて少し困り眉"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-banana-yellow focus:border-banana-yellow transition duration-200"
          rows={4}
          disabled={isLoading}
        />
        <div>
          <label htmlFor="char-style-select" className="block text-sm font-medium text-banana-gray mb-1">画風</label>
          <select
            id="char-style-select"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-banana-yellow focus:border-banana-yellow transition"
            disabled={isLoading}
          >
            {STYLE_PRESETS.map((preset) => (
              <option key={preset} value={preset}>{preset}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-banana-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
        >
          {isLoading ? <LoadingSpinner /> : 'キャラクターを生成'}
        </button>
        
        <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-banana-gray text-sm">または</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
        />
        <button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="w-full border-2 border-banana-dark text-banana-dark font-bold py-2.5 px-4 rounded-lg hover:bg-banana-dark/10 transition duration-200 flex items-center justify-center disabled:opacity-50 gap-2"
        >
            <UploadIcon />
            <span>画像をアップロード</span>
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {(isLoading || generatedImage) && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">プレビュー</h3>
          <div className="w-full aspect-[9/16] bg-gray-100 rounded-lg flex items-center justify-center">
            {isLoading ? (
              <div className="text-center">
                <LoadingSpinner />
                <p className="mt-2 text-banana-gray">処理中...</p>
              </div>
            ) : generatedImage && (
              <img
                src={`data:${generatedImage.mimeType};base64,${generatedImage.base64}`}
                alt="Generated or uploaded character"
                className="object-contain w-full h-full rounded-lg"
              />
            )}
          </div>
          {generatedImage && !isLoading && (
            <>
              <p className="text-sm text-banana-gray mt-2 text-center">キャラクターの特徴と画風は、シーン生成の際に参照されます。</p>
              <button
                onClick={handleSave}
                disabled={!description.trim()}
                className="mt-2 w-full bg-banana-yellow text-banana-dark font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-200 disabled:bg-banana-gray/50 disabled:cursor-not-allowed"
              >
                このキャラクターを保存
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterGenerator;
