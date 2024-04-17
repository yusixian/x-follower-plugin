export const STORAGE_KEY = {
  FOLLOW_USER_LIST: "follow_user_list"
}

type PrefixedStorageKey<T extends Record<keyof T, string>> = {
  [K in keyof T]: `xf_${T[K]}`
}

export type PrefixedStorageKeyType = PrefixedStorageKey<typeof STORAGE_KEY>

export const PREFIXED_STORAGE_KEY = Object.fromEntries(
  Object.entries(STORAGE_KEY).map(([key, value]) => [key, "xf_" + value])
) as PrefixedStorageKeyType
