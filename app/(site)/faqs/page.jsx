import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import PublicDocument from '@/components/public-document';
export async function generateMetadata(){return pageRecordMetadata('faqs',await getPublicPage('faqs'));}
export default async function Page(){const page=await getPublicPage('faqs');return <PublicDocument slug="faqs" page={page}/>;}
