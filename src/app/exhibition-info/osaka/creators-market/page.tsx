import type { Metadata } from 'next';
import './global.css';
import CreatorsMarketClient from './Client';

export const metadata: Metadata = { title: '오사카 크리마켓 정보' };

export default function Page() {
  return <CreatorsMarketClient />;
}