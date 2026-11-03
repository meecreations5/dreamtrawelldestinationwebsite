// Shared pure filtering rules used by the package and destination browsers.
export const canonicalCategory = value => String(value || '').toLowerCase().replace(/\s+/g,' ').trim() === 'programme' ? 'Trade programme' : value;
const normalized = value => String(value || '').normalize('NFKD').toLowerCase();
const matchProfile = (dest, profile) => {
  if (!profile || profile === 'All travellers') return true;
  const hints = {
    Family: ['famil','child','kid'], Honeymoon: ['honeymoon','couple','romantic'],
    Group: ['group','mice','corporate','incentive'], Corporate:['corporate','mice','business','incentive'],
    Luxury:['luxury','premium','resort','high-end']
  };
  const haystack=normalized([...(dest.travellerProfiles||[]),dest.summary,dest.destinationOverview].join(' '));
  return (hints[profile]||[normalized(profile)]).some(x=>haystack.includes(x));
};
export const filterDestinations = (list, query='', profile='All travellers') => list.filter(d=>{
  const experiences=(d.experienceHighlights||[]).flatMap(e=>[e.title,e.description]);
  const areas=(d.areaProfiles||[]).flatMap(a=>[a.area,a.advantages,a.suitableFor]);
  const text=[d.name,d.eyebrow,d.summary,d.destinationHeadline,d.destinationOverview,
    ...(d.travellerProfiles||[]),...(d.areas||[]),...(d.sellingAreas||[]),
    ...(d.activities||[]),...(d.standardExperiences||[]),...(d.offbeatIdeas||[]),...experiences,...areas].join(' ');
  return normalized(text).includes(normalized(query.trim())) && matchProfile(d,profile);
});
export const filterPackages = (list,{destination='',category='',nights='',query=''}={}) => list.filter(p=>
  (!destination||p.destination===destination)&&(!category||p.category===canonicalCategory(category))&&
  (!nights||p.nights>=Number(nights))&&
  (!query||normalized([p.title,p.destination,p.summary,p.category,p.audience,...(p.days||[]).flatMap(d=>[d.title,d.description]),...(p.upgrades||[])].join(' ')).includes(normalized(query.trim())))
);
