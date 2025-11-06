import { createConcertPageHandlers } from '@/components/ConcertPage';

export const revalidate = 60;

const config = {
  eventSlug: 'miku-expo-2025-asia',
  artistName: 'MIKU EXPO 2025 ASIA',
  spoilerStorageKey: 'spoilerConfirmed:mikuexpo-asia2025',
  redirectPath: '/mikuexpo/asia2025',
  preparingMessage: '공연 정보 준비 중',
  playlistImageUrl: 'https://tm-prod-event-files-v3.ticketmelon.com/dd372553607b11f0911101117567899b/description/bb5a261360c011f0915501117567899b.png',
};

const handlers = createConcertPageHandlers(config);

export const generateStaticParams = handlers.generateStaticParams;
export const generateMetadata = handlers.generateMetadata;
export default handlers.ConcertPageComponent;
