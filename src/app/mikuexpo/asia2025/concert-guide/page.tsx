import type { CSSProperties } from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '공연 정보' }

type GlowStyle = CSSProperties & {
  '--glow-color': string
  '--glow-shadow': string
}

const melonGlow: GlowStyle = {
  '--glow-color': 'rgba(65, 210, 107, 0.22)',
  '--glow-shadow': 'rgba(65, 210, 107, 0.14)',
}

const ticketLinkGlow: GlowStyle = {
  '--glow-color': 'rgba(250, 40, 40, 0.22)',
  '--glow-shadow': 'rgba(250, 40, 40, 0.14)',
}

export default function ConcertGuidePage() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">공연 정보</h1>
          <p className="header-subtitle">
            하츠네 미쿠 &lt;MIKU EXPO ASIA TOUR 2025&gt; 공연 정보
          </p>
        </div>
      </header>

      <section className="container">
        <div className="feature-card">
          <h3 className="feature-title">MIKU EXPO 2025 ASIA 공식 사이트</h3>
          <p className="feature-text">
          </p>
          <div className="feature-logo">
            <Image
              src="https://mikuexpo.com/asia2025/images/hero_logo.svg?250530"
              alt="MIKU EXPO ASIA TOUR 2025 Hero Logo"
              width={260}
              height={88}
              priority
            />
          </div>
          <a
            href="https://mikuexpo.com/asia2025/"
            target="_blank"
            rel="noopener noreferrer"
            className="feature-link-block external-link"
          >
            <span className="external-link-text">미쿠 엑스포 2025 ASIA 공식 사이트</span>
            <span className="external-link-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </section>

      <section className="container ticket-section">
        <h2 className="ticket-section-title">티켓 예매</h2>
        <div className="ticket-grid">
          <a
            href="https://ticket.melon.com/performance/index.htm?prodId=211664"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-card"
            style={melonGlow}
          >
            <div className="ticket-main">
              <div className="ticket-logo">
                <Image
                  src="https://mikuexpo.com/asia2025/images/common/expo_logo.svg"
                  alt="MIKU EXPO ASIA TOUR 2025"
                  width={200}
                  height={68}
                  priority
                />
              </div>
              <div className="ticket-info">
                <span className="ticket-subtitle">미쿠 엑스포 예약 페이지</span>
                <span className="ticket-title">
                  <span className="ticket-title-icon">
                    <Image
                      src="/images/ico/melon_ticket.ico"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </span>
                  멜론티켓
                </span>
              </div>
              <span className="ticket-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <ul className="ticket-times">
              <li>11/29 토 · 19:00</li>
              <li>11/30 일 · 16:00</li>
            </ul>
          </a>

          <a
            href="https://www.ticketlink.co.kr/product/59363"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-card"
            style={ticketLinkGlow}
          >
            <div className="ticket-main">
              <div className="ticket-logo">
                <Image
                  src="https://digitalstars.club/hmds25/images/hero_logo.svg"
                  alt="HATSUNE MIKU Digital Stars"
                  width={200}
                  height={68}
                  priority
                />
              </div>
              <div className="ticket-info">
                <span className="ticket-subtitle">디지스타 예약 페이지</span>
                <span className="ticket-title">
                  <span className="ticket-title-icon">
                    <Image
                      src="/images/ico/ticket_link.ico"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </span>
                  티켓링크
                </span>
              </div>
              <span className="ticket-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <ul className="ticket-times">
              <li>11/30 일 · 19:00</li>
            </ul>
          </a>
        </div>
      </section>
    </main>
  )
}
