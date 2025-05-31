// src/index.ts
import * as path from 'path';
import * as fs from 'fs/promises';
import { createNewProject, saveProject, loadProject } from './core/projectManager';
import { Project } from './core/projectTypes';

async function main() {
  console.log('UniSpriteAnim CLI Test Harness');
  console.log('-----------------------------');

  // --- Test Create New Project ---
  const projectName = 'MyTestProject';
  console.log(`Creating new project: "${projectName}"`);
  const newProject = createNewProject(projectName);
  console.log('New project created:', JSON.stringify(newProject, null, 2));
  console.log('-----------------------------');

  // --- Test Save Project ---
  // Create a temporary directory for test projects if it doesn't exist
  const tempDir = path.join(__dirname, '..', 'temp_projects'); // Save outside src/dist
  try {
    await fs.mkdir(tempDir, { recursive: true });
    console.log(`Temporary directory for projects ensured at: ${tempDir}`);
  } catch (err) {
    console.error('Error creating temporary directory:', err);
    return; // Exit if we can't create the directory
  }

  const projectFilePath = path.join(tempDir, `${newProject.name}.unianim`);
  console.log(`Saving project to: "${projectFilePath}"`);
  try {
    await saveProject(newProject, projectFilePath); // Pass the full file path
    console.log('Project saved successfully.');
  } catch (error) {
    console.error('Error saving project:', error);
    return; // Exit if save fails
  }
  console.log('-----------------------------');

  // --- Test Load Project ---
  console.log(`Loading project from: "${projectFilePath}"`);
  let loadedProject: Project | null = null;
  try {
    loadedProject = await loadProject(projectFilePath);
    console.log('Project loaded successfully:');
    console.log(JSON.stringify(loadedProject, null, 2));
  } catch (error) {
    console.error('Error loading project:', error);
    return; // Exit if load fails
  }
  console.log('-----------------------------');

  // --- Verification ---
  if (loadedProject) {
    console.log('Verification:');
    console.log(`Loaded Project Name: ${loadedProject.name} (Expected: ${projectName})`);
    console.log(`Loaded UniSpriteAnim Version: ${loadedProject.unispriteAnimVersion}`);
    console.log(`Default Frame Duration: ${loadedProject.globalSettings.defaultFrameDurationMs}ms`);
    if (loadedProject.name === projectName) {
      console.log('Project name matches. Test successful!');
    } else {
      console.error('Project name does NOT match. Test failed!');
    }
  }
  console.log('-----------------------------');
  console.log('CLI Test Harness finished.');

  // Clean up the created project file (optional)
  // try {
  //   await fs.unlink(projectFilePath);
  //   console.log(`Cleaned up test project file: ${projectFilePath}`);
  // } catch (error) {
  //   console.error('Error cleaning up test project file:', error);
  // }
}

main().catch(error => {
  console.error('An unexpected error occurred in the CLI harness:', error);
});
