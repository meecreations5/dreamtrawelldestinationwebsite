import Link from 'next/link';
// Sections are plain text; no HTML injection or user-authored scripts.
export function ManagedPageSections({ page, label='MORE FROM THE DESTINATION DESK' }) {
  if (!page?.sections?.length) return null;
  return <section className="section site-managed-sections"><div className="shell">
    <span className="eyebrow">{label}</span>
    <div className="site-managed-grid">{page.sections.filter(s=>s?.heading && (s?.body || s?.items?.length)).map((s,i)=><article key={`${s.heading}:${i}`} className="site-managed-block"><h2>{s.heading}</h2>{s.body?.split(/\n\n+/).filter(Boolean).map((p,j)=><p key={j}>{p}</p>)}{Array.isArray(s.items) && s.items.length>0 && <ul>{s.items.map((item,j)=><li key={j}>{item}</li>)}</ul>}</article>)}</div>
  </div></section>;
}
export function FAQList({ items }) {
 if (!items?.length) return null;
 return <div className="site-faq-list">{items.filter(x=>x?.question && x?.answer).map((item,i)=><details key={`${item.question}:${i}`} className="site-faq-item"><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}
export function DocumentContact(){return <p className="site-document-contact">Have a question about this information? <Link href="/contact">Contact the DreamTrawell trade desk</Link>.</p>}
