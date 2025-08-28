import type { Metadata } from 'next';
import '../styles/base.css';
import '../styles/day-tabs.css';
import '../styles/map.css';
import '../styles/overrides.css';
import './styles/optimizer.css';
import OptimizerClient from './OptimizerClient';

export const metadata: Metadata = { title: '도쿄 크리마켓 경로 최적화' };

export default function Page() {
  return <OptimizerClient />;
}
