import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import PublicDocument from '@/components/public-document';
export async function generateMetadata(){return pageRecordMetadata('privacy-policy',await getPublicPage('privacy-policy'));}
export default async function Page(){const page=await getPublicPage('privacy-policy');return <PublicDocument slug="privacy-policy" page={page}/>;}
