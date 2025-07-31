import React from 'react';

interface HeaderProps {
  title: string;
  artist: string;
  date: string;
}

const Header: React.FC<HeaderProps> = ({ title, artist, date }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{artist} • {date}</p>
      </div>
    </header>
  );
};

export default Header;