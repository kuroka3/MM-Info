'use client';

export default function SupportServerButton() {
  return (
    <a
      href="https://buymeacoffee.com/cnabe"
      target="_blank"
      rel="noopener noreferrer"
      className="buy-coffee-floating"
      aria-label="서버비 지원해주기"
    >
      <span className="buy-coffee-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 24h28v12a10 10 0 0 1-10 10H26a10 10 0 0 1-10-10V24Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M44 28h4a6 6 0 0 1 0 12h-4"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 46h12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M26 16c0 2-2 4-2 6m10-6c0 2-2 4-2 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="buy-coffee-label">서버비 지원해주기</span>
    </a>
  );
}
