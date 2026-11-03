import { getPublicPage } from '@/lib/content-pages';
import { pageRecordMetadata } from '@/lib/seo';
import PublicDocument from '@/components/public-document';
export async function generateMetadata(){return pageRecordMetadata('terms-of-use',await getPublicPage('terms-of-use'));}
export default async function Page(){const page=await getPublicPage('terms-of-use');return <PublicDocument slug="terms-of-use" page={page}/>;}
