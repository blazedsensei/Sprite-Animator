// src/core/projectManager.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Project, GlobalSettings, Frame, Animation } from './projectTypes';

/**
 * The version of UniSpriteAnim.
 * Ideally, this would be dynamically sourced from `package.json` during a build process.
 */
const UNISPRITE_ANIM_VERSION = '0.1.0'; // Current version of the application

/**
 * Creates a new UniSpriteAnim project object with default values.
 * @param {string} projectName - The desired name for the new project.
 * @returns {Project} A new {@link Project} object initialized with default settings.
 */
export function createNewProject(projectName: string): Project {
  const defaultGlobalSettings: GlobalSettings = {
    defaultFrameDurationMs: 100, // Default to 100ms per frame, common for ~10 FPS
  };

  const newProject: Project = {
    name: projectName,
    unispriteAnimVersion: UNISPRITE_ANIM_VERSION,
    spriteSourcePath: null,
    frames: [],
    animations: [],
    globalSettings: defaultGlobalSettings,
  };
  return newProject;
}

/**
 * Saves a {@link Project} object to a JSON file.
 * The file will have a `.unianim` extension.
 * If `filePath` is a directory, the project name (sanitized) is used as the filename.
 * If `filePath` is a full path (including filename), it's used directly.
 * Parent directories are created if they don't exist.
 *
 * @param {Project} project - The Project object to save.
 * @param {string} filePath - The directory path or full file path where the project should be saved.
 * @returns {Promise<void>} A promise that resolves when the file has been successfully saved.
 * @throws {Error} If there's an issue creating directories or writing the file.
 */
export async function saveProject(project: Project, filePath: string): Promise<void> {
  let fullPath = filePath;
  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      // Sanitize project name to be a valid filename component
      const safeProjectName = project.name.replace(/[^a-z0-9_.-]/gi, '_').replace(/\.+$/, '');
      fullPath = path.join(filePath, `${safeProjectName || 'untitled'}.unianim`);
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') { // ENOENT means path doesn't exist, which is fine if it's a full path
      console.error('Error stating filePath during save:', error);
      throw error;
    }
    // If ENOENT, it might be a full path to a new file.
    // Ensure the directory for the file exists.
    const dir = path.dirname(fullPath);
    try {
        await fs.access(dir); // Check if directory exists
    } catch (dirError: any) {
        if (dirError.code === 'ENOENT') { // If directory doesn't exist
            await fs.mkdir(dir, { recursive: true }); // Create it
        } else {
            throw dirError; // Other error accessing directory
        }
    }
  }

  const projectJson = JSON.stringify(project, null, 2); // Pretty-print JSON with 2-space indent
  await fs.writeFile(fullPath, projectJson, 'utf8');
  console.log(`Project saved to ${fullPath}`);
}

/**
 * Loads a UniSpriteAnim project from a `.unianim` JSON file.
 *
 * @param {string} filePath - The path to the `.unianim` project file.
 * @returns {Promise<Project>} A promise that resolves with the loaded {@link Project} object.
 * @throws {Error} If the file cannot be read or if its content cannot be parsed into a Project object.
 */
export async function loadProject(filePath: string): Promise<Project> {
  const fileContent = await fs.readFile(filePath, 'utf8');
  const project = JSON.parse(fileContent) as Project; // Type assertion

  // TODO: Implement robust validation here:
  // 1. Check if 'project' object has all required fields of the Project interface.
  // 2. Potentially handle version migrations if project.unispriteAnimVersion is older.
  // For now, we assume the file is correctly formatted.
  if (!project || typeof project.name !== 'string' || !project.globalSettings) {
    throw new Error(`File content at ${filePath} is not a valid UniSpriteAnim project.`);
  }

  console.log(`Project loaded from ${filePath}`);
  return project;
}

/**
 * Generates a unique identifier string (UUID v4).
 * Useful for creating unique IDs for frames, animations, etc.
 *
 * @returns {string} A new UUID v4 string.
 */
export function generateId(): string {
  return uuidv4();
}
