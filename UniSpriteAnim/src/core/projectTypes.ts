// src/core/projectTypes.ts

// --- Geometric Structures (minimal for now) ---
export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// --- MVP Frame Definition (largely placeholder for now) ---
export interface Frame {
  id: string; // Unique ID (UUID)
  name: string;
  // More properties will be added in later phases for source, trimming, etc.
}

// --- MVP Animation Definition (largely placeholder for now) ---
export interface Animation {
  id: string; // Unique ID (UUID)
  name: string;
  frameInstanceIds: string[]; // Ordered list of Frame IDs
  loopType: 'once' | 'loop'; // Simplified for MVP
  playbackSpeedMultiplier: number;
}

// --- MVP AnimationFrameInstance (minimal for now) ---
// We might not need this directly in Project file for extreme MVP,
// but good to think about. For now, Animation will just have frame IDs.
// If we need instance-specific properties early, we'll add this.

// --- MVP Global Settings ---
export interface GlobalSettings {
  defaultFrameDurationMs: number; // Default duration for a frame in milliseconds
  // Add other MVP-relevant global settings here as needed
}

// --- Core Project Structure (MVP) ---
export interface Project {
  name: string;
  unispriteAnimVersion: string; // Version of UniSpriteAnim that saved this project
  spriteSourcePath: string | null; // Path to the main sprite sheet or folder of frames
  frames: Frame[]; // Library of all unique frames extracted/imported
  animations: Animation[]; // All animation sequences defined in the project
  globalSettings: GlobalSettings;
  // rootPivot and collisionShapes will be added in later phases
}
