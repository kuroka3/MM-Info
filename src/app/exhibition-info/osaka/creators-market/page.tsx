import type { Metadata } from 'next';
import './styles/base.css';
import './styles/day-tabs.css';
import './styles/map.css';
import './styles/list.css';
import './styles/overrides.css';
import CreatorsMarketClient from './CreatorsMarketClient';

export const metadata: Metadata = { title: '오사카 크리마켓 정보' };

export default function Page() {
  return <CreatorsMarketClient />;
}