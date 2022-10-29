import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import { getEnvsFiles, getIntFlagValue, getBooleanFlagValue } from './utils';
import { AnyConfigFlags, ConfigFlagDeclaration, ConfigFlagDeclarations } from './types';
import { AnyObject } from '../utilityTypes';

const envFiles = getEnvsFiles();

envFiles.forEach((envFile) => {
  dotenvExpand.expand(dotenv.config({ path: envFile }));
});

const getFlagToEnvKeyTransformer = (
  envPrefix: string
): ((flagKey: string) => string) => {
  return (flagKey: string) => {
    const envKey = flagKey
      .replace(/([A-Z]+)/g, ' $1')
      .replace(/\W/g, '_')
      .toUpperCase();

    return envPrefix + envKey;
  }
}

export const declareConfigFlags = <Flags extends AnyConfigFlags>(
  envPrefix: string,
  decloration: ConfigFlagDeclarations<Flags>
): Flags => {
  const keyTransformaer = getFlagToEnvKeyTransformer(envPrefix);

  return (Object.entries(decloration) as [string, ConfigFlagDeclaration<any>][])
    .reduce((flags, [key, declareFlag]) => {
      const envKey = keyTransformaer(declareFlag.key);

      if (process.env[envKey]) {
        const value = declareFlag.getValue(process.env[envKey]);

        if (declareFlag.options?.length && !declareFlag.options.includes(value)) {
          if (typeof declareFlag.defaultValue !== 'undefined') {
            flags[key] = declareFlag.defaultValue;
          }

          return flags;
        }

        flags[key] = value;
      }

      return flags;
    }, {} as AnyObject) as Flags;
}

export const declareNumberFlag = (
  declaration: Omit<ConfigFlagDeclaration<number | undefined>, 'getValue'>,
): ConfigFlagDeclaration<number | undefined> => {
  const { defaultValue, ...rest } = declaration;

  return {
    getValue: (value) => getIntFlagValue(value) ?? defaultValue,
    ...rest,
  }
}

export const declareStringFlag = (
  declaration: Omit<ConfigFlagDeclaration<string | undefined>, 'getValue'>,
): ConfigFlagDeclaration<string | undefined> => {
  const { defaultValue, ...rest } = declaration;

  return {
    getValue: (value) => value ?? defaultValue,
    ...rest,
  }
}

export const declareBooleanFlag = (
  declaration: Omit<ConfigFlagDeclaration<boolean | undefined>, 'getValue'>,
): ConfigFlagDeclaration<boolean | undefined> => {
  const { defaultValue, ...rest } = declaration;

  return {
    getValue: (value) => getBooleanFlagValue(value) ?? defaultValue,
    ...rest,
  }
}
