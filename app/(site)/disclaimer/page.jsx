import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import PublicDocument from '@/components/public-document';
export async function generateMetadata(){return pageRecordMetadata('disclaimer',await getPublicPage('disclaimer'));}
export default async function Page(){const page=await getPublicPage('disclaimer');return <PublicDocument slug="disclaimer" page={page}/>;}
