// src/ui/App.tsx
import React, { useState, useEffect } from 'react';
import { Project } from '../core/projectTypes'; // Adjust path as necessary

// Ensure CSS can be imported if you have a global stylesheet or component-specific styles
// import './App.css';

function App() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (currentProject) {
      setStatusMessage(`Project "${currentProject.name}" loaded.`);
    } else {
      setStatusMessage('No project loaded.');
    }
  }, [currentProject]);

  const handleNewProjectClick = async () => {
    const projectName = window.prompt('Enter new project name:');
    if (projectName && projectName.trim() !== '') {
      try {
        setStatusMessage('Creating new project...');
        const project = await window.electronAPI.handleNewProject(projectName);
        setCurrentProject(project);
        setStatusMessage(`New project "${project.name}" created successfully!`);
      } catch (error: any) {
        console.error('Error creating new project:', error);
        setStatusMessage(`Error: ${error.message || 'Failed to create new project'}`);
        alert(`Error creating new project: ${error.message}`);
      }
    } else if (projectName !== null) { // prompt was not cancelled, but was empty
        alert("Project name cannot be empty.");
        setStatusMessage('Project creation cancelled: name was empty.');
    } else { // prompt was cancelled
        setStatusMessage('Project creation cancelled by user.');
    }
  };

  const handleOpenProjectClick = async () => {
    try {
      setStatusMessage('Opening project...');
      const project = await window.electronAPI.handleOpenProject();
      if (project) {
        setCurrentProject(project);
        // The main process dialog already shows success/error
        // setStatusMessage(`Project "${project.name}" opened successfully!`);
      } else {
        // This case occurs if the dialog was cancelled or failed in a way that returns null
        // but doesn't throw an error that the main process dialog would show.
        // The main process already shows dialogs for errors.
        setStatusMessage('Open project dialog cancelled or no project selected.');
      }
    } catch (error: any) {
      console.error('Error opening project:', error);
      setStatusMessage(`Error: ${error.message || 'Failed to open project'}`);
      // Main process should show an error dialog, but alert for safety
      alert(`Error opening project: ${error.message}`);
    }
  };

  const handleSaveProjectClick = async () => {
    if (!currentProject) {
      alert('No project is currently loaded to save.');
      setStatusMessage('Save cancelled: No project loaded.');
      return;
    }
    try {
      setStatusMessage(`Saving project "${currentProject.name}"...`);
      const filePath = await window.electronAPI.handleSaveProject(currentProject);
      if (filePath) {
        // Main process dialog shows success
        // setStatusMessage(`Project saved to "${filePath}" successfully!`);
        // If we want to store the filePath with the project state:
        // setCurrentProject(prev => prev ? { ...prev, filePath } : null);
      } else {
         // This case occurs if the dialog was cancelled.
         // The main process already shows dialogs for errors.
        setStatusMessage('Save project dialog cancelled.');
      }
    } catch (error: any) {
      console.error('Error saving project:', error);
      setStatusMessage(`Error: ${error.message || 'Failed to save project'}`);
      // Main process should show an error dialog, but alert for safety
      alert(`Error saving project: ${error.message}`);
    }
  };

  // Basic styling (can be moved to a CSS file)
  const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    controls: { marginBottom: '20px' },
    button: { marginRight: '10px', padding: '8px 12px' },
    projectInfo: { marginTop: '20px', padding: '10px', border: '1px solid #ccc' },
    status: { marginTop: '10px', fontStyle: 'italic', color: '#555'}
  };

  return (
    <div style={styles.container}>
      <header>
        <h1>UniSpriteAnim</h1>
        <p>Basic Project Management UI</p>
      </header>

      <div style={styles.controls}>
        <button style={styles.button} onClick={handleNewProjectClick}>New Project</button>
        <button style={styles.button} onClick={handleOpenProjectClick}>Open Project</button>
        <button style={styles.button} onClick={handleSaveProjectClick} disabled={!currentProject}>
          Save Project
        </button>
      </div>

      {currentProject && (
        <div style={styles.projectInfo}>
          <h2>Current Project Details</h2>
          <p><strong>Name:</strong> {currentProject.name}</p>
          <p><strong>UniSpriteAnim Version:</strong> {currentProject.unispriteAnimVersion}</p>
          <p><strong>Sprite Source Path:</strong> {currentProject.spriteSourcePath || 'Not set'}</p>
          <p><strong>Frames:</strong> {currentProject.frames.length}</p>
          <p><strong>Animations:</strong> {currentProject.animations.length}</p>
          <p><strong>Default Frame Duration:</strong> {currentProject.globalSettings.defaultFrameDurationMs}ms</p>
        </div>
      )}

      <div style={styles.status}>
        <p>Status: {statusMessage}</p>
      </div>

    </div>
  );
}

export default App;
