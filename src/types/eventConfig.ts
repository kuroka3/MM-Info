export interface EventConfig {
  eventSlug: string;
  eventBasePath: string;
  spoilerStorageKey: string;
  eventName: string;
}

export const MAGICAL_MIRAI_2025: EventConfig = {
  eventSlug: 'magical-mirai-2025',
  eventBasePath: '/magicalmirai/2025',
  spoilerStorageKey: 'spoilerConfirmed:magical-mirai-2025',
  eventName: 'マジカルミライ２０２５',
};

export const MIKU_EXPO_ASIA_2025: EventConfig = {
  eventSlug: 'miku-expo-2025-asia',
  eventBasePath: '/mikuexpo/asia2025',
  spoilerStorageKey: 'spoilerConfirmed:mikuexpo-asia2025',
  eventName: 'MIKU EXPO ASIA TOUR 2025',
};

export const EVENT_CONFIGS: Record<string, EventConfig> = {
  'magical-mirai-2025': MAGICAL_MIRAI_2025,
  'miku-expo-2025-asia': MIKU_EXPO_ASIA_2025,
};
