export function TaskPlaceholderImage({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 400 200" 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="petrolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#004546" />
          <stop offset="100%" stopColor="#002d2e" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d0c6ab" />
          <stop offset="100%" stopColor="#b8aa88" />
        </linearGradient>
      </defs>
      {/* Background with Commerzbank Petrol gradient */}
      <rect width="100%" height="100%" fill="url(#petrolGrad)" />
      
      {/* Dynamic gold diagonal shapes */}
      <path d="M 0,200 L 160,200 L 280,0 L 0,0 Z" fill="url(#goldGrad)" opacity="0.12" />
      <path d="M 120,200 L 260,200 L 380,0 L 240,0 Z" fill="url(#goldGrad)" opacity="0.06" />
      
      {/* Abstract diamond elements */}
      <polygon points="340,40 360,60 340,80 320,60" fill="#d0c6ab" opacity="0.25" />
      <polygon points="60,130 70,140 60,150 50,140" fill="#d0c6ab" opacity="0.15" />
      
      {/* Checklist / Clipboard Illustration in Gold */}
      <g transform="translate(170, 65)" style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' }}>
        {/* Board base */}
        <rect x="10" y="15" width="44" height="54" rx="6" fill="#d0c6ab" />
        {/* Clip top */}
        <rect x="22" y="7" width="20" height="12" rx="3" fill="#004546" />
        <circle cx="32" cy="13" r="2" fill="#d0c6ab" />
        
        {/* Paper lines */}
        <line x1="18" y1="28" x2="34" y2="28" stroke="#004546" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1="18" y1="38" x2="46" y2="38" stroke="#004546" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1="18" y1="48" x2="40" y2="48" stroke="#004546" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1="18" y1="58" x2="30" y2="58" stroke="#004546" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        
        {/* Checkmarks */}
        <path d="M 40,26 L 42,28 L 46,24" fill="none" stroke="#004546" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <path d="M 36,56 L 38,58 L 42,54" fill="none" stroke="#004546" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </g>
    </svg>
  );
}
