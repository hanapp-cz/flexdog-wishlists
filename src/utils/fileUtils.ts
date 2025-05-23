import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), "data");

export const readJSON = async (relPath: string) => {
  const fullPath = path.join(dataDir, relPath);
  const file = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(file);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const writeJSON = async (relPath: string, data: any) => {
  const fullPath = path.join(dataDir, relPath);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
};
