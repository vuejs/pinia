export const IS_CLIENT = typeof window !== 'undefined'

/**
 * Should we add the devtools plugins.
 * - only if dev mode or forced through the prod devtools flag
 * - not in test
 * - only if window exists (could change in the future)
 */
export const USE_DEVTOOLS =
  (__DEV__ || __FEATURE_PROD_DEVTOOLS__) && !__TEST__ && IS_CLIENT
