// src/electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import { Project } from '../core/projectTypes'; // Assuming projectTypes is accessible

contextBridge.exposeInMainWorld('electronAPI', {
  // Renderer to Main (Invoke/Handle)
  handleNewProject: (projectName: string): Promise<Project> =>
    ipcRenderer.invoke('project:new', projectName),
  handleOpenProject: (): Promise<Project | null> =>
    ipcRenderer.invoke('project:open'),
  handleSaveProject: (projectData: Project): Promise<string | null> => // Send project data
    ipcRenderer.invoke('project:save', projectData),

  // Main to Renderer (Send/On) - Example if needed later
  // onUpdateCounter: (callback: (event: IpcRendererEvent, ...args: any[]) => void) =>
  //   ipcRenderer.on('update-counter', callback),
});

console.log('Electron API exposed on window.electronAPI in preload.');
