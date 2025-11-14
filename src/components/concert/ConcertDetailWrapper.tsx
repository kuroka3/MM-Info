'use client'

import useSWR from 'swr'
import { fetcher } from '@/lib/swr-config'
import ConcertDetailSkeleton from '@/components/loading/ConcertDetailSkeleton'

type ConcertWithRelations = {
  id: number
  eventId: number
  venueId: number | null
  setlistId: number | null
  date: string | null
  day: string | null
  block: string | null
  showTime: unknown
  doorTime: unknown
  vipTime: unknown
  showTimeUTC: Date | null
  doorTimeUTC: Date | null
  vipTimeUTC: Date | null
  timeZone: string | null
  timeOffset: string | null
  playlistImageUrl: string | null
  venue: unknown
  event: unknown
  setlist: unknown
}

interface ConcertContentProps {
  concert: ConcertWithRelations
  allEventConcerts: ConcertWithRelations[]
}

interface ConcertDetailWrapperProps {
  initialConcert: ConcertWithRelations
  initialAllEventConcerts: ConcertWithRelations[]
  concertId: string
  ConcertContentComponent: React.ComponentType<ConcertContentProps>
}

interface ConcertResponse {
  concert: ConcertWithRelations
  allEventConcerts: ConcertWithRelations[]
}

export default function ConcertDetailWrapper({
  initialConcert,
  initialAllEventConcerts,
  concertId,
  ConcertContentComponent,
}: ConcertDetailWrapperProps) {
  const { data, error, isLoading } = useSWR<ConcertResponse>(
    `/api/concerts/${concertId}/full`,
    fetcher,
    {
      fallbackData: {
        concert: initialConcert,
        allEventConcerts: initialAllEventConcerts,
      },
      revalidateOnMount: false,
    }
  )

  if (isLoading && !data) {
    return <ConcertDetailSkeleton />
  }

  if (error || !data?.concert) {
    return (
      <ConcertContentComponent
        concert={initialConcert}
        allEventConcerts={initialAllEventConcerts}
      />
    )
  }

  return (
    <ConcertContentComponent
      concert={data.concert}
      allEventConcerts={data.allEventConcerts}
    />
  )
}
