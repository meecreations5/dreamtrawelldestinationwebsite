'use client';
import { collection, doc, getDoc, getDocs, query, orderBy, where, limit, setDoc, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import { clientAuth, clientDb, clientStorage } from '@/lib/firebase-client';
import { contentSchemas, enquirySchema } from '@/lib/validation';
export const collections = { destinations:'siteDestinations', packages:'sitePackages', testimonials:'siteTestimonials', promotions:'sitePromotions' };

export async function getAdminRole(user) {
  if (!user || user.isAnonymous) return null;
  const snapshot = await getDoc(doc(clientDb(), 'adminUsers', user.uid));
  const data = snapshot.exists() ? snapshot.data() : null;
  return data?.active === true && ['admin', 'super_admin'].includes(data?.role) ? data.role : null;
}
export async function fetchAdminItems(type) {
  const db = clientDb();
  const coll = type === 'enquiries' ? 'websiteEnquiries' : collections[type];
  if (!coll) throw new Error('Unknown content type');
  // Admin permission is enforced by Firestore Rules, never just React state.
  const results = await getDocs(type === 'enquiries'
    ? query(collection(db, coll), orderBy('createdAt', 'desc'), limit(100))
    : query(collection(db, coll), limit(500)));
  return results.docs.map(d => ({ ...d.data(), id: d.id, ...(type === 'enquiries' ? {} : { slug: d.id }) }));
}
export async function saveCmsItem(type, input, isNew, uid) {
 const schema=contentSchemas[type];if(!schema)throw new Error('Unknown CMS module');
 const parsed=schema.safeParse(input);if(!parsed.success)throw new Error(parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '));
 const item=parsed.data;
 if(type==='testimonials'&&item.status==='published'&&!item.consentVerified)throw new Error('Review permission must be verified before publishing a testimonial.');
 const db=clientDb(),record=doc(db,collections[type],item.slug),previous=await getDoc(record);
 if(isNew&&previous.exists())throw new Error('This page URL already exists.');
 if(!isNew&&!previous.exists())throw new Error('Record not found. Refresh first.');
 const batch=writeBatch(db);
 const payload={...item,createdAt:previous.exists()?previous.data().createdAt:serverTimestamp(),updatedAt:serverTimestamp(),updatedBy:uid};
 batch.set(record,payload);
 const revision=doc(collection(db,'siteRevisions'));
 // Save an immutable, staff-only snapshot of the revision being replaced.
 batch.set(revision,{ recordKey:`${type}:${item.slug}`,type,slug:item.slug,action:isNew?'created':'updated',snapshot:previous.exists()?stripSystemFields(previous.data()):item,createdBy:uid,createdAt:serverTimestamp() });
 await batch.commit();return item.slug;
}
function stripSystemFields(data){const {createdAt,updatedAt,updatedBy,...content}=data;return content;}
export async function fetchRevisions(type,slug){
 if(!collections[type]||!slug)return [];
 const rows=await getDocs(query(collection(clientDb(),'siteRevisions'),where('recordKey','==',`${type}:${slug}`),limit(50)));
 return rows.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
}
export async function saveEnquiryStatus(reference, status, uid) {
 if(!['new_enquiry','in_progress','quoted','closed'].includes(status))throw new Error('Invalid enquiry status');
 await updateDoc(doc(clientDb(),'websiteEnquiries',reference),{status,updatedAt:serverTimestamp(),updatedBy:uid});
}
export async function updateEnquiryOperations(id,changes,uid){
 const allowed=['status','assignedTo','priority','internalNote','crmSyncStatus','crmLeadId'];
 if(Object.keys(changes).some(k=>!allowed.includes(k)))throw new Error('Unsupported enquiry update');
 const values={...changes};
 if(values.priority&&!['normal','high','urgent'].includes(values.priority))throw new Error('Invalid priority');
 if(values.crmSyncStatus&&!['pending_mapping','exported','linked'].includes(values.crmSyncStatus))throw new Error('Invalid CRM handoff status');
 for(const field of ['assignedTo','internalNote','crmLeadId'])if(values[field]&&values[field].length>(field==='internalNote'?1500:150))throw new Error('Field too long');
 await updateDoc(doc(clientDb(),'websiteEnquiries',id),{...values,updatedAt:serverTimestamp(),updatedBy:uid});
}
export async function listMediaAssets(){const rows=await getDocs(query(collection(clientDb(),'siteMedia'),limit(400)));return rows.docs.map(d=>({id:d.id,...d.data()}));}
export async function addMediaAsset(file,metadata,uid){
 if(!metadata?.alt?.trim()||!metadata?.rights?.trim())throw new Error('Image description and usage rights are required.');
 const uploaded=await uploadWebsiteImage(file,uid,true);
 const url=uploaded.url;
 const assetRef=doc(collection(clientDb(),'siteMedia'));
 await setDoc(assetRef,{url,alt:metadata.alt.trim().slice(0,240),rights:metadata.rights.trim().slice(0,220),destination:metadata.destination?.slice(0,80)||'',name:file.name.slice(0,180),contentType:uploaded.contentType,size:uploaded.size,createdAt:serverTimestamp(),createdBy:uid});
 return assetRef.id;
}
export async function createLibraryItem(item,uid){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug||''))throw new Error('Use a valid URL key');
 if(!['experience','hotel'].includes(item.kind))throw new Error('Invalid library type');
 if(!item.name?.trim()||!item.destination?.trim())throw new Error('Title and destination are required');
 const d=doc(clientDb(),'siteKnowledge',item.slug);if((await getDoc(d)).exists())throw new Error('This library item already exists.');
 await setDoc(d,{slug:item.slug,kind:item.kind,name:item.name.slice(0,160),destination:item.destination.slice(0,80),description:(item.description||'').slice(0,2000),guidance:(item.guidance||'').slice(0,1200),status:'draft',createdAt:serverTimestamp(),updatedAt:serverTimestamp(),updatedBy:uid});
}
export async function updateLibraryItem(item,uid){
 const ref=doc(clientDb(),'siteKnowledge',item.id);const previous=await getDoc(ref);if(!previous.exists())throw new Error('Record not found');
 if(!['draft','in_review','published','archived'].includes(item.status))throw new Error('Invalid status');
 await updateDoc(ref,{name:item.name.trim().slice(0,160),destination:item.destination.slice(0,80),description:(item.description||'').slice(0,2000),guidance:(item.guidance||'').slice(0,1200),status:item.status,updatedAt:serverTimestamp(),updatedBy:uid});
}
export async function fetchLibraryItems(){const rows=await getDocs(query(collection(clientDb(),'siteKnowledge'),limit(500)));return rows.docs.map(d=>({...d.data(),id:d.id}));}
export async function uploadWebsiteImage(file, uid, returnDetails = false) {
  const allowed = { 'image/png':'png','image/jpeg':'jpg','image/webp':'webp' };
  const extension = allowed[file?.type];
  if (!extension || file.size < 100 || file.size > 5_000_000)
    throw new Error('Choose PNG, JPG or WebP under 5 MB.');
  // New media URLs are immutable (UUID), so a long cache lifetime is safe.
  // Compress oversized marketing photos in the admin browser; keep original on unsupported devices.
  let uploadFile=file, targetExt=extension;
  if (typeof document!=='undefined' && typeof createImageBitmap==='function') {
    try {
      const bitmap=await createImageBitmap(file);
      const MAX=2000;const ratio=Math.min(1,MAX/Math.max(bitmap.width,bitmap.height));
      if(ratio<1 || file.type!=='image/webp') {
        const canvas=document.createElement('canvas');
        canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);
        canvas.getContext('2d')?.drawImage(bitmap,0,0,canvas.width,canvas.height);
        const optimized=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',0.86));
        if(optimized && optimized.size>100 && optimized.size<file.size && optimized.size<5_000_000){uploadFile=optimized;targetExt='webp';}
      }
      bitmap.close();
    }catch{/* Fall back to the approved original image if browser compression fails. */}
  }
  const path = `website-media/${uid}/${crypto.randomUUID()}.${targetExt}`;
  const imageRef = ref(clientStorage(), path);
  await uploadBytes(imageRef, uploadFile, { contentType: uploadFile.type, cacheControl:'public,max-age=31536000,immutable' });
  const url=await getDownloadURL(imageRef);
  return returnDetails?{url,contentType:uploadFile.type,size:uploadFile.size}:url;
}
export async function importStarterCatalogue(uid, destinations, packages) {
  const db = clientDb();
  const existing = await getDoc(doc(db, 'siteSettings', 'catalogue'));
  if (existing.exists() && existing.data().initialized) throw new Error('Catalogue already initialized. Import is disabled to avoid overwriting edits.');
  const batch = writeBatch(db);
  for (const seed of destinations) {
    const parsed = contentSchemas.destinations.parse({ ...seed, status:'published' });
    batch.set(doc(db, collections.destinations, parsed.slug), { ...parsed, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), updatedBy: uid });
  }
  for (const seed of packages) {
    const parsed = contentSchemas.packages.parse(seed);
    batch.set(doc(db, collections.packages, parsed.slug), { ...parsed, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), updatedBy: uid });
  }
  batch.set(doc(db, 'siteSettings', 'catalogue'), { initialized:true, updatedAt:serverTimestamp(), updatedBy:uid });
  await batch.commit();
  return destinations.length + packages.length;
}

