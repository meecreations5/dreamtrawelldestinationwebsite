/** Public site theme tokens. No arbitrary CSS or URLs are accepted from Firestore. */
export const THEME_FIELDS = [
  { key: 'navy', label: 'Primary / deep navy', help: 'Headers, dark panels and primary buttons' },
  { key: 'red', label: 'Signature accent', help: 'Quotation buttons, selected states and highlights' },
  { key: 'ivory', label: 'Pearl Mist / light background', help: 'Calm Pearl Mist section backgrounds' },
  { key: 'champagne', label: 'Soft Cloud / tonal accent', help: 'Soft Cloud section separation and subtle rules' },
  { key: 'surface', label: 'Card / surface', help: 'Cards, navigation and content surfaces' },
  { key: 'ink', label: 'Text / ink', help: 'Headings and primary text' },
];
export const DEFAULT_THEME = Object.freeze({
  navy: '#0C2946', red: '#BD3046', ivory: '#F4F8FA',
  champagne: '#EAF1F5', surface: '#FFFFFF', ink: '#425466',
});
export const THEME_PRESETS = Object.freeze([
  { id: 'pearl', name: 'Pearl Mist (Recommended)', description: 'White, calm pearl and soft cloud with brand navy and red', palette: DEFAULT_THEME },
  { id: 'coastal', name: 'Coastal Executive', description: 'Cool blue-white and slate with brand accents', palette: { navy:'#133A56',red:'#AD3148',ivory:'#F2F7FA',champagne:'#E4EFF4',surface:'#FFFFFF',ink:'#425466' } },
  { id: 'classic', name: 'Classic Brand', description: 'Classic navy, red and understated neutral surfaces', palette: { navy:'#172A40',red:'#A9344B',ivory:'#F6F8FA',champagne:'#EBEFF3',surface:'#FFFFFF',ink:'#425466' } },
]);
const HEX = /^#[0-9a-fA-F]{6}$/;
export function sanitizeTheme(input) {
  return Object.fromEntries(THEME_FIELDS.map(({key}) => [key, typeof input?.[key] === 'string' && HEX.test(input[key]) ? input[key].toUpperCase() : DEFAULT_THEME[key]]));
}
export function themeVariables(input) {
  const p = sanitizeTheme(input);
  return {
    '--navy': p.navy, '--ink': p.ink, '--red': p.red,
    '--luxury-ivory': p.ivory, '--luxury-champagne': p.champagne,
    '--luxury-surface': p.surface, '--luxury-ink': p.ink,
    '--dt-pearl': p.ivory, '--dt-cloud': p.champagne, '--dt-muted': p.ink,
    '--soft': p.ivory, '--blue': p.navy,
    '--border': `color-mix(in srgb, ${p.navy} 13%, ${p.surface})`,
    '--dt-card-border': `color-mix(in srgb, ${p.navy} 13%, ${p.surface})`,
  };
}
function luminance(hex) {
  const channels = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255);
  const values = channels.map(v => v <= 0.04045 ? v/12.92 : ((v + 0.055)/1.055)**2.4);
  return values[0]*0.2126 + values[1]*0.7152 + values[2]*0.0722;
}
export function contrastRatio(a,b) {
  if (!HEX.test(a)||!HEX.test(b)) return 0;
  const l1=luminance(a), l2=luminance(b);
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
}
export function validateTheme(input) {
  const missing = THEME_FIELDS.filter(({key}) => !HEX.test(input?.[key]||'')).map(({label}) => label);
  if (missing.length) return `Use six-digit hex colours for: ${missing.join(', ')}.`;
  if (contrastRatio(input.ink,input.surface)<4.5 || contrastRatio(input.ink,input.ivory)<4.5) return 'Text must have at least 4.5:1 contrast on cards and Pearl Mist backgrounds.';
  if (contrastRatio(input.navy,input.ivory)<4.5) return 'Primary navy must have at least 4.5:1 contrast on Pearl Mist backgrounds.';
  if (contrastRatio(input.navy,'#FFFFFF')<4.5) return 'Primary navy must have at least 4.5:1 contrast with white button text.';
  if (contrastRatio(input.red,'#FFFFFF')<4.5) return 'Accent red must have at least 4.5:1 contrast with white button text.';
  return '';
}
