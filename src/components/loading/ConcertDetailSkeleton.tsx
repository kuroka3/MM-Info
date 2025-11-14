import './skeleton.css'

export default function ConcertDetailSkeleton() {
  return (
    <div className="concert-detail-skeleton">
      <div className="skeleton-concert-header">
        <div className="skeleton-concert-title skeleton-shimmer"></div>
        <div className="skeleton-concert-info skeleton-shimmer"></div>
      </div>

      <div className="skeleton-setlist-table">
        <div className="skeleton-table-header">
          <div className="skeleton-cell skeleton-shimmer" style={{ width: '10%' }}></div>
          <div className="skeleton-cell skeleton-shimmer" style={{ width: '50%' }}></div>
          <div className="skeleton-cell skeleton-shimmer" style={{ width: '40%' }}></div>
        </div>
        {[...Array(15)].map((_, i) => (
          <div key={i} className="skeleton-table-row">
            <div className="skeleton-cell skeleton-shimmer" style={{ width: '10%' }}></div>
            <div className="skeleton-cell skeleton-shimmer" style={{ width: '50%' }}></div>
            <div className="skeleton-cell skeleton-shimmer" style={{ width: '40%' }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}
