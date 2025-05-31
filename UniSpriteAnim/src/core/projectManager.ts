// src/core/projectManager.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Project, GlobalSettings, Frame, Animation } from './projectTypes';

// UniSpriteAnim version - should ideally come from package.json or a build process
const UNISPRITE_ANIM_VERSION = '0.1.0';

/**
 * Creates a new project with default values.
 * @param name The name of the new project.
 * @returns A new Project object.
 */
export function createNewProject(projectName: string): Project {
  const defaultGlobalSettings: GlobalSettings = {
    defaultFrameDurationMs: 100, // Default to 100ms per frame
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
 * Saves a project object to a JSON file.
 * @param project The Project object to save.
 * @param filePath The path where the project file should be saved.
 *                 If only a directory is provided, appends project.name + '.unianim'.
 *                 If a full file path is provided, it uses that.
 * @returns A promise that resolves when the file has been saved.
 */
export async function saveProject(project: Project, filePath: string): Promise<void> {
  let fullPath = filePath;
  try {
    // Check if filePath is a directory
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      // Sanitize project name to be used as a filename
      const safeProjectName = project.name.replace(/[^a-z0-9_.-]/gi, '_');
      fullPath = path.join(filePath, `${safeProjectName}.unianim`);
    }
  } catch (error: any) {
    // If path doesn't exist, assume it's a full file path or will be created.
    // If it's an error other than 'ENOENT' (not found), rethrow.
    if (error.code !== 'ENOENT') {
      throw error;
    }
    // If it is ENOENT, it might be a full path to a new file, which is fine.
    // We also need to ensure the directory exists if a full path is given.
    const dir = path.dirname(fullPath);
    try {
        await fs.access(dir);
    } catch (dirError: any) {
        if (dirError.code === 'ENOENT') {
            await fs.mkdir(dir, { recursive: true });
        } else {
            throw dirError;
        }
    }
  }

  const projectJson = JSON.stringify(project, null, 2); // Pretty print JSON
  await fs.writeFile(fullPath, projectJson, 'utf8');
  console.log(`Project saved to ${fullPath}`);
}

/**
 * Loads a project from a JSON file.
 * @param filePath The path to the .unianim project file.
 * @returns A promise that resolves with the loaded Project object.
 */
export async function loadProject(filePath: string): Promise<Project> {
  const fileContent = await fs.readFile(filePath, 'utf8');
  const project = JSON.parse(fileContent) as Project;
  // TODO: Add validation here to ensure the loaded object matches the Project interface
  // and potentially handle version migrations in the future.
  console.log(`Project loaded from ${filePath}`);
  return project;
}

// Helper function to generate unique IDs, can be used for Frames, Animations etc.
// when they are actually created.
export function generateId(): string {
  return uuidv4();
}
