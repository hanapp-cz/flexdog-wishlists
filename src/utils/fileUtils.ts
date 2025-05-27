import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), "data");

export const readJSON = async (relPath: string) => {
  const fullPath = path.join(dataDir, relPath);
  try {
    const file = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    // If the error is ENOENT (file not found), return null
    if (
      error !== null &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const writeJSON = async (relPath: string, data: any) => {
  const fullPath = path.join(dataDir, relPath);
  // Ensure the directory exists
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
};

export const deleteFile = async (relPath: string) => {
  const fullPath = path.join(dataDir, relPath);
  await fs.unlink(fullPath);
};
