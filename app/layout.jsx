import './globals.css';
import './package-polish.css';
import './luxury.css';
import './home-colour-bands.css';
import './pearl-mist.css';
import './v13-0-3-polish.css';
import './v13-0-4-contrast.css';
import './v14-cms-seo.css';
import './v14-brand-social.css';
export const metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), robots: { index: process.env.SITE_INDEXABLE === 'true', follow: process.env.SITE_INDEXABLE === 'true' },  icons: {icon:[{url:'/favicon.ico',sizes:'any'},{url:'/icon.png',type:'image/png',sizes:'512x512'}],shortcut:'/favicon.ico',apple:[{url:'/apple-icon.png',sizes:'180x180',type:'image/png'}]},
  title: { default: 'DreamTrawell Destination | B2B DMC', template: '%s | DreamTrawell DMC' }, description: 'Destination knowledge, B2B land packages, FIT, groups, MICE and customised enquiries for travel professionals.' };
export default function RootLayout({ children }) { return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/></head><body>{children}</body></html>; }
