// src/electron/main.ts
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { createNewProject, loadProject, saveProject } from '../core/projectManager'; // Adjust path if necessary
import { Project } from '../core/projectTypes'; // Adjust path if necessary

// Keep a reference to the main window
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024, // Increased width for better UI
    height: 768, // Increased height
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false, // Keep false for security
      devTools: process.env.NODE_ENV === 'development', // Open DevTools in dev mode
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000'); // URL of the React dev server
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the bundled HTML file
    // Ensure this path is correct based on your build output structure
    mainWindow.loadFile(path.join(__dirname, '../ui/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// --- IPC Handlers ---
async function handleNewProjectIPC(event: Electron.IpcMainInvokeEvent, projectName: string): Promise<Project> {
  console.log(`IPC: Received project:new for name "${projectName}"`);
  if (!projectName || projectName.trim() === '') {
    throw new Error('Project name cannot be empty.');
  }
  return createNewProject(projectName);
}

async function handleOpenProjectIPC(): Promise<Project | null> {
  console.log('IPC: Received project:open');
  if (!mainWindow) {
    console.error('Main window not available for dialog.');
    return null;
  }
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open UniSpriteAnim Project',
    buttonLabel: 'Open Project',
    filters: [{ name: 'UniSpriteAnim Project', extensions: ['unianim'] }],
    properties: ['openFile'],
  });

  if (canceled || filePaths.length === 0) {
    console.log('IPC: Project open dialog cancelled or no file selected.');
    return null;
  }

  try {
    const project = await loadProject(filePaths[0]);
    console.log(`IPC: Project loaded successfully from ${filePaths[0]}`);
    // Optionally, you could store the filePath in the project object or app state
    // if you want to track the current project's file location.
    return project;
  } catch (error) {
    console.error('IPC: Error loading project:', error);
    dialog.showErrorBox('Error Loading Project', `Could not load project file: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function handleSaveProjectIPC(event: Electron.IpcMainInvokeEvent, projectData: Project): Promise<string | null> {
  console.log('IPC: Received project:save for project:', projectData.name);
  if (!mainWindow) {
    console.error('Main window not available for dialog.');
    return null;
  }
  if (!projectData) {
    dialog.showErrorBox('Error Saving Project', 'No project data provided to save.');
    return null;
  }

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save UniSpriteAnim Project',
    defaultPath: `${projectData.name}.unianim`,
    buttonLabel: 'Save Project',
    filters: [{ name: 'UniSpriteAnim Project', extensions: ['unianim'] }],
  });

  if (canceled || !filePath) {
    console.log('IPC: Project save dialog cancelled or no file path selected.');
    return null;
  }

  try {
    await saveProject(projectData, filePath);
    console.log(`IPC: Project saved successfully to ${filePath}`);
    dialog.showMessageBox(mainWindow, { title: 'Project Saved', message: `Project "${projectData.name}" saved successfully to ${filePath}`});
    return filePath; // Return the path where it was saved
  } catch (error) {
    console.error('IPC: Error saving project:', error);
    dialog.showErrorBox('Error Saving Project', `Could not save project file: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
// --- End IPC Handlers ---

app.whenReady().then(() => {
  // Register IPC handlers
  ipcMain.handle('project:new', handleNewProjectIPC);
  ipcMain.handle('project:open', handleOpenProjectIPC);
  ipcMain.handle('project:save', handleSaveProjectIPC);

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Ensure paths to core modules are correct relative to the dist/electron output
// This might require adjusting import paths if TSC output structure is different,
// e.g. if core is not copied into dist/electron.
// For now, assuming `../core/projectManager` and `../core/projectTypes` are valid
// from `dist/electron/main.js` trying to access `dist/core/...`
// This will likely need adjustment in tsconfig or build process to ensure
// non-Electron code (like 'core') is correctly placed or resolved.
// A common solution is to adjust `rootDir` and `outDir` or use path mapping.
// For this subtask, we'll assume the paths will work or will be fixed in a later build configuration step.
