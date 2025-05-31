// src/core/projectTypes.ts

/**
 * Represents a 2D point.
 */
export interface Point {
  /** The x-coordinate. */
  x: number;
  /** The y-coordinate. */
  y: number;
}

/**
 * Represents a rectangle.
 */
export interface Rect {
  /** The x-coordinate of the top-left corner. */
  x: number;
  /** The y-coordinate of the top-left corner. */
  y: number;
  /** The width of the rectangle. */
  width: number;
  /** The height of the rectangle. */
  height: number;
}

/**
 * Defines a single visual frame, which could be part of a sprite sheet or an individual image.
 * (MVP: Largely placeholder for now, more properties will be added for source, trimming, etc.)
 */
export interface Frame {
  /** A unique identifier (UUID) for this frame. */
  id: string;
  /** A user-defined display name for this frame (e.g., "player_idle_01"). */
  name: string;
  // Future properties:
  // originalSource: { type: 'sheet' | 'individual'; path: string; rect?: Rect; };
  // trimmedRect: Rect;
  // padding: { top: number; right: number; bottom: number; left: number; };
  // previewDataUrl: string;
  // atlasRect?: Rect;
  // atlasId?: string;
  // customTags?: string[];
}

/**
 * Defines an animation sequence, consisting of an ordered list of frame instances.
 * (MVP: Largely placeholder for now.)
 */
export interface Animation {
  /** A unique identifier (UUID) for this animation. */
  id: string;
  /** A user-defined name for this animation (e.g., "walk_right"). */
  name: string;
  /** An ordered list of Frame IDs that make up this animation sequence. */
  frameInstanceIds: string[]; // References Frame.id
  /** Specifies how the animation should play. */
  loopType: 'once' | 'loop'; // Simplified for MVP, 'pingpong' could be added later.
  /** A multiplier for the overall animation speed (e.g., 1.0 for normal, 0.5 for half speed). */
  playbackSpeedMultiplier: number;
  // Future properties:
  // events: AnimationEvent[];
  // durationMs: number; // Total calculated duration
}

/**
 * Global settings for the UniSpriteAnim project.
 * (MVP: Minimal settings.)
 */
export interface GlobalSettings {
  /** The default duration in milliseconds for a single frame in an animation sequence. */
  defaultFrameDurationMs: number;
  // Future properties:
  // backgroundColor: string; // For preview canvas
  // pixelGridSize: number;
  // onionSkinCount: number;
  // exportSettings: { ... };
}

/**
 * The core structure representing a UniSpriteAnim project.
 * This object is typically serialized to a .unianim JSON file.
 */
export interface Project {
  /** The user-defined name of the project. */
  name: string;
  /** The version of UniSpriteAnim that last saved this project. */
  unispriteAnimVersion: string;
  /**
   * The file system path to the main sprite sheet image or a folder containing individual frame images.
   * Can be null if no source has been set yet.
   */
  spriteSourcePath: string | null;
  /** A library of all unique frames extracted or imported into the project. */
  frames: Frame[];
  /** All animation sequences defined within the project. */
  animations: Animation[];
  /** Global settings applicable to the entire project. */
  globalSettings: GlobalSettings;
  // Future properties:
  // rootPivot: Point;
  // collisionShapes: CollisionShape[];
}
