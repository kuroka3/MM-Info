import './global.css'

export const metadata = {
  title: '공연 가이드',
}

export default function ConcertGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
