import { StructuredData } from '@/lib/seo-data';
import { SITE_URL } from '@/lib/seo';
import { getPublicPage } from '@/lib/content-pages';
import { getPublicCopy, getPublicSocialLinks } from '@/lib/content';
import { Header, Footer } from '@/components/chrome';
import AnalyticsInit from '@/components/analytics-init';
import MotionEffects from '@/components/motion-effects';
import SiteTheme from '@/components/site-theme';
import MobileDock from '@/components/mobile-dock';
import CookieConsent from '@/components/cookie-consent';
import { getPublicTheme } from '@/lib/content';
export default async function SiteLayout({children}) { const [copy, theme, contactPage, socialLinks] = await Promise.all([getPublicCopy(),getPublicTheme(),getPublicPage('contact'),getPublicSocialLinks()]); return <SiteTheme initialTheme={theme}><StructuredData data={{'@context':'https://schema.org','@type':'Organization',name:'DreamTrawell Destination',url:SITE_URL,logo:`${SITE_URL}/assets/dreamtrawell-official-logo.png`,description:'Business-to-business destination management and ground travel planning for travel agents.',sameAs:Object.values(socialLinks).filter(Boolean)}}/><a className="skip" href="#main">Skip to content</a><Header/>{children}<Footer copy={copy} contactPage={contactPage} socialLinks={socialLinks}/><MobileDock/><CookieConsent/><AnalyticsInit/><MotionEffects/></SiteTheme>; }
