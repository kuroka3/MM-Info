import Link from 'next/link';

export default function Home() {
  return (
    <main className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 className="header-title">Welcome to Setlist</h1>
      <p className="header-subtitle" style={{ marginBottom: '2rem' }}>
        Your place to find the concert setlists.
      </p>
    </main>
  );
}

