import { ManagedPageSections, FAQList, DocumentContact } from '@/components/managed-page-sections';
import { PAGE_DEFINITIONS } from '@/lib/site-page-defaults';
import { StructuredData, breadcrumbData } from '@/lib/seo-data';
import { SITE_URL } from '@/lib/seo';
export default function PublicDocument({slug,page}){
 const d=PAGE_DEFINITIONS[slug];
 const isFaq=slug==='faqs';
 return <main id="main">
   <StructuredData data={breadcrumbData([{name:'Home',path:'/'},{name:d.name,path:d.path}])}/>
   {isFaq&&<StructuredData data={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:(page.faqs||[]).filter(x=>x.question&&x.answer).map(x=>({'@type':'Question',name:x.question,acceptedAnswer:{'@type':'Answer',text:x.answer}}))}}/>}
   <section className="site-document-hero"><div className="shell"><span className="eyebrow">DREAMTRAWELL DESTINATION · INFORMATION</span><h1>{page.heroTitle || d.title}</h1><p>{page.heroDescription || d.description}</p></div></section>
   <div className="site-document-main"><div className="shell">{isFaq?<FAQList items={page.faqs}/>:<ManagedPageSections page={page} label="REFERENCE INFORMATION"/>}<DocumentContact/></div></div>
 </main>;
}
