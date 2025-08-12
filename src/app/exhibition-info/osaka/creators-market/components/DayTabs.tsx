'use client';

import { DAYS } from '../constants';

interface DayTabsProps {
  selectedDay: (typeof DAYS)[number]['value'];
  onChange: (value: (typeof DAYS)[number]['value']) => void;
}

export default function DayTabs({ selectedDay, onChange }: DayTabsProps) {
  return (
    <nav className="day-tabs">
      {DAYS.map(({ value, date, day, cls }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={value === selectedDay ? 'active' : ''}
        >
          <span className="date">{date}</span>
          <span className={`booth-day ${cls}`}>{day}</span>
        </button>
      ))}
    </nav>
  );
}
