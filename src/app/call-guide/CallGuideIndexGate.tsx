'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SongWithSetlist } from '@/types/callGuide';
import CallGuideIndexClient from './CallGuideIndexClient';

interface Props {
  songs: SongWithSetlist[];
}

export default function CallGuideIndexGate({ songs }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('spoilerConfirmed') === 'true') {
      setAllowed(true);
    } else {
      router.replace('/call-guide/safe');
    }
  }, [router]);
  if (!allowed) return null;
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">콜 가이드</h1>
          <p className="header-subtitle">곡을 선택하세요</p>
        </div>
      </header>
      <section className="container call-section">
        <CallGuideIndexClient songs={songs} />
      </section>
    </main>
  );
}
