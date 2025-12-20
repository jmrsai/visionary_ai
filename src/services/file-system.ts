
import { readFile as readFileFs } from 'fs/promises';

export async function readFile(path: string): Promise<string> {
  return readFileFs(path, 'utf-8');
}
