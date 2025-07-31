import Link from 'next/link';

export default function Home() {
  return (
    <main className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 className="header-title">Welcome to Setlist</h1>
      <p className="header-subtitle" style={{ marginBottom: '2rem' }}>
        Your place to find and share concert setlists.
      </p>
      <Link href="/concerts/1" style={{ 
        fontSize: '1.2rem', 
        padding: '0.8rem 1.5rem',
        borderRadius: '2rem',
        background: 'var(--primary-rgb)',
        color: 'rgb(var(--background-rgb))',
        textDecoration: 'none',
        fontWeight: 'bold'
       }}>
        Go to Latest Concert
      </Link>
    </main>
  );
}

