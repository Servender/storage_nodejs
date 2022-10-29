import { AnyObject } from '../utilityTypes';

export type ConfigFlags<T extends Record<string, unknown>> = Readonly<T>;
export type AnyConfigFlags = ConfigFlags<AnyObject>;

export type ConfigFlagDeclaration<T> = Readonly<{
  key: string;
  getValue: (value: string | undefined) => T | undefined;
  description?: string;
  options?: any[];
  defaultValue?: T;
}>;

export type ConfigFlagDeclarations<Flags extends AnyConfigFlags> = Readonly<
  Required<{
    [key in keyof Flags]: ConfigFlagDeclaration<Flags[key]>;
  }>
>;
