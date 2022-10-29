import fs from 'fs';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV ?? 'production';
const CURRRENT_DIR = fs.realpathSync(process.cwd());

function resolveBuCurrentDir(filename: string): string {
  return path.resolve(CURRRENT_DIR, filename);
}

export const getEnvsFiles = () => {
  const envPath = resolveBuCurrentDir('.env');

  const envFiles = [
    `${envPath}.${NODE_ENV}.local`,
    `${envPath}.${NODE_ENV}`,
    `${envPath}`,
  ];

  return envFiles.filter((path) => fs.existsSync(path));
}

export const getBooleanFlagValue = (
  rawValue: string | undefined,
): boolean | undefined => {
  return rawValue ? rawValue === 'true' : undefined;
}

export const getIntFlagValue = (
  rawValue: string | undefined,
): number | undefined => {
  const value = rawValue ? parseInt(rawValue, 10) : undefined;

  return Number.isFinite(value) ? value : undefined;
}