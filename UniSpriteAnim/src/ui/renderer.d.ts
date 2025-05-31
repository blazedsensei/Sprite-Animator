// src/ui/renderer.d.ts
import { Project } from '../core/projectTypes';

export interface IElectronAPI {
  handleNewProject: (projectName: string) => Promise<Project>;
  handleOpenProject: () => Promise<Project | null>;
  handleSaveProject: (projectData: Project) => Promise<string | null>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
