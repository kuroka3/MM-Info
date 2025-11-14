'use client'

import { SWRConfig } from 'swr'
import { swrConfig } from '@/lib/swr-config'

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>
}
