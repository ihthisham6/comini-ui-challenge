import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Old and new outer folder names
const oldBasePath = path.join(__dirname, 'src/assets/Game Characters');
const newBasePath = path.join(__dirname, 'src/assets/GameCharacters');

// Step 1: Rename the outer folder
if (fs.existsSync(oldBasePath)) {
  fs.renameSync(oldBasePath, newBasePath);
  console.log(`✅ Renamed outer folder: Game Characters → GameCharacters`);
} else {
  console.warn(`⚠️ Folder "Game Characters" not found.`);
}

// Step 2: Recursively rename all files and folders to remove spaces
function renameFilesAndFolders(dir) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const oldPath = path.join(dir, entry);
    const newEntry = entry.replace(/\s+/g, '');
    const newPath = path.join(dir, newEntry);

    // Rename file/folder if it contains spaces
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`🔄 Renamed: ${entry} → ${newEntry}`);
    }

    // If it's a directory, recurse
    const stats = fs.statSync(newPath);
    if (stats.isDirectory()) {
      renameFilesAndFolders(newPath);
    }
  }
}

// Start renaming inside the new outer folder
if (fs.existsSync(newBasePath)) {
  renameFilesAndFolders(newBasePath);
}
