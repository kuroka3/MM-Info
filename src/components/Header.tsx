import React from 'react';

interface HeaderProps {
  title: string;
  artist: string;
  date: string;
  higawariLabel?: string;
}

const Header: React.FC<HeaderProps> = ({ title, artist, date, higawariLabel }) => {
  return (
    <header className="header">
      <div className="container header-content">
        <h1 className="header-title">
          {title.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < title.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <p className="header-subtitle">
          {artist} • {date}
          {higawariLabel && ` • ${higawariLabel} 세트리`}
        </p>
      </div>
    </header>
  );
};

export default Header;