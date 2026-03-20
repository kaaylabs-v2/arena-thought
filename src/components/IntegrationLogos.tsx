/** Official-style SVG logos for integrations — sized to 20×20 */

export function NotionLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M25.723 16.333c-4.857.387-5.96.467-8.73-1.563L9.15 9.203C7.6 7.837 7.017 7.253 7.017 5.697c0-1.943 1.167-3.497 5.443-3.88L64.85.063c5.443-.39 8.167.97 10.3 2.53l9.333 6.607c.583.39 2.14 2.14 2.14 3.5 0 1.943-1.553 3.883-5.057 4.08l-55.843 3.553zm-4.473 73.517V32.66c0-2.723 1.363-4.087 3.883-4.28l58.177-3.5c2.527-.193 3.883 1.363 3.883 4.087v56.803c0 2.723-1.553 5.443-5.44 5.637l-52.533 2.917c-3.89.193-5.97-1.167-5.97-4.473zm52.34-53.31c.39 1.75 0 3.5-1.75 3.697l-2.53.483v41.863c-2.14 1.167-4.277 1.75-5.833 1.75-2.723 0-3.5-.967-5.44-3.307l-16.69-26.39v25.617l5.44 1.167s0 3.5-4.857 3.5l-13.39.777c-.39-.777 0-2.723 1.36-3.113l3.5-.97V38.3l-4.857-.39c-.39-1.75.583-4.277 3.3-4.473l14.347-.97 17.467 26.78V35.02l-4.473-.583c-.39-2.14 1.167-3.693 3.11-3.887l13.39-.777z" fill="hsl(var(--card))"/>
    </svg>
  );
}

export function GoogleDriveLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA"/>
      <path d="M43.65 25.15L29.9 1.35c-1.35.8-2.5 1.9-3.3 3.3L1.2 48.2c-.8 1.4-1.2 2.95-1.2 4.5h27.5l16.15-27.55z" fill="#00AC47"/>
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l6.85 12.5 6.9 11.3z" fill="#EA4335"/>
      <path d="M43.65 25.15L57.4 1.35C56.05.55 54.5 0 52.8 0H34.5c-1.7 0-3.35.55-4.6 1.35l13.75 23.8z" fill="#00832D"/>
      <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.6 1.2h36.6c1.7 0 3.35-.45 4.6-1.2L59.8 53z" fill="#2684FC"/>
      <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25.15 59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5L73.4 26.5z" fill="#FFBA00"/>
    </svg>
  );
}

export function GoogleCalendarLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M152.637 200H47.363L36.842 152.637h126.316L152.637 200z" fill="#1A73E8"/>
      <path d="M200 152.637V47.363l-47.363-10.521v126.316L200 152.637z" fill="#1A73E8"/>
      <path d="M152.637 0L0 0v47.363h47.363V200h105.274V47.363H200L152.637 0z" fill="#EA4335" fillOpacity="0"/>
      <rect x="36.842" y="36.842" width="126.316" height="126.316" fill="white"/>
      <path d="M152.637 47.363V0L200 47.363h-47.363z" fill="#1565C0"/>
      <path d="M47.363 152.637H0L47.363 200v-47.363z" fill="#1565C0"/>
      <path d="M47.363 0H0v47.363l47.363-47.363z" fill="#EA4335"/>
      <path d="M47.363 47.363H0l47.363 47.363V47.363z" fill="#EA4335" fillOpacity="0"/>
      <path d="M200 152.637l-47.363 47.363V152.637H200z" fill="#1565C0" fillOpacity="0"/>
      {/* Calendar grid lines */}
      <rect x="60" y="75" width="80" height="2" fill="#DADCE0"/>
      <rect x="60" y="100" width="80" height="2" fill="#DADCE0"/>
      <rect x="60" y="125" width="80" height="2" fill="#DADCE0"/>
      <rect x="85" y="55" width="2" height="90" fill="#DADCE0"/>
      <rect x="115" y="55" width="2" height="90" fill="#DADCE0"/>
      {/* "31" text */}
      <text x="100" y="120" textAnchor="middle" fill="#1A73E8" fontSize="48" fontFamily="Google Sans,Roboto,Arial,sans-serif" fontWeight="500">31</text>
    </svg>
  );
}

export function ZoteroLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="4" fill="#CC2936"/>
      <path d="M8 10.5h15.5v1.8l-11.7 10H24v2H8v-1.8l11.7-10H8v-2z" fill="white"/>
    </svg>
  );
}

export function ReadwiseLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="4" fill="#FCD34D"/>
      {/* Open book shape */}
      <path d="M16 10c-2.5-2-6-2.5-8-2v14c2 .5 5.5.5 8 2.5 2.5-2 6-2 8-2.5V8c-2-.5-5.5 0-8 2z" fill="white" fillOpacity="0.9"/>
      <path d="M16 10v14.5" stroke="#D97706" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

export function AnkiLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="4" fill="#235DBA"/>
      {/* Star shape - Anki's icon */}
      <path d="M16 6l2.94 6.56L26 13.64l-5 4.36L22.18 25 16 21.56 9.82 25 11 18l-5-4.36 7.06-1.08L16 6z" fill="white"/>
    </svg>
  );
}

export function ObsidianLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="4" fill="#7C3AED"/>
      {/* Obsidian gem/crystal shape */}
      <path d="M16 4L9 12l3 16 4-6 4 6 3-16-7-8z" fill="white" fillOpacity="0.9"/>
      <path d="M16 4L9 12l7 2 7-2-7-8z" fill="white"/>
      <path d="M9 12l3 16 4-6-7-10z" fill="white" fillOpacity="0.7"/>
      <path d="M23 12l-3 16-4-6 7-10z" fill="white" fillOpacity="0.6"/>
    </svg>
  );
}

export function AppleCalendarLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Calendar body */}
      <rect x="2" y="6" width="28" height="24" rx="4" fill="white"/>
      {/* Red header strip */}
      <rect x="2" y="6" width="28" height="8" rx="4" fill="#FF3B30"/>
      <rect x="2" y="10" width="28" height="4" fill="#FF3B30"/>
      {/* Rings */}
      <rect x="9" y="3" width="2.5" height="6" rx="1.25" fill="#BABABA"/>
      <rect x="20.5" y="3" width="2.5" height="6" rx="1.25" fill="#BABABA"/>
      {/* Day number */}
      <text x="16" y="25.5" textAnchor="middle" fill="#1C1C1E" fontSize="12" fontFamily="-apple-system,SF Pro Display,Helvetica,sans-serif" fontWeight="300">17</text>
    </svg>
  );
}
