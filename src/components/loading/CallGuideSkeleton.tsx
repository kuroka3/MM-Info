import './skeleton.css'

export default function CallGuideSkeleton() {
  return (
    <div className="call-guide-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title skeleton-shimmer"></div>
        <div className="skeleton-parts">
          <div className="skeleton-part skeleton-shimmer"></div>
          <div className="skeleton-part skeleton-shimmer"></div>
        </div>
      </div>

      <div className="skeleton-controls">
        <div className="skeleton-button skeleton-shimmer"></div>
        <div className="skeleton-button skeleton-shimmer"></div>
        <div className="skeleton-button skeleton-shimmer"></div>
      </div>

      <div className="skeleton-lyrics">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-lyric-block">
            <div className="skeleton-lyric-line skeleton-shimmer"></div>
            <div className="skeleton-lyric-line skeleton-shimmer" style={{ width: '80%' }}></div>
            <div className="skeleton-lyric-line skeleton-shimmer" style={{ width: '90%' }}></div>
          </div>
        ))}
      </div>

      <div className="skeleton-player">
        <div className="skeleton-player-bar skeleton-shimmer"></div>
        <div className="skeleton-player-controls">
          <div className="skeleton-player-button skeleton-shimmer"></div>
          <div className="skeleton-player-button large skeleton-shimmer"></div>
          <div className="skeleton-player-button skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  )
}
