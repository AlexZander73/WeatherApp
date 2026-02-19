const iconSvgs: Record<string, string> = {
  sun: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="currentColor" /><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1.5" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22.5" /><line x1="1.5" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22.5" y2="12" /><line x1="4.2" y1="4.2" x2="6" y2="6" /><line x1="18" y1="18" x2="19.8" y2="19.8" /><line x1="18" y1="6" x2="19.8" y2="4.2" /><line x1="4.2" y1="19.8" x2="6" y2="18" /></g></svg>`,
  'sun-cloud': `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="7" r="3" fill="currentColor" /><path d="M7 15h9a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.6 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>`,
  'cloud-sun': `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="17" cy="7" r="3" fill="currentColor" /><path d="M5 16h10a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.6 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>`,
  cloud: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>`,
  fog: `<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="9" x2="20" y2="9" /><line x1="6" y1="13" x2="18" y2="13" /><line x1="5" y1="17" x2="19" y2="17" /></g></svg>`,
  drizzle: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h10a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.6 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="16" x2="8" y2="20" /><line x1="12" y1="16" x2="12" y2="20" /><line x1="16" y1="16" x2="16" y2="20" /></g></svg>`,
  rain: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h10a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.6 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="9" y1="16" x2="7" y2="20" /><line x1="13" y1="16" x2="11" y2="20" /><line x1="17" y1="16" x2="15" y2="20" /></g></svg>`,
  sleet: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h10a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.6 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="16" x2="8" y2="20" /><circle cx="14" cy="18" r="1.5" fill="currentColor" /></g></svg>`,
  snow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h10a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.6 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="9" y1="16" x2="9" y2="20" /><line x1="7" y1="18" x2="11" y2="18" /><line x1="15" y1="16" x2="15" y2="20" /><line x1="13" y1="18" x2="17" y2="18" /></g></svg>`,
  storm: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h10a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.6 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><path d="M11 14l-2 4h3l-1 4 4-6h-3l1-2z" fill="currentColor" /></svg>`,
  unknown: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" /><circle cx="12" cy="16" r="1.5" fill="currentColor" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>`
}

const iconColors: Record<string, string> = {
  sun: '#ffb200',
  'sun-cloud': '#f3a712',
  'cloud-sun': '#f7b733',
  cloud: '#7f8fa6',
  fog: '#94a3b8',
  drizzle: '#5b9dff',
  rain: '#3a7bd5',
  sleet: '#6ea7c2',
  snow: '#6cc3d5',
  storm: '#6b5b95',
  unknown: '#a0aec0'
}

export function iconSvg(name: string): string {
  return iconSvgs[name] ?? iconSvgs.unknown
}

export function iconColor(name: string): string {
  return iconColors[name] ?? iconColors.unknown
}
