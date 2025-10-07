import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCharacterSheet = async (description: string, style: string): Promise<{ base64: string, mimeType: string }> => {
  const prompt = `A high-quality, detailed character sheet for a new character. Full-body shot in a neutral standing pose, filling the entire vertical space of the 9:16 frame. Clean, plain white background. The character has the following features: ${description}. The art style should be: ${style}.`;

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: '9:16',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const imageData = response.generatedImages[0].image;
    return { base64: imageData.imageBytes, mimeType: 'image/png' };
  }

  throw new Error("Failed to generate character image.");
};

export const generateScene = async (
  referenceImage: { base64: string; mimeType: string },
  sceneDescription: string
): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: referenceImage.base64,
      mimeType: referenceImage.mimeType,
    },
  };
  const textPart = { text: sceneDescription };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("Failed to generate scene. The model did not return an image.");
};

export const startVideoGeneration = async (
  prompt: string,
  referenceImage: { base64: string; mimeType: string },
  duration: number
) => {
  const operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: prompt,
    image: {
      imageBytes: referenceImage.base64,
      mimeType: referenceImage.mimeType,
    },
    config: {
      numberOfVideos: 1,
      // FIX: The property name for video duration is `durationSeconds`, not `durationSecs`.
      durationSeconds: duration,
    }
  });
  return operation;
};

export const checkVideoOperation = async (operation: any) => {
  const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
  return updatedOperation;
};