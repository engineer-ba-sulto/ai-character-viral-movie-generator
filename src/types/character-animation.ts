export interface Character {
  id: string;
  description: string;
  style: string;
  image: {
    base64: string;
    mimeType: string;
  };
}

export interface GeneratedResult {
  sceneDescription: string;
  images: string[];
}

export interface VideoClip {
  id: string;
  sourceImage: string; // base64
  sourceSceneDescription: string;
  motionPrompt: string;
  duration: number; // in seconds
  generatedVideoUrl?: string; // blob URL
  status: 'idle' | 'generating' | 'done' | 'error';
  operation?: any;
  errorMessage?: string;
}