export async function fetchStaffAccounts() {
  const snapshot = await getDocs(query(collection(clientDb(), 'adminUsers'), limit(100)));
  return snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));
}
export async function saveStaffAccount(operatorUid, uid, role, active, displayName = '', email = '') {
  if (!/^[a-zA-Z0-9_-]{15,128}$/.test(uid)) throw new Error('Enter a valid Firebase Authentication UID.');
  if (uid === operatorUid) throw new Error('You cannot edit your own access. Use the Firebase Console for recovery.');
  if (!['admin','super_admin'].includes(role)) throw new Error('Invalid role');
  const ref = doc(clientDb(),'adminUsers',uid);
  const snap = await getDoc(ref);
  const payload = { role, active:active === true, email:email.trim().slice(0,180), displayName:displayName.trim().slice(0,120), updatedBy: operatorUid, updatedAt: serverTimestamp() };
  if (snap.exists()) await updateDoc(ref,payload);
  else await setDoc(ref,{ ...payload, createdAt:serverTimestamp() });
}
// Append previously omitted static guide fields; preserve any CMS-authored value already present.
// Replace ONLY starter-placeholder package images. Custom uploaded thumbnails are not changed.
export async function syncMissingStaticContent(uid, destinations, packages) {
  const db=clientDb();
  const imageByDestination = Object.fromEntries(destinations.map(d => [d.name, d.hero?.split('?')[0]]));
  let updatedGuides=0, updatedImages=0, updatedProgrammes=0;
  for (const seed of destinations) {
    const ref=doc(db,collections.destinations,seed.slug);
    const existing=await getDoc(ref);
    if (!existing.exists()) continue;
    const previous=existing.data();
    const patch={};
    for (const key of ['destinationHeadline','destinationOverview','sellingAreas','travellerProfiles','planningHeadline','planningNote','experienceHighlights','areaProfiles','standardExperiences','offbeatIdeas','hotelGuidance','operationalNotes']) {
      if (previous[key] === undefined || previous[key] === null) patch[key]=seed[key];
    }
    if (Object.keys(patch).length) {
      await updateDoc(ref,{...patch,updatedBy:uid,updatedAt:serverTimestamp()});
      updatedGuides++;
    }
  }
  for (const seed of packages) {
    const ref=doc(db,collections.packages,seed.slug);
    const existing=await getDoc(ref);
    if (!existing.exists()) continue;
    const previous=existing.data();
    const fallback=imageByDestination[seed.destination];
    const existingUrl=(previous.image || '').split('?')[0];
    const isStarterImage=existingUrl && existingUrl === fallback;
    const patch={};
    if (isStarterImage) patch.image=seed.image;
    // Restore optional trade-programme fields only when missing; never overwrite edited records.
    if (seed.category === 'Trade programme') {
      for (const key of ['operationsChecklist','exclusionsNote']) {
        if (previous[key] === undefined && seed[key] !== undefined) patch[key]=seed[key];
      }
    }
    if (!previous.imageAlt) patch.imageAlt=seed.imageAlt;
    if(Object.keys(patch).length) {
      await updateDoc(ref,{...patch,updatedBy:uid,updatedAt:serverTimestamp()});
      if(isStarterImage)updatedImages++;
      if(patch.operationsChecklist || patch.exclusionsNote)updatedProgrammes++;
    }
  }
  return { updatedGuides, updatedImages, updatedProgrammes };
}

export async function submitWebsiteEnquiry(input) {
  if (input.website) throw new Error('Unable to process this request.');
  if (Date.now() - input.formStartedAt < 2500) throw new Error('Please review the enquiry before submitting.');
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) throw new Error('Please check the required quotation fields.');
  let user = clientAuth().currentUser;
  if (!user) user = (await signInAnonymously(clientAuth())).user;
  // Authentication protects the write but never gives the applicant read access.
  const database = clientDb();
  const target = doc(collection(database, 'websiteEnquiries'));
  const reference = `WEB-${target.id.slice(0, 10).toUpperCase()}`;
  const { website, formStartedAt, consent, ...data } = parsed.data;
  const payload = {
    ...data, reference, source:'dreamtrawell_website', status:'new_enquiry',
    crmSyncStatus:'pending_mapping', submittedBy:user.uid, consentCaptured:true,
    createdAt:serverTimestamp(),
  };
  await setDoc(target, payload);
  return { reference, id:target.id };
}
