'use client'

import useSWR from 'swr'
import { fetcher } from '@/lib/swr-config'
import CallGuideSkeleton from '@/components/loading/CallGuideSkeleton'
import type { Song } from '@prisma/client'

type SongWithRelations = Song & {
  setlists?: Array<{ order: number }>
  eventVariations?: Array<{ isHigawari: boolean; isLocationgawari: boolean; eventId: number }>
}

interface CallGuideComponentProps {
  song: SongWithRelations
  songs: SongWithRelations[]
  safeSongIndex: string[]
  albumSongs: string[]
  eventSlug: string
}

interface CallGuideWrapperProps {
  initialSong: SongWithRelations
  initialSongs: SongWithRelations[]
  eventSlug: string
  safeSongIndex: string[]
  albumSongs: string[]
  slug: string
  isSafeMode: boolean
  CallGuideComponent: React.ComponentType<CallGuideComponentProps>
}

interface SongsResponse {
  songs: SongWithRelations[]
}

export default function CallGuideWrapper({
  initialSong,
  initialSongs,
  eventSlug,
  safeSongIndex,
  albumSongs,
  slug,
  isSafeMode,
  CallGuideComponent,
}: CallGuideWrapperProps) {
  const { data, error, isLoading } = useSWR<SongsResponse>(
    `/api/events/${eventSlug}/songs`,
    fetcher,
    {
      fallbackData: { songs: initialSongs },
      revalidateOnMount: false,
    }
  )

  const songs = data?.songs || initialSongs

  const sortedSongs = isSafeMode
    ? [...songs].sort((a, b) => {
        const idxA = safeSongIndex.indexOf(a.slug!)
        const idxB = safeSongIndex.indexOf(b.slug!)
        const orderA = idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA
        const orderB = idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB
        return orderA - orderB
      })
    : [...songs].sort((a, b) => {
        const orderA = a.setlists?.[0]?.order ?? Number.MAX_SAFE_INTEGER
        const orderB = b.setlists?.[0]?.order ?? Number.MAX_SAFE_INTEGER
        return orderA - orderB
      })

  const song = sortedSongs.find((s) => s.slug === slug) || initialSong

  if (isLoading && !data) {
    return <CallGuideSkeleton />
  }

  if (error) {
    return (
      <CallGuideComponent
        song={initialSong}
        songs={initialSongs}
        safeSongIndex={safeSongIndex}
        albumSongs={albumSongs}
        eventSlug={eventSlug}
      />
    )
  }

  return (
    <CallGuideComponent
      song={song}
      songs={sortedSongs}
      safeSongIndex={safeSongIndex}
      albumSongs={albumSongs}
      eventSlug={eventSlug}
    />
  )
}
