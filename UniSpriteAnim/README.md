# UniSpriteAnim: Universal 2D Sprite Animator & Atlas Packer

UniSpriteAnim is a desktop application designed to streamline the creation, manipulation, and export of 2D sprite animations. This project aims to provide an artist-friendly tool with advanced features for sprite sheet management, animation timeline control, and flexible export options for game development.

*(Current Status: MVP - Initial project management features are implemented.)*

## Core Principles

*   **Artist-Centric Workflow**: Prioritizing visual feedback and intuitive controls.
*   **Non-Destructive Editing**: Preserving original frame data.
*   **Interoperability**: Flexible import and customizable export options.
*   **Performance**: Optimized for handling large sprite sheets and animations.
*   **Extensibility**: Modular architecture for future feature additions.

## Current Features (MVP - Phase 1 Core)

*   **Project Management (via UI):**
    *   **New Project**: Create a new, empty UniSpriteAnim project.
    *   **Open Project**: Open an existing `.unianim` project file.
    *   **Save Project**: Save the current project to a `.unianim` file.
*   **Project File Format:**
    *   Projects are saved in a JSON-based `.unianim` file format, storing project name, version, settings, and (eventually) frame and animation data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

### Installation

1.  Clone the repository (or download the source if you have it as a zip):
    ```bash
    git clone <repository-url>
    cd UniSpriteAnim
    ```
2.  Install dependencies:
    ```bash
    npm install
    # OR
    # yarn install
    ```

### Running in Development Mode

UniSpriteAnim uses Electron with a React frontend. You'll need to run two processes concurrently in separate terminal windows: one for the React development server (with hot reloading) and one for the Electron main process.

1.  **Terminal 1: Start the React Development Server**
    ```bash
    npm run dev:react
    ```
    This will typically open the UI in your browser at `http://localhost:3000`. The Electron app will load this URL. Wait until it confirms the server is running.

2.  **Terminal 2: Start the Electron Application**
    ```bash
    npm run dev:electron
    ```
    This will compile the Electron main process and preload scripts, and then launch the Electron application, which should display the UI served by `dev:react`.

    *(Note: The `dev:electron` script uses `tsc` to compile TypeScript files for the Electron main process. Changes in `src/electron` or `src/core` might require restarting this process.)*

## Project Structure Overview

A brief look at the key directories:

*   `UniSpriteAnim/`: The project root.
    *   `dist/`: Compiled output directory.
    *   `src/`: Source code for the application.
        *   `core/`: Core logic, data structures, and project management (`projectTypes.ts`, `projectManager.ts`). Not tied to Electron or UI directly.
        *   `electron/`: Electron-specific code.
            *   `main.ts`: The entry point for Electron's main process. Handles window creation, IPC, etc.
            *   `preload.ts`: Script that runs before the web page is loaded in the renderer process, used to bridge Electron APIs securely.
        *   `ui/`: React frontend code.
            *   `App.tsx`: Main React application component.
            *   `index.tsx`: Entry point for the React application.
            *   `index.html`: HTML template for the React app.
            *   `renderer.d.ts`: TypeScript definitions for APIs exposed by `preload.ts`.
    *   `package.json`: Project metadata, dependencies, and scripts.
    *   `tsconfig.json`: Base TypeScript configuration.
    *   `webpack.*.js`: Webpack configurations for bundling the React UI.
    *   `README.md`: This file.

## Future Development

This project is in its early stages. Future development will focus on implementing the features outlined in the [Advanced Design Document](<link-to-your-design-doc-if-publicly-accessible-or-remove-this-link>), including:
*   Advanced Asset Management (Sprite Sheet Import, Frame Extraction)
*   Granular Animation Creation & Editing (Timeline, Transformations)
*   Visual Preview & Debugging Tools
*   Robust Export & Integration Options

*(If you have the design document content available, you could also include a summary of the roadmap here or link to another file in the repo).*

---
