import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import PublicDocument from '@/components/public-document';
export async function generateMetadata(){return pageRecordMetadata('accessibility',await getPublicPage('accessibility'));}
export default async function Page(){const page=await getPublicPage('accessibility');return <PublicDocument slug="accessibility" page={page}/>;}
