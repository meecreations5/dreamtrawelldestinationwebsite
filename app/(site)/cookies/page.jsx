import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import PublicDocument from '@/components/public-document';
export async function generateMetadata(){return pageRecordMetadata('cookies',await getPublicPage('cookies'));}
export default async function Page(){const page=await getPublicPage('cookies');return <PublicDocument slug="cookies" page={page}/>;}
