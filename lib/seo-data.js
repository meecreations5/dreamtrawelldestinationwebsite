import { jsonLd, SITE_URL } from '@/lib/seo';
export function StructuredData({data}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(data)}}/>}
export function breadcrumbData(crumbs){return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:`${SITE_URL}${c.path}`}))};}
