/** Integration logos — PNG assets in public/logos/, trimmed to content bounds */

function LogoImg({ src, alt, className = "h-5 w-5" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`${className} object-contain`} draggable={false} />;
}

export function NotionLogo({ className = "h-5 w-5" }: { className?: string }) {
  return <LogoImg src="/logos/notion.png" alt="Notion" className={className} />;
}

export function GoogleDriveLogo({ className = "h-5 w-5" }: { className?: string }) {
  return <LogoImg src="/logos/google-drive.png" alt="Google Drive" className={className} />;
}

export function GoogleCalendarLogo({ className = "h-5 w-5" }: { className?: string }) {
  return <LogoImg src="/logos/google-calendar.png" alt="Google Calendar" className={className} />;
}

export function ZoteroLogo({ className = "h-5 w-5" }: { className?: string }) {
  return <LogoImg src="/logos/zotero.png" alt="Zotero" className={className} />;
}

export function ReadwiseLogo({ className = "h-5 w-5" }: { className?: string }) {
  return <LogoImg src="/logos/readwise.png" alt="Readwise" className={className} />;
}

export function ObsidianLogo({ className = "h-5 w-5" }: { className?: string }) {
  return <LogoImg src="/logos/obsidian.png" alt="Obsidian" className={className} />;
}
