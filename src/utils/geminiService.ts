import { GoogleGenAI, Modality } from "@google/genai";

// Check if API key is available
const hasApiKey =
  !!process.env.GOOGLE_API_KEY &&
  process.env.GOOGLE_API_KEY !== "your_google_api_key_here";

// Initialize AI only if API key is available
const ai = hasApiKey
  ? new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
  : null;

export const generateCharacterSheet = async (
  description: string,
  style: string
): Promise<{ base64: string; mimeType: string }> => {
  if (!hasApiKey || !ai) {
    // Return a mock response for testing without API key
    console.warn("GOOGLE_API_KEY not set, returning mock character image");
    return {
      base64:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      mimeType: "image/png",
    };
  }

  const prompt = `A high-quality, detailed character sheet for a new character. Full-body shot in a neutral standing pose, filling the entire vertical space of the 9:16 frame. Clean, plain white background. The character has the following features: ${description}. The art style should be: ${style}.`;

  const response = await ai.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: "image/png",
      aspectRatio: "9:16",
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const imageData = response.generatedImages[0]?.image;
    if (imageData?.imageBytes) {
      return { base64: imageData.imageBytes, mimeType: "image/png" };
    }
  }

  throw new Error("Failed to generate character image.");
};

export const generateScene = async (
  referenceImage: { base64: string; mimeType: string },
  sceneDescription: string
): Promise<string> => {
  if (!hasApiKey || !ai) {
    // Return a mock response for testing without API key
    console.warn("GOOGLE_API_KEY not set, returning mock scene image");
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  }

  const imagePart = {
    inlineData: {
      data: referenceImage.base64,
      mimeType: referenceImage.mimeType,
    },
  };
  const textPart = { text: sceneDescription };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  if (response.candidates && response.candidates.length > 0) {
    const candidate = response.candidates[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          return part.inlineData.data;
        }
      }
    }
  }

  throw new Error(
    "Failed to generate scene. The model did not return an image."
  );
};

export const startVideoGeneration = async (
  prompt: string,
  referenceImage: { base64: string; mimeType: string },
  duration: number
) => {
  if (!hasApiKey || !ai) {
    // Return a mock operation for testing without API key
    console.warn("GOOGLE_API_KEY not set, returning mock video operation");
    return {
      name: "mock-operation",
      done: false,
      metadata: { progress: 0 },
    };
  }

  const operation = await ai.models.generateVideos({
    model: "veo-2.0-generate-001",
    prompt: prompt,
    image: {
      imageBytes: referenceImage.base64,
      mimeType: referenceImage.mimeType,
    },
    config: {
      numberOfVideos: 1,
      // FIX: The property name for video duration is `durationSeconds`, not `durationSecs`.
      durationSeconds: duration,
    },
  });
  return operation;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkVideoOperation = async (operation: any) => {
  if (!hasApiKey || !ai) {
    // Return a mock completed operation for testing without API key
    console.warn(
      "GOOGLE_API_KEY not set, returning mock completed video operation"
    );
    return {
      name: operation.name,
      done: true,
      response: {
        video: {
          uri: "mock-video-uri",
          mimeType: "video/mp4",
        },
      },
    };
  }

  const updatedOperation = await ai.operations.getVideosOperation({
    operation: operation,
  });
  return updatedOperation;
};
