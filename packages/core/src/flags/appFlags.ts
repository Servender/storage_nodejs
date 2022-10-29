import { ConfigFlags, declareConfigFlags, declareBooleanFlag } from '#package-platform/src/Envs';

export type AppFlags = ConfigFlags<{
  ci: boolean;
}>;

export const appFlags = declareConfigFlags<AppFlags>('APP_', {
  ci: declareBooleanFlag({
    key: 'ci.active',
    defaultValue: false,
  })
});
