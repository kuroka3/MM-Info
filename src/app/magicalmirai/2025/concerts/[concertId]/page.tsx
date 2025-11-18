import { createConcertPageHandlers } from '@/components/ConcertPage';

export const dynamic = 'force-static';
export const revalidate = 86400;

const config = {
  eventSlug: 'magical-mirai-2025',
  artistName: 'Magical Mirai 2025',
  spoilerStorageKey: 'spoilerConfirmed:magical-mirai-2025',
  redirectPath: '/magicalmirai/2025',
  preparingMessage: '公演情報は準備中です',
  playlistImageUrl: 'https://i.scdn.co/image/ab67616d0000b2735f2f5454b20afbc21b0363cb',
};

const handlers = createConcertPageHandlers(config);

export const generateStaticParams = handlers.generateStaticParams;
export const generateMetadata = handlers.generateMetadata;
export default handlers.ConcertPageComponent;
