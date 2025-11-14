import './badges.css'

interface SongBadgesProps {
  songSlug: string
  songToOrderMap: Map<string, number>
  venueMap: Map<string, string[]>
  higawariLabelMap: Map<string, string>
  isHigawari: boolean
  isLocationgawari: boolean
}

export default function SongBadges({
  songSlug,
  songToOrderMap,
  venueMap,
  higawariLabelMap,
  isHigawari,
  isLocationgawari,
}: SongBadgesProps) {
  const order = songToOrderMap.get(songSlug)
  const venues = venueMap.get(songSlug) || []
  const higawariLabel = higawariLabelMap.get(songSlug)
  const isInEvent = order !== undefined

  if (!isInEvent) {
    return null
  }

  return (
    <div className="song-badges">
      <span className="song-badge badge-order">#{order}</span>

      {isLocationgawari && venues.length > 0 && (
        <span className="song-badge badge-locationgawari">{venues.join(', ')}</span>
      )}

      {isHigawari && higawariLabel && (
        <span className="song-badge badge-higawari">{higawariLabel}</span>
      )}

      {!isHigawari && !isLocationgawari && (
        <span className="song-badge badge-fixed">고정</span>
      )}
    </div>
  )
}
