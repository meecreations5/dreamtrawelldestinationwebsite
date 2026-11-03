/** Compatible with anonymous public reads and role-guarded Firestore writes. */
export const DEFAULT_HOME_HERO = Object.freeze({mode:'auto',destinationSlug:'',intervalSeconds:8});
const DESTINATION_SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function sanitizeHomeHero(raw) {
  const mode=raw?.mode==='fixed'?'fixed':'auto';
  const destinationSlug=typeof raw?.destinationSlug==='string'&&raw.destinationSlug.length<=100&&DESTINATION_SLUG.test(raw.destinationSlug)?raw.destinationSlug:'';
  const intervalSeconds=[6,8,12].includes(raw?.intervalSeconds)?raw.intervalSeconds:8;
  return {mode,destinationSlug,intervalSeconds};
}
export function selectHeroDestinations(destinations,settings) {
  const available=(Array.isArray(destinations)?destinations:[]).filter(d=>d&&d.status==='published'&&typeof d.slug==='string'&&typeof d.hero==='string'&&d.hero.trim());
  const safe=sanitizeHomeHero(settings);
  const selected=safe.mode==='fixed'?available.find(d=>d.slug===safe.destinationSlug):null;
  return {items:selected?[selected]:available,mode:selected?'fixed':'auto',intervalSeconds:safe.intervalSeconds};
}
