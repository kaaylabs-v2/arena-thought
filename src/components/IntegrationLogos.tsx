/** Official-style SVG logos for integrations — sized to 20×20 */

export function NotionLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z" fill="currentColor"/>
      <path d="M61.35.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l12.81 16.913c2.137 2.723 4.08 3.307 8.16 3.113L88.723 96.08c5.437-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.81-2.867-3.443-4.733L74.167 3.143C69.893.037 68.147-.357 61.35.227z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M25.723 16.333c-4.857.387-5.96.467-8.73-1.563L9.15 9.203C7.6 7.837 7.017 7.253 7.017 5.697c0-1.943 1.167-3.497 5.443-3.88L64.85.063c5.443-.39 8.167.97 10.3 2.53l9.333 6.607c.583.39 2.14 2.14 2.14 3.5 0 1.943-1.553 3.883-5.057 4.08l-55.843 3.553zm-4.473 73.517V32.66c0-2.723 1.363-4.087 3.883-4.28l58.177-3.5c2.527-.193 3.883 1.363 3.883 4.087v56.803c0 2.723-1.553 5.443-5.44 5.637l-52.533 2.917c-3.89.193-5.97-1.167-5.97-4.473zm52.34-53.31c.39 1.75 0 3.5-1.75 3.697l-2.53.483v41.863c-2.14 1.167-4.277 1.75-5.833 1.75-2.723 0-3.5-.967-5.44-3.307l-16.69-26.39v25.617l5.44 1.167s0 3.5-4.857 3.5l-13.39.777c-.39-.777 0-2.723 1.36-3.113l3.5-.97V38.3l-4.857-.39c-.39-1.75.583-4.277 3.3-4.473l14.347-.97 17.467 26.78V35.02l-4.473-.583c-.39-2.14 1.167-3.693 3.11-3.887l13.39-.777z" fill="hsl(var(--card))"/>
    </svg>
  );
}

export function ZoteroLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#CC2936"/>
      <path d="M8 10h16v2.4L12.8 22H24v2.4H8V22l11.2-9.6H8V10z" fill="white"/>
    </svg>
  );
}

export function ReadwiseLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#F5C518"/>
      <path d="M10 8h8a4 4 0 010 8h-2l6 8h-3.5l-5.5-7.5V24H10V8zm3 3v5h4.5a2.5 2.5 0 000-5H13z" fill="white"/>
    </svg>
  );
}

export function AnkiLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#235DBA"/>
      <path d="M8 24V11l3-3h10l3 3v13l-3 3H11l-3-3z" fill="white" fillOpacity="0.15"/>
      <path d="M10 22V13l2-2h8l2 2v9l-2 2h-8l-2-2z" stroke="white" strokeWidth="1.5"/>
      <path d="M16 14.5v5M14 16.5h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 10l1-1h6l1 1" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M13 8.5l.5-.5h5l.5.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6"/>
    </svg>
  );
}

export function ObsidianLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#7C3AED"/>
      <path d="M16 5l9 6v10l-9 6-9-6V11l9-6z" fill="white" fillOpacity="0.15"/>
      <path d="M16 7l7 4.667v9.333L16 25.667 9 21V11.667L16 7z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M16 7v18.667M9 11.667L16 16l7-4.333" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}
